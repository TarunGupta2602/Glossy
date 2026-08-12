/**
 * Broken / legacy product paths still appearing in Google Search Console.
 * Prefer resolving via product ID suffix when possible; these are fallbacks.
 */
export const LEGACY_PRODUCT_REDIRECTS = [
    {
        source: "/product/-odern-bstract-ave-oop-arrings-448bfb2e",
        destination: "/earrings",
    },
    {
        source: "/product/-idnight-eart-endant-ecklace-51eb751f",
        destination: "/necklaces",
    },
    {
        source: "/product/-olden-amboo-exagon-uggie-oops-271377b3",
        destination: "/earrings",
    },
    {
        source: "/product/-olden-eart-loom-uggie-oop-arrings-257ff4b5",
        destination: "/earrings",
    },
    {
        source: "/product/-tellar-rescent-old-uggie-oops-09826d2c",
        destination: "/earrings",
    },
    {
        source: "/product/-wisted-ope-olden-val-oops-5a25c8ea",
        destination: "/earrings",
    },
];

/** Trailing 8-char hex used by generateProductSlug (first segment of UUID). */
export function extractProductIdPrefix(param) {
    const value = String(param || "").trim();
    const match = value.match(/([0-9a-f]{8})$/i);
    return match ? match[1].toLowerCase() : null;
}

export function looksLikeCorruptedProductSlug(param) {
    const value = String(param || "");
    if (!value) return false;
    if (value.startsWith("-")) return true;
    // Missing first letters pattern still ends with product id prefix
    return /^-[a-z0-9-]+-[0-9a-f]{8}$/i.test(value);
}
