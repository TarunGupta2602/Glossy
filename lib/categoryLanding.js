/** Dedicated SEO landing pages for categories that also exist at /shop/[slug]. */
const EARRINGS_SLUGS = new Set(["statement-pieces", "statement-piecess"]);
const NECKLACES_SLUGS = new Set(["the-necklace-edit"]);

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
