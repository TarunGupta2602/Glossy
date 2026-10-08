/**
 * Honest product trust copy — jewellery claims without fake certifications.
 * Do not claim BIS / hallmark / solid gold unless true for the SKU.
 */

import { resolveProductMaterial, resolveProductPlating } from "@/lib/productDefaults";

export const RETURN_POLICY_SUMMARY =
    "10-day easy returns on unused pieces in original packaging. Refunds in 5–7 business days.";

export const RETURN_POLICY_SHORT = "10-day easy returns · unused · original packaging";

/** Build PDP highlight chips from the piece itself. No waterproof or hypoallergenic claim. */
export function buildProductHighlightChips(product) {
    const chips = ["Anti-tarnish with care"];
    const plating = String(product?.plating || resolveProductPlating(product) || "").trim();
    if (/18k/i.test(plating) && /gold/i.test(plating)) chips.push("18k gold plated");
    else if (plating && plating.length <= 28) chips.push(plating);
    const material = resolveProductMaterial(product);
    if (material) chips.push(material);
    return chips;
}

/** Default feature bullets when CMS features are empty. */
export function getDefaultProductFeatures(product) {
    const material = resolveProductMaterial(product);
    const plating = resolveProductPlating(product);
    return [
        `${material} base`,
        `${plating} fashion jewellery — not solid or hallmarked gold`,
        "Wipe dry after wear and store away from the bathroom",
        "No separate anti-tarnish guarantee period",
        "Returns within 10 days if unused, in original packaging",
    ];
}

/** One-line authenticity note under price/chips. */
export function getFinishAuthenticityNote(product) {
    const plating = resolveProductPlating(product);
    const material = resolveProductMaterial(product);
    return `${plating} over ${material.toLowerCase()}. Fashion jewellery, not solid hallmarked gold. No waterproof rating and no published plating thickness.`;
}
