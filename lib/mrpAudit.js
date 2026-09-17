/**
 * Detect autofilled / inflated compare-at (MRP) prices.
 * Historical autofill used ~1.5× selling price rounded to *9 (≈33–40% OFF).
 */

export function suggestedMrpFromMultiplier(price, multiplier) {
    const p = Number(price);
    if (!p || p <= 0) return null;
    const raw = p * multiplier;
    const rounded = Math.ceil(raw / 50) * 50 - 1;
    return rounded > p ? rounded : null;
}

/**
 * True when original_price looks like synthetic catalogue inflation, not a real sale.
 */
export function isSyntheticCompareAt(price, originalPrice) {
    const p = Number(price) || 0;
    const o = Number(originalPrice) || 0;
    if (!p || !o || o <= p) return false;

    const pct = ((o - p) / o) * 100;

    for (const mult of [1.5, 1.45, 1.55, 1.4, 1.22, 1.25]) {
        const suggested = suggestedMrpFromMultiplier(p, mult);
        if (suggested != null && Math.abs(o - suggested) <= 1) return true;
    }

    // Classic autofill band: ~33% OFF with *.49 / *.99 style MRP
    if (pct >= 28 && pct <= 42 && Math.round(o) % 50 === 49) return true;

    return false;
}

export function auditProductMrp(product) {
    const price = Number(product?.price) || 0;
    const original = Number(product?.original_price) || 0;

    if (!original || original <= price) {
        return { action: "noop", reason: "no_compare_at" };
    }

    if (isSyntheticCompareAt(price, original)) {
        return {
            action: "clear",
            reason: "synthetic_compare_at",
            price,
            original_price: original,
            discountPercent: Math.round(((original - price) / original) * 100),
        };
    }

    return {
        action: "keep",
        reason: "looks_like_real_sale",
        price,
        original_price: original,
        discountPercent: Math.round(((original - price) / original) * 100),
    };
}
