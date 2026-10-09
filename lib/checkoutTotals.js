import { calculateBuy2Get1Free, getShippingFee } from "@/lib/promo";
import { isWelcomeCode, welcomeDiscountAmount } from "@/lib/welcomeOffer";

/**
 * Build cart line items + totals from DB cart rows and catalog products.
 * Paid total never subtracts gift MRP (gifts are ₹0 line items).
 */
export function buildCheckoutFromCart(cartRows = [], allProducts = []) {
    const cart = (cartRows || [])
        .filter((row) => row.product)
        .map((row) => ({
            id: row.product.id,
            slug: row.product.slug,
            name: row.product.name,
            price: Number(row.product.price) || 0,
            description: row.product.description,
            image: row.product.main_image || "/logo.png",
            category: row.product.categories?.name || "Jewellery",
            quantity: Number(row.quantity) || 1,
            stock_count: row.product.stock_count,
        }));

    const promo = calculateBuy2Get1Free(cart, allProducts);
    const cartSubtotal = cart.reduce(
        (sum, item) => sum + item.price * (item.quantity || 0),
        0
    );
    const discountAmount = promo.discountAmount;
    const shippingFee = getShippingFee(cartSubtotal);
    const welcomeDiscount = 0;
    const cartTotal = cartSubtotal + shippingFee;

    const checkoutItems = cart.map((item) => ({
        ...item,
        isFreeGift: false,
    }));

    (promo.freeGiftSelections || []).forEach((selection) => {
        checkoutItems.push({
            id: selection.productId,
            name: selection.name,
            image: selection.image,
            category: selection.category,
            quantity: 1,
            price: 0,
            originalPrice: Number(selection.price) || 0,
            isFreeGift: true,
        });
    });

    return {
        cart,
        promo,
        cartSubtotal,
        discountAmount,
        welcomeDiscount,
        shippingFee,
        cartTotal,
        checkoutItems,
    };
}

export async function loadUserCartRows(supabase, userId) {
    const { data, error } = await supabase
        .from("cart_items")
        .select(
            `
            quantity,
            product:products (
                id,
                slug,
                name,
                price,
                description,
                main_image,
                stock_count,
                categories(name)
            )
        `
        )
        .eq("user_id", userId);

    if (error) throw error;
    return data || [];
}

export async function loadPromoProducts(supabase) {
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, main_image, stock_count, categories(name)")
        .order("price", { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * FIRST10 is 10% off the merchandise subtotal, once, for a customer with no
 * earlier order. Cancelled orders do not use up the offer. A guest is checked
 * by mobile number. Empty code is fine.
 */
export async function resolveWelcomeDiscount(supabase, userId, code, subtotal, phone = "") {
    const raw = String(code || "").trim();
    if (!raw) return { error: null, welcomeDiscount: 0 };
    if (!isWelcomeCode(raw)) {
        return { error: "That code is not valid", welcomeDiscount: 0 };
    }

    const prior = await hasPriorOrder(supabase, { userId, phone });
    if (prior.error) return { error: prior.error, welcomeDiscount: 0 };
    if (prior.used) {
        return { error: "FIRST10 is only for your first order", welcomeDiscount: 0 };
    }

    return { error: null, welcomeDiscount: welcomeDiscountAmount(subtotal) };
}

async function hasPriorOrder(supabase, { userId, phone }) {
    const openOrder = "order_status.is.null,order_status.neq.cancelled";

    if (userId) {
        const { count, error } = await supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .or(openOrder);
        if (error) {
            console.error("Welcome offer lookup error:", error);
            return { error: "Could not check the offer. Try again.", used: true };
        }
        if ((count || 0) > 0) return { error: null, used: true };
    }

    const mobile = String(phone || "").replace(/\D/g, "");
    const normalized = mobile.length === 12 && mobile.startsWith("91") ? mobile.slice(2) : mobile;
    if (/^[6-9]\d{9}$/.test(normalized)) {
        const { count, error } = await supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("contact_phone", normalized)
            .or(openOrder);
        if (error) {
            console.error("Welcome offer phone lookup error:", error);
            return { error: "Could not check the offer. Try again.", used: true };
        }
        if ((count || 0) > 0) return { error: null, used: true };
    }

    return { error: null, used: false };
}

/**
 * Build cart rows from client item refs using server product prices only.
 * Accepts [{ id|productId, quantity }].
 */
export async function loadCartRowsFromItemRefs(supabase, itemRefs = []) {
    const cleaned = [];
    for (const raw of itemRefs) {
        const id = raw?.id || raw?.productId;
        const quantity = Math.max(1, Math.min(99, Number(raw?.quantity) || 1));
        if (!id || raw?.isFreeGift) continue;
        cleaned.push({ id: String(id), quantity });
    }

    if (!cleaned.length) return [];

    const ids = [...new Set(cleaned.map((i) => i.id))];
    const qtyById = cleaned.reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + item.quantity;
        return acc;
    }, {});

    const { data: products, error } = await supabase
        .from("products")
        .select(
            `
            id,
            slug,
            name,
            price,
            description,
            main_image,
            stock_count,
            categories(name)
        `
        )
        .in("id", ids);

    if (error) throw error;

    return (products || []).map((product) => ({
        quantity: qtyById[product.id] || 1,
        product,
    }));
}

/**
 * Prefer DB cart; if empty, fall back to client item refs (server-priced).
 * Optionally upsert fallback items into cart_items for consistency.
 */
export async function resolveCheckoutCart(
    supabase,
    userId,
    clientItems = [],
    { persistFallback = false, welcomeCode = "", phone = "", useClientItems = false } = {}
) {
    let cartRows = [];
    if (userId && !useClientItems) {
        cartRows = await loadUserCartRows(supabase, userId);
    }

    if (!cartRows.length && clientItems?.length) {
        cartRows = await loadCartRowsFromItemRefs(supabase, clientItems);

        if (persistFallback && userId && cartRows.length) {
            for (const row of cartRows) {
                await supabase.from("cart_items").upsert(
                    {
                        user_id: userId,
                        product_id: row.product.id,
                        quantity: row.quantity,
                    },
                    { onConflict: "user_id,product_id" }
                );
            }
        }
    }

    if (!cartRows.length) {
        return { cartRows: [], checkout: null, error: "Cart is empty" };
    }

    const allProducts = await loadPromoProducts(supabase);
    const checkout = buildCheckoutFromCart(cartRows, allProducts);
    const welcome = await resolveWelcomeDiscount(
        supabase,
        userId,
        welcomeCode,
        checkout.cartSubtotal,
        phone
    );
    if (welcome.error) {
        return { cartRows, checkout: null, error: welcome.error };
    }
    checkout.welcomeDiscount = welcome.welcomeDiscount;
    checkout.cartTotal = Math.max(
        0,
        checkout.cartSubtotal - checkout.welcomeDiscount + checkout.shippingFee
    );

    for (const item of checkout.cart) {
        if (item.stock_count != null && item.stock_count < (item.quantity || 1)) {
            return {
                cartRows,
                checkout: null,
                error: `Insufficient stock for ${item.name}`,
            };
        }
    }

    for (const gift of checkout.promo.freeGiftSelections || []) {
        const product = allProducts.find((p) => p.id === gift.productId);
        if (product?.stock_count != null && product.stock_count < 1) {
            return {
                cartRows,
                checkout: null,
                error: `Free gift out of stock: ${gift.name}`,
            };
        }
    }

    if (checkout.cartTotal <= 0) {
        return { cartRows, checkout: null, error: "Invalid cart total" };
    }

    return { cartRows, checkout, error: null, allProducts };
}
