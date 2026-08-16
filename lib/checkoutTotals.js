import { calculateBuy2Get1Free } from "@/lib/promo";
import {
    FREE_SHIPPING_THRESHOLD,
    PAID_SHIPPING_FEE,
} from "@/lib/promo";

export { FREE_SHIPPING_THRESHOLD, PAID_SHIPPING_FEE };

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
    const shippingFee =
        cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : PAID_SHIPPING_FEE;
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
    { persistFallback = false } = {}
) {
    let cartRows = await loadUserCartRows(supabase, userId);

    if (!cartRows.length && clientItems?.length) {
        cartRows = await loadCartRowsFromItemRefs(supabase, clientItems);

        if (persistFallback && cartRows.length) {
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
