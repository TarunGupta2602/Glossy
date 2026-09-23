import {
    findEarringsCategory,
    findNecklacesCategory,
    findBraceletsCategory,
} from "@/lib/categoryLanding";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";

const MAX_PRICE = 999;
const PRODUCT_LIMIT = 32;

/**
 * Occasion collection config. Add a new festival by copying an object —
 * the /festive/[slug] page reads this file only.
 */
export const FESTIVE_COLLECTIONS = {
    diwali: {
        slug: "diwali",
        eyebrow: "Festive edit",
        title: "Diwali jewellery",
        intro: "Office-to-puja anti-tarnish earrings, necklaces, and bracelets under ₹999 — made to wear after the diyas are packed away.",
        heroImage: "/iloveimg-resized/hero4.jpg",
        metaTitle: "Diwali Jewellery Under ₹999",
        metaDescription:
            "Shop Diwali jewellery under ₹999 — anti-tarnish earrings, necklaces & bracelets. Buy 2 Get 1 Free + pan-India shipping.",
        blogSlug: "how-to-layer-necklaces-diwali-party-looks",
        blogLabel: "Layer necklaces for Diwali",
    },
    navratri: {
        slug: "navratri",
        eyebrow: "Festive edit",
        title: "Navratri jewellery",
        intro: "Lightweight anti-tarnish earrings, necklaces, and bracelets under ₹999 — desk to dandiya without heavy costume pieces.",
        heroImage: "/iloveimg-resized/hero3.jpg",
        metaTitle: "Navratri Jewellery Under ₹999",
        metaDescription:
            "Shop Navratri jewellery under ₹999 — lightweight anti-tarnish earrings, necklaces & bracelets for nine festive days.",
        blogSlug: "navratri-2026-9-colours-9-jewellery-pairings",
        blogLabel: "9 colours, 9 pairings",
    },
};

export function getFestiveCollection(slug) {
    if (!slug) return null;
    return FESTIVE_COLLECTIONS[String(slug).toLowerCase()] || null;
}

export function listFestiveCollections() {
    return Object.values(FESTIVE_COLLECTIONS);
}

export function getFestiveCategoryIds(categories = []) {
    return [
        findEarringsCategory(categories),
        findNecklacesCategory(categories),
        findBraceletsCategory(categories),
    ]
        .map((category) => category?.id)
        .filter(Boolean);
}

/** Earrings, necklaces, and bracelets priced under ₹999. */
export async function fetchFestiveProducts(supabase, categories = []) {
    const categoryIds = getFestiveCategoryIds(categories);
    if (!categoryIds.length) return [];

    const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_CARD_SELECT)
        .in("category_id", categoryIds)
        .gt("price", 0)
        .lte("price", MAX_PRICE)
        .order("is_bestseller", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(PRODUCT_LIMIT);

    if (error) {
        console.error("Festive product query failed:", error);
        return [];
    }

    return data || [];
}
