/**
 * Shared internal links so shop, gifts, festive, city, help, and journal
 * pages all point at each other. Keep each surface to a short list.
 */

export const SHOP_LINKS = [
    { href: "/shop", label: "Shop all" },
    { href: "/earrings", label: "Earrings" },
    { href: "/necklaces", label: "Necklaces" },
    { href: "/bracelets", label: "Bracelets" },
    { href: "/rings", label: "Rings" },
];

export const FESTIVE_LINKS = [
    { href: "/festive/diwali", label: "Diwali jewellery" },
    { href: "/festive/navratri", label: "Navratri jewellery" },
    { href: "/gifts/under-499", label: "Gifts under ₹499" },
];

export const CITY_LINKS = [
    { href: "/jewellery-shop/noida", label: "Noida / Sector 18" },
    { href: "/jewellery-shop/greater-noida", label: "Greater Noida" },
    { href: "/jewellery-shop/ghaziabad", label: "Ghaziabad" },
    { href: "/jewellery-shop/delhi-ncr", label: "Delhi NCR" },
];

export const HELP_LINKS = [
    { href: "/faqs", label: "FAQs" },
    { href: "/shipping-returns", label: "Shipping & returns" },
    { href: "/our-story", label: "Our story" },
    { href: "/contact", label: "Contact" },
];

/** Recent + evergreen guides — used in footer, homepage, and related blocks. */
export const JOURNAL_LINKS = [
    {
        href: "/blog/navratri-2026-9-colours-9-jewellery-pairings",
        label: "Navratri 9 colours",
    },
    {
        href: "/blog/how-to-layer-necklaces-diwali-party-looks",
        label: "Layer Diwali necklaces",
    },
    {
        href: "/blog/best-jewellery-gifts-bhai-dooj-karva-chauth",
        label: "Bhai Dooj & Karva gifts",
    },
    {
        href: "/blog/diwali-jewellery-gifts-under-999-india-2026",
        label: "Diwali gifts under ₹999",
    },
    {
        href: "/blog/navratri-everyday-festive-earrings-india-2026",
        label: "Navratri earrings",
    },
    {
        href: "/blog/waterproof-jewellery-meaning-can-you-shower",
        label: "Waterproof jewellery",
    },
    {
        href: "/blog/how-long-does-gold-plated-jewellery-last-india",
        label: "How long plating lasts",
    },
    {
        href: "/blog/earrings-for-sensitive-ears-india-hypoallergenic",
        label: "Sensitive ears",
    },
    {
        href: "/blog/anti-tarnish-jewelry-guide-india-2026",
        label: "Anti-tarnish guide",
    },
];

const PAGE_MAP = {
    home: [
        { title: "Shop", links: SHOP_LINKS },
        { title: "This festive season", links: FESTIVE_LINKS },
        { title: "From the journal", links: JOURNAL_LINKS.slice(0, 5) },
    ],
    gift: [
        { title: "Festival looks", links: FESTIVE_LINKS.filter((l) => l.href !== "/gifts/under-499") },
        { title: "Gift guides", links: JOURNAL_LINKS.slice(0, 4) },
        { title: "Shop", links: SHOP_LINKS.slice(1, 5) },
    ],
    festive: [
        { title: "Shop", links: SHOP_LINKS },
        { title: "Guides", links: JOURNAL_LINKS.slice(0, 5) },
        { title: "Local", links: CITY_LINKS },
    ],
    category: [
        { title: "Also shop", links: [...FESTIVE_LINKS, { href: "/collection", label: "All collections" }] },
        { title: "Read next", links: JOURNAL_LINKS.slice(0, 6) },
    ],
    city: [
        { title: "Shop from here", links: [...SHOP_LINKS.slice(0, 3), ...FESTIVE_LINKS] },
        { title: "Guides for local weather", links: JOURNAL_LINKS.slice(5, 9) },
        { title: "Other cities", links: CITY_LINKS },
    ],
    story: [
        { title: "Shop", links: [...SHOP_LINKS.slice(0, 3), ...FESTIVE_LINKS] },
        { title: "Journal", links: JOURNAL_LINKS.slice(0, 4) },
        { title: "Help", links: HELP_LINKS },
    ],
    faqs: [
        { title: "Shop", links: [...FESTIVE_LINKS, ...SHOP_LINKS.slice(1, 3)] },
        { title: "Care guides", links: JOURNAL_LINKS.slice(5, 9) },
        { title: "Help", links: HELP_LINKS.filter((l) => l.href !== "/faqs") },
    ],
    collection: [
        { title: "Festive & gifts", links: FESTIVE_LINKS },
        { title: "Journal", links: JOURNAL_LINKS.slice(0, 5) },
        { title: "Cities", links: CITY_LINKS },
    ],
    jewelleryShop: [
        { title: "City pages", links: CITY_LINKS },
        { title: "Shop", links: [...SHOP_LINKS.slice(0, 3), ...FESTIVE_LINKS] },
        { title: "Journal", links: JOURNAL_LINKS.slice(0, 4) },
    ],
    contact: [
        { title: "Help", links: HELP_LINKS },
        { title: "Shop", links: [...FESTIVE_LINKS, ...SHOP_LINKS.slice(1, 3)] },
        { title: "Journal", links: JOURNAL_LINKS.slice(0, 3) },
    ],
    blogIndex: [
        { title: "Shop the look", links: [...FESTIVE_LINKS, ...SHOP_LINKS.slice(1, 4)] },
        { title: "Local", links: CITY_LINKS },
    ],
    default: [
        { title: "Shop", links: [...SHOP_LINKS.slice(0, 3), ...FESTIVE_LINKS] },
        { title: "Journal", links: JOURNAL_LINKS.slice(0, 4) },
        { title: "Help", links: HELP_LINKS.slice(0, 3) },
    ],
};

export function getRelatedGroups(page = "default") {
    return PAGE_MAP[page] || PAGE_MAP.default;
}
