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
    // UUID paths still appearing in GSC if the product row is gone
    {
        source: "/product/584673cf-b7e6-4c2f-b356-e8def139fed8",
        destination: "/shop",
    },
    {
        source: "/product/0385d626-80d2-46cb-a4f0-a25390c84799",
        destination: "/shop",
    },
    {
        source: "/product/57d15bb1-70dc-47e3-87e9-32ab517c80c2",
        destination: "/shop",
    },
    {
        source: "/product/7290af89-ba19-4454-bc56-4e9d1497fd21",
        destination: "/shop",
    },
    {
        source: "/product/92c593e9-c87a-4284-b242-8094ae3c0ac4",
        destination: "/shop",
    },
    {
        source: "/product/a7a59b87-0b0e-492d-aa5a-3a938b1fad2a",
        destination: "/shop",
    },
    {
        source: "/product/d9b44036-82e9-481b-adfe-e06e63c427d9",
        destination: "/shop",
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
