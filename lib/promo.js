/**
 * Buy 2 Get 1 Free — one free gift is unlocked for every 2 paid items in the cart.
 * The free gift is selected from the configured offer pool and added separately.
 */
export const FREE_ITEM_PRODUCT_IDS = [
    "d2615cfa-527b-4b85-9aed-42211869ec14",
    "8c29b037-df08-4efb-8396-ef7afddf362a",
    "167dcccb-36cb-4503-9c10-84ba4be16fed",
    "82483569-36bb-465a-bee4-6a1c607e7559",
    "441d7327-f359-4578-896b-01ea121c4bb3",
    "f22d9a87-09cf-405c-92a2-9093f915899f",
    "e9cf5d9c-a38e-4963-84b9-62ad7d134eb9",
    "bbefac5d-9c80-4268-86eb-7fa5af0013ae",
    "3b0d891e-0598-4dbb-963e-b12268d58279",
    "cb20351b-e6a0-48a9-b0af-349bddc09210",
];

export function calculateBuy2Get1Free(cartItems = [], freeItemProductIds = FREE_ITEM_PRODUCT_IDS, random = Math.random) {
    const units = [];

    cartItems.forEach((item) => {
        const quantity = Number(item.quantity) || 1;
        for (let i = 0; i < quantity; i += 1) {
            units.push({
                productId: item.id,
                name: item.name,
                price: Number(item.price) || 0,
            });
        }
    });

    const cartSubtotal = units.reduce((sum, u) => sum + u.price, 0);
    const totalUnits = units.length;

    const completeSets = Math.floor(totalUnits / 2);
    const freeGiftCount = completeSets;
    const itemsUntilNextFree = totalUnits % 2 === 0 ? 0 : 1;

    const eligiblePool = (freeItemProductIds || []).filter(Boolean);
    const selectedFreeProductIds = [];
    const freeGiftSelections = [];

    for (let setIndex = 0; setIndex < freeGiftCount; setIndex += 1) {
        if (eligiblePool.length === 0) break;
        const poolIndex = Math.min(Math.floor(random() * eligiblePool.length), eligiblePool.length - 1);
        const selectedProductId = eligiblePool[poolIndex];
        selectedFreeProductIds.push(selectedProductId);
        freeGiftSelections.push({
            productId: selectedProductId,
            setNumber: setIndex + 1,
        });
    }

    const discountAmount = 0;
    const cartTotal = cartSubtotal;

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
    };
}

export const PROMO_LABEL = "Buy 2 Get 1 Free";
export const PROMO_SHORT = "Buy 2 Get 1 Free — unlock 1 free gift for every 2 paid items.";
export const PROMO_DETAIL =
    "Buy 2 items and unlock 1 free gift from our offer pool. Mix and match across all products; each additional 2 items unlocks another free gift.";
