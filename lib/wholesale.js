import { WHATSAPP_NUMBER } from "@/lib/constants";

/** Most designs are 50% of the current website price. */
export const WHOLESALE_RATE = 0.5;
/** Bracelets, rings, sets, and necklaces from ₹299. */
export const WHOLESALE_PREMIUM_RATE = 0.6;
export const WHOLESALE_PREMIUM_NECKLACE_MIN = 299;
/** Earrings priced around ₹150–₹200 stay at 40%. */
export const WHOLESALE_LOW_EARRING_RATE = 0.4;
export const WHOLESALE_LOW_EARRING_MAX = 209;
/** Wholesale bill must reach this amount. One piece of each design is allowed. */
export const WHOLESALE_MIN_AMOUNT = 4000;

function isLowPricedEarring(product) {
    const price = Number(product?.price) || 0;
    if (price < 150 || price > WHOLESALE_LOW_EARRING_MAX) return false;
    const slug = String(product?.categories?.slug || "").toLowerCase();
    const category = String(product?.categories?.name || "").toLowerCase();
    const name = String(product?.name || "").toLowerCase();
    if (name.includes("necklace") || name.includes(" set")) return false;
    return slug.includes("statement") || category.includes("statement") || category.includes("earring") || name.includes("earring");
}

function isPremiumProduct(product) {
    const blob = `${product?.categories?.slug || ""} ${product?.categories?.name || ""}`.toLowerCase();
    const name = String(product?.name || "").toLowerCase();
    const price = Number(product?.price) || 0;
    if (blob.includes("bracelet") || blob.includes("glimmer")) return true;
    if (blob.includes("duo") || blob.includes("sparkle")) return true;
    if (blob.includes("ring") || blob.includes("uniqueness")) return true;
    const isNecklace = blob.includes("necklace") || name.includes("necklace");
    return isNecklace && price >= WHOLESALE_PREMIUM_NECKLACE_MIN;
}

export function wholesaleRate(product) {
    if (isLowPricedEarring(product)) return WHOLESALE_LOW_EARRING_RATE;
    if (isPremiumProduct(product)) return WHOLESALE_PREMIUM_RATE;
    return WHOLESALE_RATE;
}

export function wholesalePiecePrice(price, rate = WHOLESALE_RATE) {
    const value = Number(price) || 0;
    if (value <= 0) return 0;
    return Math.max(1, Math.round(value * rate));
}

export function formatRupee(amount) {
    return `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function wholesaleWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHOLESALE_INTRO_MESSAGE =
    "Hi, I want to place a wholesale order. I will mix designs, and I can take one piece of each. My order will be at least ₹4,000.";
