export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function isMetaPixelEnabled() {
    return Boolean(META_PIXEL_ID);
}

export function trackMetaEvent(eventName, params = {}) {
    if (!isMetaPixelEnabled() || typeof window === "undefined" || typeof window.fbq !== "function") {
        return;
    }

    window.fbq("track", eventName, params);
}

export function trackMetaViewContent({ id, name, value, category }) {
    trackMetaEvent("ViewContent", {
        content_ids: [String(id)],
        content_name: name,
        content_type: "product",
        content_category: category || "Jewellery",
        value: Number(value) || 0,
        currency: "INR",
    });
}

export function trackMetaAddToCart({ id, name, value, category }) {
    trackMetaEvent("AddToCart", {
        content_ids: [String(id)],
        content_name: name,
        content_type: "product",
        content_category: category || "Jewellery",
        value: Number(value) || 0,
        currency: "INR",
    });
}

export function trackMetaPurchase({ value, transactionId }) {
    trackMetaEvent("Purchase", {
        value: Number(value) || 0,
        currency: "INR",
        transaction_id: transactionId,
    });
}
