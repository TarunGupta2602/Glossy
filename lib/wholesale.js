import { WHATSAPP_NUMBER } from "@/lib/constants";

/** Most designs are 30% of the current website price. Necklaces are 40%. */
export const WHOLESALE_RATE = 0.3;
export const WHOLESALE_NECKLACE_RATE = 0.4;
/** Wholesale bill must reach this amount. One piece of each design is allowed. */
export const WHOLESALE_MIN_AMOUNT = 4000;

export function isNecklaceProduct(product) {
    const slug = String(product?.categories?.slug || "").toLowerCase();
    const name = `${product?.categories?.name || ""} ${product?.name || ""}`.toLowerCase();
    return slug.includes("necklace") || name.includes("necklace");
}

export function wholesaleRate(product) {
    return isNecklaceProduct(product) ? WHOLESALE_NECKLACE_RATE : WHOLESALE_RATE;
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
