const STORAGE_KEY = "theluxejewels-recently-viewed";
const MAX_ITEMS = 8;

export function readRecentlyViewed() {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function trackRecentlyViewed(product) {
    if (typeof window === "undefined" || !product?.id) return;

    const entry = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        original_price: product.original_price,
        main_image: product.main_image,
        image_alt: product.image_alt,
        is_bestseller: product.is_bestseller,
        is_new: product.is_new,
        categories: product.categories
            ? { name: product.categories.name, slug: product.categories.slug, id: product.categories.id }
            : null,
        viewedAt: Date.now(),
    };

    const existing = readRecentlyViewed().filter((item) => item.id !== product.id);
    const next = [entry, ...existing].slice(0, MAX_ITEMS);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // Ignore quota / private mode failures
    }
}
