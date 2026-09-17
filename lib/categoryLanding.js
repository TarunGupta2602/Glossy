/** Dedicated SEO landing pages for categories that also exist at /shop/[slug]. */
const EARRINGS_SLUGS = new Set([
    "statement-pieces",
    "statement-piecess",
    "-statement-piecess",
]);
const NECKLACES_SLUGS = new Set(["the-necklace-edit"]);
const BRACELETS_SLUGS = new Set(["glimmer-bracelet", "glimmer-bracelets"]);
const RINGS_SLUGS = new Set(["uniqueness-rings", "uniqueness", "uniqueness-ring"]);

/** Known CMS typos / casing fixes for category display labels. */
const CATEGORY_DISPLAY_FIXES = {
    "statement piecess": "Statement Pieces",
    "statement-piecess": "Statement Pieces",
    "statement pieces": "Statement Pieces",
};

/**
 * Normalize category names for UI + schema (fixes "Statement Piecess" etc.).
 */
export function getDisplayCategoryName(categoryOrName, fallback = "Jewellery") {
    const raw =
        typeof categoryOrName === "string"
            ? categoryOrName
            : categoryOrName?.name || "";
    const trimmed = String(raw).trim();
    if (!trimmed) return fallback;

    const key = trimmed.toLowerCase();
    if (CATEGORY_DISPLAY_FIXES[key]) return CATEGORY_DISPLAY_FIXES[key];

    // Slug-based recovery when the DB name still has the extra "s"
    const slug = typeof categoryOrName === "object" ? categoryOrName?.slug : null;
    if (slug && EARRINGS_SLUGS.has(String(slug).toLowerCase())) {
        return "Statement Pieces";
    }

    if (/piecess\b/i.test(trimmed)) {
        return trimmed.replace(/piecess\b/gi, "Pieces");
    }

    return trimmed;
}

export function findEarringsCategory(categories) {
    return categories?.find(
        (c) =>
            EARRINGS_SLUGS.has(c.slug?.toLowerCase()) ||
            c.slug?.includes("statement") ||
            c.name?.toLowerCase().includes("earring")
    );
}

export function findNecklacesCategory(categories) {
    return categories?.find(
        (c) =>
            NECKLACES_SLUGS.has(c.slug?.toLowerCase()) ||
            c.slug?.includes("necklace") ||
            c.name?.toLowerCase().includes("necklace")
    );
}

export function findBraceletsCategory(categories) {
    return categories?.find(
        (c) =>
            BRACELETS_SLUGS.has(c.slug?.toLowerCase()) ||
            c.slug?.includes("bracelet") ||
            c.slug?.includes("bangle") ||
            c.name?.toLowerCase().includes("bracelet") ||
            c.name?.toLowerCase().includes("bangle")
    );
}

export function findRingsCategory(categories) {
    return categories?.find((c) => {
        const slug = c.slug?.toLowerCase() || "";
        const name = c.name?.toLowerCase() || "";
        if (RINGS_SLUGS.has(slug)) return true;
        if (/earring/.test(slug) || /earring/.test(name)) return false;
        return (
            /(^|-)rings?(-|$)/.test(slug) ||
            /\brings?\b/.test(name) ||
            slug.includes("uniqueness")
        );
    });
}

/** If this shop slug has a dedicated landing page, return its path (avoids duplicate content). */
export function getDedicatedLandingPath(slug) {
    if (!slug) return null;
    const normalized = slug.toLowerCase();

    if (EARRINGS_SLUGS.has(normalized) || normalized.includes("statement")) {
        return "/earrings";
    }
    if (NECKLACES_SLUGS.has(normalized) || normalized === "the-necklace-edit") {
        return "/necklaces";
    }
    if (
        BRACELETS_SLUGS.has(normalized) ||
        normalized.includes("bracelet") ||
        normalized.includes("bangle") ||
        normalized.includes("glimmer")
    ) {
        return "/bracelets";
    }
    if (
        RINGS_SLUGS.has(normalized) ||
        normalized.includes("uniqueness") ||
        (/(^|-)rings?(-|$)/.test(normalized) && !normalized.includes("earring"))
    ) {
        return "/rings";
    }
    return null;
}

export function buildLandingRedirect(landingPath, searchParams = {}) {
    const page = searchParams?.page;
    if (page && page !== "1") {
        return `${landingPath}?page=${page}`;
    }
    return landingPath;
}

/** Prefer dedicated landing URL in nav/menus when available. */
export function getCategoryHref(category) {
    if (!category?.slug) return "/shop";
    const landing = getDedicatedLandingPath(category.slug);
    return landing || `/shop/${category.slug}`;
}
