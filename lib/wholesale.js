import { WHATSAPP_NUMBER } from "@/lib/constants";

/** Reseller rate is 30% of the current website price. */
export const WHOLESALE_RATE = 0.3;
export const WHOLESALE_MIN_PIECES = 30;

export function wholesalePiecePrice(price) {
    const value = Number(price) || 0;
    if (value <= 0) return 0;
    return Math.max(1, Math.round(value * WHOLESALE_RATE));
}

export function formatRupee(amount) {
    return `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function wholesaleWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHOLESALE_INTRO_MESSAGE =
    "Hi, I want to place a wholesale order for my shop. I understand the minimum is 30 pieces and the rate is 30% of the website price.";
