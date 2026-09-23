/**
 * Smart defaults for The Luxe Jewels product detail fields.
 * Only fills empty / null values — never overwrites existing data unless force=true.
 */

const DEFAULT_CARE =
    "Waterproof & anti-tarnish for everyday wear. Avoid prolonged contact with harsh chemicals, bleach, and strong perfumes. Wipe gently with a soft dry cloth after use.";

const DEFAULT_MATERIAL = "Premium brass base with hypoallergenic, skin-safe finish";
const DEFAULT_PLATING = "18k Gold Plated";

function textBlob(product = {}) {
    return `${product.name || ""} ${product.description || ""} ${product.categories?.name || product.categoryName || ""}`.toLowerCase();
}

function detectKind(product = {}) {
    const blob = textBlob(product);
    if (/earring|stud|hoop|jhumka|drop/.test(blob)) return "earrings";
    if (/necklace|chain|pendant|choker|haar/.test(blob)) return "necklace";
    if (/bracelet|bangle|kada|cuff/.test(blob)) return "bracelet";
    if (/ring|band/.test(blob)) return "ring";
    if (/anklet|payal/.test(blob)) return "anklet";
    if (/set|duo|combo/.test(blob)) return "set";
    return "jewellery";
}

function detectPlating(product = {}) {
    const blob = textBlob(product);
    if (/rose\s*gold/.test(blob)) return "18k Rose Gold Plated";
    if (/white\s*gold|rhodium|silver\s*plated|silver[- ]tone/.test(blob)) {
        return "Rhodium / Silver-toned Plating";
    }
    if (/oxidised|oxidized/.test(blob)) return "Oxidised Finish";
    if (/gold\s*plated|18k|golden/.test(blob)) return "18k Gold Plated";
    return DEFAULT_PLATING;
}

function detectMaterial(product = {}) {
    const blob = textBlob(product);
    if (/sterling|925|pure silver/.test(blob)) return "925 Sterling Silver";
    if (/stainless/.test(blob)) return "Stainless steel with premium finish";
    if (/copper/.test(blob)) return "Copper base with protective plating";
    if (/brass/.test(blob)) return "Premium brass with hypoallergenic finish";
    return DEFAULT_MATERIAL;
}

/** Round MRP to a clean retail number ~1.2–1.25× selling price (avoid perpetual ~33% “fake” OFF). */
export function suggestOriginalPrice(price) {
    const p = Number(price);
    if (!p || p <= 0) return null;
    const raw = p * 1.22;
    // Prefer prices ending in 9 (499, 799, 1299…)
    const rounded = Math.ceil(raw / 50) * 50 - 1;
    return rounded > p ? rounded : Math.ceil(p * 1.4);
}

function suggestWeight(kind) {
    switch (kind) {
        case "earrings":
            return "Lightweight — approx. 3–8 g per pair";
        case "necklace":
            return "Approx. 8–18 g (varies by design)";
        case "bracelet":
            return "Approx. 10–22 g";
        case "ring":
            return "Approx. 2–6 g";
        case "anklet":
            return "Lightweight — approx. 5–12 g";
        case "set":
            return "See individual pieces; designed for comfortable daily wear";
        default:
            return "Lightweight — crafted for everyday wear";
    }
}

const PLACEHOLDER_SIZE_RE =
    /see product images|see listing photos|confirm in images|one size;\s*see|free size\s*[—\-]\s*see product|lightweight everyday fit/i;

/** Old autofill lines we should not show on the storefront. */
export function isPlaceholderSizeInfo(value) {
    const text = String(value || "").trim();
    if (!text) return true;
    return PLACEHOLDER_SIZE_RE.test(text);
}

function extractMentionedSize(product = {}) {
    const source = `${product.name || ""} ${product.description || ""}`;
    const match = source.match(/(\d+(?:\.\d+)?\s*(?:cm|mm|inch|inches|in)\b)/i);
    if (match) return match[1].replace(/\s+/g, " ").trim();
    const inchMark = source.match(/(\d+(?:\.\d+)?\s*")/);
    return inchMark ? inchMark[1].replace(/\s+/g, " ").trim() : null;
}

function suggestSize(product = {}, kind) {
    const blob = textBlob(product);
    const mentioned = extractMentionedSize(product);
    if (mentioned) {
        switch (kind) {
            case "earrings":
                if (/hoop/.test(blob)) return `${mentioned} hoop. One-size pair.`;
                if (/stud/.test(blob)) return `${mentioned} stud. One-size pair.`;
                if (/jhumka|drop|dangler/.test(blob)) return `${mentioned} drop. One-size pair.`;
                return `${mentioned}. One-size pair.`;
            case "necklace":
                return `${mentioned}. Adjustable with extender.`;
            case "bracelet":
            case "anklet":
                return `${mentioned}. Adjustable fit.`;
            case "ring":
                return `${mentioned}. Adjustable unless noted.`;
            default:
                return mentioned;
        }
    }
    switch (kind) {
        case "earrings":
            if (/stud/.test(blob)) return "One-size pair. Typical stud 0.8–1.2 cm.";
            if (/hoop/.test(blob)) return "One-size pair. Typical hoop 2–3.5 cm diameter.";
            if (/jhumka|drop|dangler/.test(blob)) return "One-size pair. Typical drop 3–6 cm.";
            return "One-size pair. Lightweight everyday earrings.";
        case "necklace":
            if (/choker/.test(blob)) return "Choker length, about 32–36 cm plus extender.";
            if (/haar/.test(blob)) return "Longer haar length with clasp.";
            return "Standard chain, about 40–45 cm plus extender.";
        case "bracelet":
            if (/bangle|kada/.test(blob)) return "Open or stackable bangle. Typical inner 5.5–6.5 cm.";
            return "Adjustable or stretch fit. Typical inner 16–18 cm.";
        case "ring":
            return "Adjustable free size. Typically fits US 6–8.";
        case "anklet":
            return "Adjustable length. Typical 22–26 cm.";
        case "set":
            return "Free-size / adjustable pieces for everyday wear.";
        default:
            return "Free size / adjustable for everyday wear.";
    }
}

/** Storefront size line: real admin text, else a type-specific fit note. */
export function resolveProductSizeInfo(product = {}) {
    const current = typeof product.size_info === "string" ? product.size_info.trim() : "";
    if (current && !isPlaceholderSizeInfo(current)) return current;
    return suggestSize(product, detectKind(product));
}

function suggestDescription(product = {}) {
    const name = product.name || "This piece";
    const category =
        product.categories?.name || product.categoryName || detectKind(product);
    const plating = detectPlating(product);
    return `Shop ${name} from The Luxe Jewels — premium anti-tarnish, waterproof ${category.toLowerCase()} finished in ${plating}. Hypoallergenic and made for everyday Indian wear. Buy 2 Get 1 Free + free shipping across India.`;
}

function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return !value.trim();
    if (typeof value === "number") return Number.isNaN(value);
    return false;
}

function isBlankStock(value) {
    return value === null || value === undefined || value === "";
}

/**
 * Build suggested values for empty product detail fields.
 * @param {object} product - current product (name, price, description, categories, created_at, …)
 * @param {object} options
 * @param {boolean} options.force - overwrite existing values (default false)
 * @param {boolean} options.includeBadges - suggest is_new / is_bestseller (default true)
 */
export function buildProductDetailsDefaults(product = {}, options = {}) {
    const { force = false, includeBadges = true } = options;
    const kind = detectKind(product);
    const suggestions = {};
    const filled = [];

    const take = (key, value, label) => {
        if (value === null || value === undefined || value === "") return;
        const current = product[key];
        const empty =
            key === "stock_count"
                ? isBlankStock(current)
                : key === "size_info"
                  ? isEmpty(current) || isPlaceholderSizeInfo(current)
                  : key === "is_bestseller" || key === "is_new"
                    ? false // badges handled separately
                    : isEmpty(current);
        if (force || empty) {
            suggestions[key] = value;
            filled.push(label || key);
        }
    };

    take("material", detectMaterial(product), "material");
    take("plating", detectPlating(product), "plating");
    take("care_instructions", DEFAULT_CARE, "care");
    take("weight", suggestWeight(kind), "weight");
    take("size_info", suggestSize(product, kind), "size");
    take("stock_count", 30, "stock");

    // Do NOT invent original_price / MRP — perpetual fake % OFF erodes trust.
    // Real compare-at only via admin when there is a genuine sale.

    if (isEmpty(product.description)) {
        take("description", suggestDescription(product), "description");
    }

    if (includeBadges) {
        const blob = textBlob(product);
        const createdAt = product.created_at ? new Date(product.created_at) : null;
        const ageDays = createdAt
            ? (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
            : 0;

        // New Arrival: on for new products / last ~45 days
        if (force || product.is_new === false || product.is_new == null) {
            if (!createdAt || ageDays <= 45) {
                if (!product.is_new) {
                    suggestions.is_new = true;
                    filled.push("New Arrival");
                }
            }
        }

        // Best Seller: only when name/description clearly says so
        if (/best\s*-?\s*seller|bestseller|best[- ]selling/.test(blob)) {
            if (force || !product.is_bestseller) {
                suggestions.is_bestseller = true;
                filled.push("Best Seller");
            }
        }
    }

    return { suggestions, filled, kind };
}

/**
 * Merge defaults into a product/API payload (empty fields only).
 * Explicit values already present on `payload` are preserved (including false badges).
 */
export function applyProductDetailsDefaults(payload, existing = null, options = {}) {
    const merged = {
        ...(existing || {}),
        ...payload,
        categories: existing?.categories,
        categoryName:
            payload.categoryName ||
            existing?.categories?.name ||
            existing?.categoryName,
    };

    const { suggestions, filled } = buildProductDetailsDefaults(merged, options);
    const next = { ...payload };
    const applied = [];

    for (const [key, value] of Object.entries(suggestions)) {
        if (key === "is_new" || key === "is_bestseller") {
            // Respect explicit form/API boolean; only fill when omitted (bulk autofill)
            if (Object.prototype.hasOwnProperty.call(payload, key)) continue;
            if (value === true && !existing?.[key]) {
                next[key] = true;
                applied.push(key);
            }
            continue;
        }

        const current = Object.prototype.hasOwnProperty.call(next, key)
            ? next[key]
            : existing?.[key];
        const empty =
            key === "stock_count"
                ? isBlankStock(current)
                : key === "size_info"
                  ? isEmpty(current) || isPlaceholderSizeInfo(current)
                  : isEmpty(current);

        if (options.force || empty) {
            next[key] = value;
            applied.push(key);
        }
    }

    return { payload: next, filled: applied.length ? filled : [], suggestions };
}

/** Form-friendly defaults (string values for controlled inputs). */
export function getProductFormAutofill(formState, categoryName) {
    const product = {
        name: formState.name,
        price: formState.price,
        description: formState.description,
        categoryName,
        material: formState.material,
        plating: formState.plating,
        care_instructions: formState.careInstructions,
        weight: formState.weight,
        size_info: formState.sizeInfo,
        stock_count: formState.stockCount === "" ? null : formState.stockCount,
        original_price: formState.originalPrice === "" ? null : formState.originalPrice,
        is_bestseller: formState.isBestseller,
        is_new: formState.isNew,
        created_at: formState.createdAt || new Date().toISOString(),
    };

    const { suggestions, filled, kind } = buildProductDetailsDefaults(product);

    return {
        kind,
        filled,
        values: {
            originalPrice:
                suggestions.original_price != null
                    ? String(suggestions.original_price)
                    : undefined,
            stockCount:
                suggestions.stock_count != null
                    ? String(suggestions.stock_count)
                    : undefined,
            material: suggestions.material,
            plating: suggestions.plating,
            careInstructions: suggestions.care_instructions,
            weight: suggestions.weight,
            sizeInfo: suggestions.size_info,
            description: suggestions.description,
            isBestseller: suggestions.is_bestseller,
            isNew: suggestions.is_new,
        },
    };
}
