export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function isGaEnabled() {
    return Boolean(GA_MEASUREMENT_ID);
}

function getGtag() {
    if (typeof window === "undefined") return null;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
    }

    return window.gtag;
}

export function pageview(url) {
    if (!isGaEnabled()) return;

    const gtag = getGtag();
    if (!gtag) return;

    gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
    });
}

export function trackEvent(action, params = {}) {
    if (!isGaEnabled()) return;

    const gtag = getGtag();
    if (!gtag) return;

    gtag("event", action, params);
}

export function trackAddToCart({ id, name, price, quantity = 1, category }) {
    trackEvent("add_to_cart", {
        currency: "INR",
        value: Number(price) * quantity,
        items: [
            {
                item_id: String(id),
                item_name: name,
                item_category: category || "Jewellery",
                price: Number(price),
                quantity,
            },
        ],
    });
}

export function trackPurchase({ transactionId, value, items = [] }) {
    trackEvent("purchase", {
        transaction_id: transactionId,
        currency: "INR",
        value: Number(value),
        items: items.map((item) => ({
            item_id: String(item.id),
            item_name: item.name,
            item_category: item.category || "Jewellery",
            price: Number(item.price),
            quantity: item.quantity || 1,
        })),
    });
}

export function trackSearch(searchTerm, resultCount = 0) {
    trackEvent("search", {
        search_term: searchTerm,
        result_count: resultCount,
    });
}

export function trackViewItem({ id, name, price, category }) {
    trackEvent("view_item", {
        currency: "INR",
        value: Number(price) || 0,
        items: [
            {
                item_id: String(id),
                item_name: name,
                item_category: category || "Jewellery",
                price: Number(price) || 0,
            },
        ],
    });
}
