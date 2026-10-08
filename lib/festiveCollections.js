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
        headline: "Light up in anti-tarnish gold",
        intro: "Gold-look necklaces and earrings for puja, parties, and gifting — light enough for the office the next morning, priced under ₹999.",
        heroImage: "/festive/diwali-festive-hero.jpg",
        portraitImage: "/festive/diwali-festive-portrait.jpg",
        cardImage: "/festive/diwali-festive-hero.jpg",
        metaTitle: "Diwali Gift Jewellery Under ₹999",
        metaDescription:
            "Diwali gift jewellery under ₹999 in India — gold-look anti-tarnish earrings and necklaces for office to puja. Buy 2 Get 1 Free + pan-India shipping.",
        faqs: [
            {
                question: "What Diwali gift jewellery under ₹999 is worth buying?",
                answer:
                    "A lightweight anti-tarnish necklace or earring pair she can wear after puja — not a costume box. Shop two paid pieces and the third is free.",
            },
            {
                question: "Do you ship Diwali jewellery across India?",
                answer:
                    "Yes. Pan-India prepaid shipping, with shipping from ₹50. Complimentary wrap on every order.",
            },
            {
                question: "Is this Diwali jewellery anti-tarnish?",
                answer:
                    "Yes. Pieces in this edit are 18k gold plated anti-tarnish jewellery made for Indian humidity — office the next morning, not just the aarti.",
            },
        ],
        blogSlug: "how-to-layer-necklaces-diwali-party-looks",
        blogLabel: "Layer necklaces for Diwali",
        offerLine: `${PROMO_LABEL} this Diwali — same offer as the rest of the shop.`,
        theme: {
            accent: "#c4a574",
            surface: "from-[#f7f1e8] to-white",
            offerBg: "#f7f1e8",
            offerText: "#3d342c",
        },
        sections: [
            {
                id: "puja",
                title: "For puja",
                blurb: "Pendants and chains that look finished without overpowering a silk or cotton kurta.",
            },
            {
                id: "party",
                title: "For party nights",
                blurb: "Hoops, drops and layers for dinners and get-togethers after the aarti.",
            },
            {
                id: "gifting",
                title: "Easy Diwali gifts",
                blurb: "Pieces under ₹999 that still feel considered — wrap included.",
            },
        ],
    },
    navratri: {
        slug: "navratri",
        eyebrow: "Navratri edit",
        title: "Navratri jewellery",
        headline: "Nine days, everyday sparkle",
        intro: "Lightweight colourful earrings first — desk to dandiya under ₹999, without the weight of costume jewellery.",
        heroImage: "/festive/navratri-festive-hero.jpg",
        portraitImage: "/festive/navratri-festive-portrait.jpg",
        cardImage: "/festive/navratri-festive-hero.jpg",
        metaTitle: "Navratri Jewellery for Garba & Everyday",
        metaDescription:
            "Navratri jewellery for garba and everyday India — lightweight anti-tarnish earrings under ₹999 for desk to dandiya. Buy 2 Get 1 Free.",
        faqs: [
            {
                question: "What Navratri jewellery works from office to garba?",
                answer:
                    "Lightweight anti-tarnish studs and drops under ₹999 — colourful enough for nine days, light enough for a full workday then dandiya.",
            },
            {
                question: "Can I wear these Navratri earrings in humidity?",
                answer:
                    "They are anti-tarnish fashion jewellery, not a waterproof rating. Wipe them dry after a humid night and store them away from the bathroom.",
            },
            {
                question: "Do you offer Buy 2 Get 1 Free on Navratri jewellery?",
                answer:
                    "Yes. Buy 2 Get 1 Free applies across the store — mix earrings and a necklace to cover more colour days without a costume-jewellery bill.",
            },
        ],
        blogSlug: "navratri-2026-9-colours-9-jewellery-pairings",
        blogLabel: "9 colours, 9 pairings",
        offerLine: `${PROMO_LABEL} this Navratri — rotate a pair for each colour day.`,
        theme: {
            accent: "#7a2248",
            surface: "from-[#f8f0f4] to-white",
            offerBg: "#f3e6ec",
            offerText: "#4a1a2e",
        },
        showColourEdit: true,
        sections: [
            {
                id: "evening",
                title: "For garba nights",
                blurb: "Drops and danglers that read festive under fairy lights.",
            },
            {
                id: "day",
                title: "For nine desk days",
                blurb: "Studs you can wear from standup to aarti without changing.",
            },
            {
                id: "gifting",
                title: "Easy Navratri gifts",
                blurb: "Colourful pairs that still work in October, after the last garba.",
            },
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
