/**
 * Orders-first shop CTAs for ranking blog posts.
 * Rendered in-page (not from DB markdown) so we can tune without CMS edits.
 */
import { PROMO_LABEL } from "@/lib/promo";

const DEFAULT_CTA = {
    eyebrow: "Shop the look",
    headline: "Anti-tarnish jewellery for everyday India",
    body: `Waterproof pieces she’ll actually wear — with ${PROMO_LABEL} across the store.`,
    primary: { href: "/shop?sort=popular", label: "Shop bestsellers" },
    links: [
        { href: "/earrings", label: "Earrings" },
        { href: "/necklaces", label: "Necklaces" },
        { href: "/bracelets", label: "Bracelets" },
        { href: "/rings", label: "Rings" },
        { href: "/gifts/under-999", label: "Gifts under ₹999" },
        {
            href: "/blog/anti-tarnish-jewelry-guide-india-2026",
            label: "Anti-tarnish guide",
        },
    ],
    pickMode: "popular",
};

export const BLOG_SHOP_CTAS = {
    "best-jewelry-gifts-raksha-bandhan-friendship-day-2026": {
        eyebrow: "Gift edits · festive ready",
        headline: "Shop Raksha Bandhan & Friendship Day gifts under ₹999",
        body: `Curated anti-tarnish earrings, necklaces & bracelets she’ll wear after the festival — plus ${PROMO_LABEL}.`,
        primary: { href: "/gifts/under-999", label: "Shop gifts under ₹999" },
        links: [
            { href: "/gifts/under-499", label: "Under ₹499" },
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/shop?sort=popular", label: "Bestsellers" },
        ],
        pickMode: "gift999",
    },
    "15-best-bracelets-for-daily-wear-in-india-2026-gold-silver-fashion": {
        eyebrow: "Daily wear edit",
        headline: "Shop best everyday anti-tarnish bracelets",
        body: `Lightweight bracelets for office-to-evening wear. Mix two paid items to unlock ${PROMO_LABEL}.`,
        primary: { href: "/shop?sort=popular", label: "Shop bestsellers" },
        links: [
            { href: "/gifts/under-999", label: "Gifts under ₹999" },
            { href: "/earrings", label: "Pair with earrings" },
            { href: "/necklaces", label: "Necklaces" },
            {
                href: "/blog/how-long-does-gold-plated-jewellery-last-india",
                label: "How long plating lasts",
            },
        ],
        pickMode: "bracelet",
    },
    "25-perfect-gift-ideas-for-girlfriend-under-299-that-shell-actually-love": {
        eyebrow: "Budget gifting",
        headline: "Shop girlfriend-ready gifts under ₹499",
        body: "Cute, wearable anti-tarnish picks for birthdays, Friendship Day, and surprise gifting.",
        primary: { href: "/gifts/under-499", label: "Shop gifts under ₹499" },
        links: [
            { href: "/gifts/under-999", label: "Under ₹999" },
            { href: "/earrings", label: "Earrings" },
            { href: "/shop?sort=newest", label: "New arrivals" },
            {
                href: "/blog/waterproof-jewellery-meaning-can-you-shower",
                label: "Waterproof meaning",
            },
        ],
        pickMode: "gift499",
    },
    "10-jewellery-trends-taking-over-instagram-pinterest-in-2026": {
        eyebrow: "Shop the trend",
        headline: "Wear 2026 everyday gold looks in anti-tarnish jewellery",
        body: "Trend-led earrings and necklaces made for Indian weather — not just for the feed.",
        primary: { href: "/shop?sort=newest", label: "Shop new arrivals" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/gifts/under-999", label: "Gift edit" },
            {
                href: "/blog/earrings-for-sensitive-ears-india-hypoallergenic",
                label: "Sensitive ears guide",
            },
        ],
        pickMode: "popular",
    },
    "18k-gold-plated-vs-real-gold-jewelry": {
        eyebrow: "Ready to shop",
        headline: "Shop 18k gold plated anti-tarnish jewellery",
        body: "Get the everyday gold look without solid-gold prices — waterproof pieces built for Indian weather.",
        primary: { href: "/shop?sort=popular", label: "Shop gold plated edit" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/gifts/under-999", label: "Gifts under ₹999" },
            {
                href: "/blog/how-long-does-gold-plated-jewellery-last-india",
                label: "How long it lasts",
            },
        ],
        pickMode: "popular",
    },
    "jewellery-gifts-under-999-india": {
        eyebrow: "Gift edit",
        headline: "Shop jewellery gifts under ₹999",
        body: `Ready-to-gift anti-tarnish picks with ${PROMO_LABEL} and pan-India shipping.`,
        primary: { href: "/gifts/under-999", label: "Open gift edit" },
        links: [
            { href: "/gifts/under-499", label: "Under ₹499" },
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
        ],
        pickMode: "gift999",
    },
    "office-wear-jewellery-india-anti-tarnish": {
        eyebrow: "Office edit",
        headline: "Shop subtle everyday office jewellery",
        body: "Hypoallergenic studs, fine necklaces, and waterproof pieces that stay polished from commute to meetings.",
        primary: { href: "/earrings", label: "Shop earrings" },
        links: [
            { href: "/necklaces", label: "Necklaces" },
            { href: "/shop?sort=popular", label: "Bestsellers" },
            { href: "/gifts/under-999", label: "Gifts under ₹999" },
        ],
        pickMode: "earrings",
    },
    "monsoon-jewellery-care-anti-tarnish-india": {
        eyebrow: "Monsoon-ready",
        headline: "Shop waterproof anti-tarnish pieces",
        body: "Built for humidity, sweat, and rain — so your everyday gold look stays bright.",
        primary: { href: "/shop?sort=popular", label: "Shop anti-tarnish" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/gifts/under-999", label: "Gift edit" },
        ],
        pickMode: "popular",
    },
    "best-anti-tarnish-jewelry-gifts-2026": {
        eyebrow: "Gift guide",
        headline: "Shop anti-tarnish jewellery gifts",
        body: `Occasion-ready waterproof pieces under easy budgets — plus ${PROMO_LABEL}.`,
        primary: { href: "/gifts/under-999", label: "Shop gifts under ₹999" },
        links: [
            { href: "/gifts/under-499", label: "Under ₹499" },
            { href: "/shop?sort=popular", label: "Bestsellers" },
        ],
        pickMode: "gift999",
    },
    "real-gold-vs-anti-tarnish-artificial-jewellery-whats-actually-worth-buying-in-2026": {
        eyebrow: "Smart everyday buy",
        headline: "Shop anti-tarnish jewellery worth wearing daily",
        body: "Skip the solid-gold markup for fashion rotation — waterproof plated pieces built for real life.",
        primary: { href: "/shop?sort=popular", label: "Shop the catalogue" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/gifts/under-999", label: "Gifts under ₹999" },
        ],
        pickMode: "popular",
    },
    "buy-gold-plated-jewelry-online-india-guide-2026": {
        eyebrow: "Buy with confidence",
        headline: "Shop gold plated jewellery online — India shipping",
        body: `Anti-tarnish 18k plated picks with clear prices, ${PROMO_LABEL}, and pan-India delivery.`,
        primary: { href: "/shop?sort=popular", label: "Shop gold plated" },
        links: [
            { href: "/gifts/under-999", label: "Gifts under ₹999" },
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
        ],
        pickMode: "popular",
    },
    "how-to-choose-earrings-for-face-shape": {
        eyebrow: "Find your pair",
        headline: "Shop earrings that flatter your face shape",
        body: "Studs, hoops, and drops in waterproof anti-tarnish finishes — try what matches your guide above.",
        primary: { href: "/earrings", label: "Shop all earrings" },
        links: [
            { href: "/gifts/under-999", label: "Gift earrings under ₹999" },
            { href: "/gifts/under-499", label: "Under ₹499" },
            { href: "/shop?sort=popular", label: "Bestsellers" },
        ],
        pickMode: "earrings",
    },
    "how-long-does-gold-plated-jewellery-last-india": {
        eyebrow: "Everyday gold edit",
        headline: "Shop anti-tarnish gold plated jewellery made to last",
        body: `Lightweight daily-wear pieces for Indian weather — plus ${PROMO_LABEL} to build a rotation.`,
        primary: { href: "/shop?sort=popular", label: "Shop bestsellers" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/gifts/under-999", label: "Gifts under ₹999" },
        ],
        pickMode: "popular",
    },
    "waterproof-jewellery-meaning-can-you-shower": {
        eyebrow: "Wear-in-the-rain edit",
        headline: "Shop waterproof anti-tarnish everyday jewellery",
        body: "Studs and fine necklaces finished for sweat, humidity, and real Indian days.",
        primary: { href: "/shop?sort=popular", label: "Shop waterproof edit" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/gifts/under-999", label: "Gift edit" },
        ],
        pickMode: "popular",
    },
    "earrings-for-sensitive-ears-india-hypoallergenic": {
        eyebrow: "Comfort first",
        headline: "Shop lightweight earrings for everyday comfort",
        body: "Start with studs and small hoops — anti-tarnish pairs made for humid Indian days.",
        primary: { href: "/earrings", label: "Shop earrings" },
        links: [
            { href: "/shop?sort=popular", label: "Bestsellers" },
            { href: "/gifts/under-499", label: "Under ₹499" },
            { href: "/gifts/under-999", label: "Under ₹999" },
            {
                href: "/blog/waterproof-jewellery-meaning-can-you-shower",
                label: "Can you shower in it?",
            },
        ],
        pickMode: "earrings",
    },
    "anti-tarnish-jewelry-guide-india-2026": {
        eyebrow: "Start here",
        headline: "Shop anti-tarnish jewellery built for India",
        body: `Waterproof everyday pieces for humidity and sweat — plus ${PROMO_LABEL}.`,
        primary: { href: "/shop?sort=popular", label: "Shop anti-tarnish" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/bracelets", label: "Bracelets" },
            {
                href: "/blog/why-jewelry-turns-green-anti-tarnish-fix-india",
                label: "Why jewellery turns green",
            },
            {
                href: "/blog/waterproof-jewellery-meaning-can-you-shower",
                label: "Waterproof meaning",
            },
        ],
        pickMode: "popular",
    },
    "why-jewelry-turns-green-anti-tarnish-fix-india": {
        eyebrow: "Fix the green mark",
        headline: "Shop sealed anti-tarnish pieces instead",
        body: "Skip cheap plating that reacts with sweat — choose waterproof everyday gold looks.",
        primary: { href: "/shop?sort=popular", label: "Shop anti-tarnish" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            {
                href: "/blog/anti-tarnish-jewelry-guide-india-2026",
                label: "Anti-tarnish guide",
            },
        ],
        pickMode: "popular",
    },
    "how-to-clean-gold-plated-jewellery-at-home-without-ruining-it": {
        eyebrow: "Care + wear",
        headline: "Shop pieces that are easier to live in",
        body: "Anti-tarnish jewellery still loves gentle care — and daily wear that doesn’t need constant polishing.",
        primary: { href: "/shop?sort=popular", label: "Shop bestsellers" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            {
                href: "/blog/how-long-does-gold-plated-jewellery-last-india",
                label: "How long plating lasts",
            },
        ],
        pickMode: "popular",
    },
    "minimalist-gold-jewelry-everyday-outfit-ideas": {
        eyebrow: "Everyday gold",
        headline: "Shop minimalist anti-tarnish gold looks",
        body: "Studs, fine chains, and quiet stacks for office-to-evening outfits.",
        primary: { href: "/earrings", label: "Shop earrings" },
        links: [
            { href: "/necklaces", label: "Necklaces" },
            { href: "/bracelets", label: "Bracelets" },
            { href: "/rings", label: "Rings" },
            {
                href: "/blog/office-wear-jewellery-india-anti-tarnish",
                label: "Office wear guide",
            },
        ],
        pickMode: "popular",
    },
    "7-reasons-why-dainty-heart-necklaces-are-the-most-gifted-jewellery-in-india": {
        eyebrow: "Gift-ready hearts",
        headline: "Shop dainty heart necklaces",
        body: `Everyday pendants that feel personal — with ${PROMO_LABEL} across the store.`,
        primary: { href: "/necklaces", label: "Shop necklaces" },
        links: [
            { href: "/gifts/under-999", label: "Gifts under ₹999" },
            { href: "/gifts/under-499", label: "Under ₹499" },
            {
                href: "/blog/25-perfect-gift-ideas-for-girlfriend-under-299-that-shell-actually-love",
                label: "Girlfriend gift ideas",
            },
        ],
        pickMode: "necklace",
    },
    "best-affordable-jewellery-sets-online-in-india-under-999-2026-edit": {
        eyebrow: "Under ₹999 sets",
        headline: "Shop affordable jewellery sets under ₹999",
        body: "Coordinated everyday looks without solid-gold prices — waterproof and gift-ready.",
        primary: { href: "/gifts/under-999", label: "Shop under ₹999" },
        links: [
            { href: "/earrings", label: "Earrings" },
            { href: "/necklaces", label: "Necklaces" },
            { href: "/shop?sort=popular", label: "Bestsellers" },
        ],
        pickMode: "gift999",
    },
};

export function getBlogShopCta(slug) {
    if (!slug) return DEFAULT_CTA;
    return BLOG_SHOP_CTAS[slug] || DEFAULT_CTA;
}
