/**
 * Buy 2 Get 1 Free — one free gift is unlocked for every 2 paid items in the cart.
 * The cheapest product NOT in the cart becomes the free product for each complete set.
 */
export const FREE_ITEM_PRODUCT_IDS = []; // Deprecated - now using cheapest product not in cart

export function calculateBuy2Get1Free(cartItems = [], allProducts = [], freeItemProductIds = [], random = Math.random) {
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

    const completeSets = Math.floor(totalUnits / 2);
    const freeGiftCount = completeSets;
    const itemsUntilNextFree = totalUnits % 2 === 0 ? 0 : 1;

    // Get product IDs already in cart
    const cartProductIds = new Set(cartItems.map(item => item.id));

    // Find the cheapest product NOT in the cart
    const availableProducts = (allProducts || []).filter(
        product => !cartProductIds.has(product.id) && product.price > 0
    );
    const sortedProducts = [...availableProducts].sort((a, b) => Number(a.price) - Number(b.price));
    const cheapestProduct = sortedProducts.length > 0 ? sortedProducts[0] : null;

    const selectedFreeProductIds = [];
    const freeGiftSelections = [];
    let discountAmount = 0;

    // For each complete set, the cheapest product not in cart becomes free
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

    const cartTotal = cartSubtotal - discountAmount;

    return {
        cartSubtotal,
        discountAmount,
        cartTotal,
        shippingFee: 0,
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
export const PROMO_SHORT = "Buy 2 Get 1 Free — unlock 1 free gift for every 2 paid items.";
export const PROMO_DETAIL =
    "Buy 2 items and get the cheapest product from our collection (not in your cart) as a free gift. Mix and match across all products; each additional 2 items unlocks another free gift.";
