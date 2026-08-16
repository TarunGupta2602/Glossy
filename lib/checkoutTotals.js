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
    // Gift value is shown as savings; do not subtract from what the customer pays.
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
