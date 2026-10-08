/** First-order list offer. Code is public; the server only applies it once. */
export const WELCOME_CODE = "FIRST10";
export const WELCOME_PERCENT = 10;

export function normalizeWelcomeCode(code) {
    return String(code || "").trim().toUpperCase();
}

export function isWelcomeCode(code) {
    return normalizeWelcomeCode(code) === WELCOME_CODE;
}

/** 10% off merchandise. Shipping stays on the full subtotal. */
export function welcomeDiscountAmount(subtotal) {
    const base = Math.max(0, Number(subtotal) || 0);
    return Math.round((base * WELCOME_PERCENT) / 100);
}
