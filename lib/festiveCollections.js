import {
    findEarringsCategory,
    findNecklacesCategory,
    findBraceletsCategory,
} from "@/lib/categoryLanding";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { PROMO_LABEL } from "@/lib/promo";

const MAX_PRICE = 999;
const FETCH_LIMIT = 80;
const PAGE_LIMIT = 20;

/**
 * Occasion collection config. Add a new festival by copying an object —
 * the /festive/[slug] page reads this file only.
 */
export const FESTIVE_COLLECTIONS = {
    diwali: {
        slug: "diwali",
        eyebrow: "Diwali edit",
        title: "Diwali jewellery",
        intro: "Office-to-puja gold-look earrings and necklaces under ₹999 — made to wear after the diyas are packed away.",
        heroImage: "/iloveimg-resized/hero4.jpg",
        metaTitle: "Diwali Jewellery Under ₹999",
        metaDescription:
            "Shop Diwali jewellery under ₹999 — anti-tarnish earrings, necklaces & bracelets. Buy 2 Get 1 Free + pan-India shipping.",
        blogSlug: "how-to-layer-necklaces-diwali-party-looks",
        blogLabel: "Layer necklaces for Diwali",
        offerLine: `${PROMO_LABEL} this Diwali`,
        whyTitle: "What this Diwali edit is",
        whyBody:
            "Gold-look pieces for puja and gifting — light enough for the office the next morning. The offer is Buy 2 Get 1 Free, the same as the rest of the shop.",
        theme: {
            accent: "#c4a574",
            surface: "from-[#f7f1e8] to-white",
            offerBg: "#f7f1e8",
            offerText: "#3d342c",
        },
        sections: [
            { id: "puja", title: "For puja" },
            { id: "party", title: "For party nights" },
            { id: "gifting", title: "Gifting under ₹999" },
        ],
    },
    navratri: {
        slug: "navratri",
        eyebrow: "Navratri edit",
        title: "Navratri jewellery",
        intro: "Lightweight colourful earrings first — desk to dandiya under ₹999, without heavy costume pieces.",
        heroImage: "/iloveimg-resized/hero3.jpg",
        metaTitle: "Navratri Jewellery Under ₹999",
        metaDescription:
            "Shop Navratri jewellery under ₹999 — lightweight anti-tarnish earrings, necklaces & bracelets for nine festive days.",
        blogSlug: "navratri-2026-9-colours-9-jewellery-pairings",
        blogLabel: "9 colours, 9 pairings",
        offerLine: `${PROMO_LABEL} this Navratri`,
        whyTitle: "What this Navratri edit is",
        whyBody:
            "Nine days of colour, not costume jewellery. Studs and drops you can wear to work, then to garba. Buy 2 Get 1 Free on every order.",
        theme: {
            accent: "#7a2248",
            surface: "from-[#f8f0f4] to-white",
            offerBg: "#f3e6ec",
            offerText: "#4a1a2e",
        },
        showColourEdit: true,
        sections: [
            { id: "evening", title: "For garba nights" },
            { id: "day", title: "For nine desk days" },
            { id: "gifting", title: "Gifting under ₹999" },
        ],
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

function productBlob(product = {}) {
    return `${product.name || ""} ${product.categories?.name || ""} ${product.categories?.slug || ""}`.toLowerCase();
}

function isWatch(blob) {
    return /\bwatch\b/.test(blob);
}

function isEarring(blob) {
    return /earring|stud|hoop|jhumka|drop|dangler/.test(blob);
}

function isNecklace(blob) {
    return /necklace|chain|pendant|choker|haar|lariat/.test(blob);
}

function scoreForOccasion(product, slug) {
    const blob = productBlob(product);
    let score = 0;
    if (isWatch(blob)) score -= 24;
    if (product.is_bestseller) score += 2;

    if (slug === "diwali") {
        if (isNecklace(blob)) score += 8;
        if (/pendant|chain|coin|heart|gold|layer|snake|tag/.test(blob)) score += 4;
        if (/hoop/.test(blob)) score += 3;
        if (isEarring(blob) && /stud|tulip|enamel/.test(blob)) score += 1;
    } else {
        if (isEarring(blob)) score += 8;
        if (/stud|enamel|tulip|pearl|clover|drop|pink|teal|moonstone/.test(blob)) score += 4;
        if (/drop|jhumka|dangler|fringe|tassel/.test(blob)) score += 3;
        if (isNecklace(blob) && /heart|layer|daisy/.test(blob)) score += 2;
    }

    return score;
}

function isPartyPiece(product) {
    const blob = productBlob(product);
    return /hoop|drop|fringe|tassel|jhumka|dangler|layer/.test(blob);
}

function isPujaPiece(product) {
    return isNecklace(productBlob(product));
}

function isDeskPiece(product) {
    const blob = productBlob(product);
    return /stud/.test(blob) && !/drop/.test(blob);
}

function takeUnique(source, used, limit) {
    const out = [];
    for (const product of source) {
        if (used.has(product.id)) continue;
        out.push(product);
        used.add(product.id);
        if (out.length >= limit) break;
    }
    return out;
}

/**
 * Rank a pool for one festival and split into occasion groups.
 * Same catalogue, different first screen — smaller than the full shop.
 */
export function curateFestiveEdit(products = [], collection) {
    const slug = collection?.slug || "diwali";
    const ranked = [...products]
        .map((product) => ({ product, score: scoreForOccasion(product, slug) }))
        .sort((a, b) => b.score - a.score || (Number(b.product.is_bestseller) - Number(a.product.is_bestseller)))
        .map(({ product }) => product)
        .slice(0, PAGE_LIMIT);

    const used = new Set();
    const buckets = {};

    if (slug === "diwali") {
        buckets.puja = takeUnique(ranked.filter(isPujaPiece), used, 8);
        buckets.party = takeUnique(ranked.filter(isPartyPiece), used, 6);
        buckets.gifting = takeUnique(ranked, used, 6);
    } else {
        buckets.evening = takeUnique(
            ranked.filter((product) => isPartyPiece(product) && !isDeskPiece(product)),
            used,
            8
        );
        buckets.day = takeUnique(ranked.filter(isDeskPiece), used, 6);
        buckets.gifting = takeUnique(ranked, used, 6);
    }

    const sections = (collection?.sections || [])
        .map((section) => ({
            ...section,
            products: buckets[section.id] || [],
        }))
        .filter((section) => section.products.length > 0);

    const shown = sections.flatMap((section) => section.products);
    return { products: shown.length ? shown : ranked, sections };
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
        .limit(FETCH_LIMIT);

    if (error) {
        console.error("Festive product query failed:", error);
        return [];
    }

    return data || [];
}
