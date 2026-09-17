/**
 * Honest product trust copy — jewellery claims without fake certifications.
 * Do not claim BIS / hallmark / solid gold unless true for the SKU.
 */

export const RETURN_POLICY_SUMMARY =
    "10-day easy returns on unused pieces in original packaging. Refunds in 5–7 business days.";

export const RETURN_POLICY_SHORT = "10-day easy returns · unused · original packaging";

/** Build PDP highlight chips — never stack Buy 2 Get 1 Free next to a % discount. */
export function buildProductHighlightChips(product, { hasDiscount = false } = {}) {
    const chips = ["Anti-tarnish", "Waterproof", "Hypoallergenic"];
    const plating = String(product?.plating || "").trim();
    if (plating) {
        // Short label for chip row
        if (/18k/i.test(plating) && /gold/i.test(plating)) chips.push("18k gold plated");
        else if (plating.length <= 28) chips.push(plating);
    }
    // Sitewide B2G1 lives in the announcement bar — keep PDP chips about the piece.
    void hasDiscount;
    return chips;
}

/** Default feature bullets when CMS features are empty. */
export function getDefaultProductFeatures() {
    return [
        "Hypoallergenic & skin-safe finish for daily wear",
        "18k gold plated fashion jewellery (not solid / hallmarked gold)",
        "Anti-tarnish & waterproof for Indian humidity",
        "Free returns within 10 days if unused",
        "Complimentary gift wrapping",
    ];
}

/** One-line authenticity note under price/chips. */
export function getFinishAuthenticityNote(product) {
    const plating = String(product?.plating || "18k gold plated").trim();
    return `${plating} fashion jewellery with a hypoallergenic finish — not solid hallmarked gold. Made for everyday wear.`;
}
