/**
 * Buy 2 Get 1 Free — one complimentary gift for every 2 paid items in the cart.
 * An eligible piece from the collection (not already in the cart) is added as the gift for each complete set.
 *
 * Gift MRP is reported as discountAmount (savings), but cartTotal is paid items only
 * (gifts are charged at ₹0 as separate line items — do not subtract gift MRP again).
 */
export const FREE_ITEM_PRODUCT_IDS = []; // Deprecated — gift is selected from eligible catalogue pieces

/** Lowest shipping and delivery charge. Higher carts pay more. */
export const PAID_SHIPPING_FEE = 50;

/** One flat shipping and delivery fee. A bigger cart does not cost more to ship. */
export function getShippingFee(subtotal) {
    const amount = Number(subtotal) || 0;
    if (amount <= 0) return 0;
    return PAID_SHIPPING_FEE;
}

export const SHIPPING_FEE_SUMMARY =
    "Shipping and delivery is a flat ₹50 on every order.";

export function calculateBuy2Get1Free(cartItems = [], allProducts = []) {
    const units = [];

    cartItems.forEach((item) => {
        const quantity = Number(item.quantity) || 1;
        for (let i = 0; i < quantity; i += 1) {
            units.push({
                productId: item.id,
                name: item.name,
                price: Number(item.price) || 0,
                image: item.image || item.main_image || "/logo.png",
                category: item.category || "Jewellery",
            });
        }
    });

    const cartSubtotal = units.reduce((sum, u) => sum + u.price, 0);
    const totalUnits = units.length;

    const freeGiftCount = Math.floor(totalUnits / 2);
    const itemsUntilNextFree = totalUnits % 2 === 0 ? 0 : 1;

    const cartProductIds = new Set(cartItems.map((item) => item.id));

    const availableProducts = (allProducts || []).filter(
        (product) =>
            !cartProductIds.has(product.id) &&
            Number(product.price) > 0 &&
            (product.stock_count == null || product.stock_count > 0)
    );
    const sortedProducts = [...availableProducts].sort(
        (a, b) => Number(a.price) - Number(b.price)
    );
    const cheapestProduct = sortedProducts.length > 0 ? sortedProducts[0] : null;

    const selectedFreeProductIds = [];
    const freeGiftSelections = [];
    let discountAmount = 0;

    for (let setIndex = 0; setIndex < freeGiftCount; setIndex += 1) {
        if (cheapestProduct) {
            selectedFreeProductIds.push(cheapestProduct.id);
            freeGiftSelections.push({
                productId: cheapestProduct.id,
                setNumber: setIndex + 1,
                name: cheapestProduct.name,
                price: Number(cheapestProduct.price) || 0,
                image: cheapestProduct.main_image || cheapestProduct.image || "/logo.png",
                category: cheapestProduct.categories?.name || "Jewellery",
            });
            discountAmount += Number(cheapestProduct.price) || 0;
        }
    }

    const shippingFee = getShippingFee(cartSubtotal);
    // Pay for cart items only; free gifts are separate ₹0 lines.
    const cartTotal = cartSubtotal + shippingFee;

    return {
        cartSubtotal,
        discountAmount,
        cartTotal,
        shippingFee,
        freeUnits: [],
        freeByProductId: {},
        completeSets: freeGiftCount,
        itemsUntilNextFree,
        totalUnits,
        freeProductIds: selectedFreeProductIds,
        freeGiftSelections,
        cheapestFreeItem: cheapestProduct,
    };
}

export const PROMO_LABEL = "Buy 2 Get 1 Free";
export const PROMO_SHORT = "Buy 2 Get 1 Free — a gift piece on us";
export const PROMO_DETAIL =
    "Buy any 2 paid pieces and we add a gift piece on us. It is an extra piece from the shop, not one of the two you picked. Every extra 2 paid pieces adds another gift.";
