import slugify from "slugify";

const SITE_NAME = "The Luxe Jewels";
const BASE_URL = "https://www.theluxejewels.in";

/**
 * Next.js Image blocks absolute same-origin URLs unless listed in remotePatterns.
 * CMS sometimes stores https://www.theluxejewels.in/blog/... — convert to /blog/...
 */
export function normalizeBlogImageSrc(src) {
    if (!src) return src;
    const value = String(src).trim();
    if (!value) return value;

    try {
        if (value.startsWith("http://") || value.startsWith("https://")) {
            const url = new URL(value);
            const host = url.hostname.replace(/^www\./, "");
            if (host === "theluxejewels.in") {
                return `${url.pathname}${url.search}` || "/";
            }
        }
    } catch {
        // keep original
    }

    return value;
}

/** Absolute URL for OG/JSON-LD from a blog image (relative or absolute). */
export function absoluteBlogImageUrl(src) {
    const normalized = normalizeBlogImageSrc(src);
    if (!normalized) return `${BASE_URL}/og-image.png`;
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
        return normalized;
    }
    return `${BASE_URL}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}

/** Strip layout template suffix so titles aren't doubled. */
export function formatPageTitle(title) {
    if (!title) return title;
    return title
        .replace(/\s*\|\s*The\s+[Ll]uxe\s+[Jj]ewels(\s+Blog)?\s*$/i, "")
        .trim();
}

/** Truncate meta descriptions on a word boundary (default 160). */
export function truncateMetaDescription(text, max = 160) {
    const value = String(text || "").replace(/\s+/g, " ").trim();
    if (!value) return "";
    if (value.length <= max) return value;

    const sliced = value.slice(0, max);
    const lastSpace = sliced.lastIndexOf(" ");
    const trimmed = (lastSpace > Math.floor(max * 0.6) ? sliced.slice(0, lastSpace) : sliced).trim();
    return trimmed.replace(/[.,;:!?\-–—]+$/, "") + "…";
}

/** Fix known CMS typo baked into SEO strings. */
export function scrubCategoryTypos(text) {
    return String(text || "").replace(/Piecess/gi, "Pieces");
}

/**
 * Truncate page titles on a word boundary (default 42).
 * Layout appends " | The Luxe Jewels" (18 chars) — keep raw titles ≤42 for ≤60 SERP.
 */
export function truncateMetaTitle(text, max = 42) {
    let value = formatPageTitle(scrubCategoryTypos(String(text || "").replace(/\s+/g, " ").trim()));
    if (!value) return "";

    // Drop trailing " | Category" when the left side is already a usable title
    const pipe = value.lastIndexOf("|");
    if (pipe > 0) {
        const left = value.slice(0, pipe).trim();
        if (left.length >= 18) value = left;
    }

    if (value.length <= max) return value;

    const sliced = value.slice(0, max);
    const lastSpace = sliced.lastIndexOf(" ");
    const trimmed = (
        lastSpace > Math.floor(max * 0.55) ? sliced.slice(0, lastSpace) : sliced
    ).trim();
    return trimmed.replace(/[.,;:!?\-–—|]+$/, "").trim();
}

/** Canonical path for paginated index pages (page 1 has no query). */
export function getPaginatedCanonical(basePath, page = 1) {
    const path = basePath.startsWith("/") ? basePath : `/${basePath}`;
    const pageNum = Number(page) || 1;
    if (pageNum <= 1) return path;
    return `${path}?page=${pageNum}`;
}

/** Normalize blog/tag slugs: lowercase, hyphens, no leading/trailing dashes. */
export function normalizeBlogSlug(text) {
    const value = String(text || "")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .trim();
    return value || "post";
}

export function generateProductSlug(name, id) {
    const base = slugify(name || "product", { lower: true, strict: true })
        .replace(/^-+|-+$/g, "");
    const suffix = id ? String(id).split("-")[0] : Date.now().toString(36);
    const slug = `${base || "product"}-${suffix}`.replace(/-+/g, "-");
    return slug.replace(/^-+/, "");
}

export function detectProductKind(name = "", categoryName = "", description = "") {
    const blob = `${name} ${categoryName} ${description}`.toLowerCase();
    if (/earring|stud|hoop|jhumka|drop|huggie/.test(blob)) return "earrings";
    if (/necklace|chain|pendant|choker|haar|lariat/.test(blob)) return "necklace";
    if (/bracelet|bangle|kada|cuff/.test(blob)) return "bracelet";
    if (/ring\b|band/.test(blob)) return "ring";
    if (/anklet|payal/.test(blob)) return "anklet";
    if (/set|duo|combo/.test(blob)) return "set";
    return "jewellery";
}

function kindSearchTerms(kind) {
    switch (kind) {
        case "earrings":
            return [
                "gold plated earrings india",
                "anti tarnish earrings",
                "daily wear earrings women",
                "waterproof hoop earrings",
            ];
        case "necklace":
            return [
                "gold plated necklace india",
                "anti tarnish necklace",
                "daily wear pendant necklace",
                "waterproof necklace women",
            ];
        case "bracelet":
            return [
                "gold plated bracelet india",
                "anti tarnish bracelet",
                "daily wear bracelet women",
                "waterproof bracelet",
            ];
        case "ring":
            return [
                "gold plated ring india",
                "anti tarnish ring women",
                "daily wear gold ring",
                "buy rings online india",
            ];
        case "set":
            return [
                "jewellery set india",
                "bangle and ring set",
                "anti tarnish jewellery set",
            ];
        default:
            return [
                "anti tarnish jewellery india",
                "waterproof gold plated jewellery",
            ];
    }
}

/** Stable 0–n-1 pick from product name (for meta phrase rotation). */
function nameVariantIndex(name, modulo) {
    const s = String(name || "");
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    return modulo > 0 ? hash % modulo : 0;
}

function pickNameHook(cleanName) {
    const lower = cleanName.toLowerCase();
    if (/coin|medallion/.test(lower)) return "coin medallion look";
    if (/ribbed|coiled|texture/.test(lower)) return "ribbed texture that catches light";
    if (/daisy|flower|floral/.test(lower)) return "floral everyday detail";
    if (/star|celestial|crescent|moon/.test(lower)) return "celestial everyday sparkle";
    if (/heart/.test(lower)) return "heart motif for gifting";
    if (/hoop/.test(lower)) return "lightweight hoop silhouette";
    if (/pendant/.test(lower)) return "pendant-ready everyday chain";
    if (/bangle/.test(lower)) return "stack-friendly bangle feel";
    if (/ring/.test(lower) && !/earring/.test(lower)) return "comfortable daily ring";
    return null;
}

function buildUniqueMetaDescription({ cleanName, kind, plate, priceLabel }) {
    const hook = pickNameHook(cleanName);
    const kindLabel = kind === "jewellery" ? "jewellery" : kind;
    const openers = [
        `Buy ${cleanName} online`,
        `Shop ${cleanName} at ${SITE_NAME}`,
        `${cleanName} — ready to ship across India`,
        `Get the ${cleanName} from ${SITE_NAME}`,
    ];
    const middles = [
        `${plate}, anti-tarnish & waterproof.`,
        `anti-tarnish ${plate} finish for humid days.`,
        `waterproof ${kindLabel} in ${plate}.`,
    ];
    const closers = [
        `Daily wear ${kindLabel} for India.`,
        hook ? `Highlights: ${hook}.` : `Made for office, college & evenings.`,
        priceLabel ? `Priced at ${priceLabel}.` : "Gift-ready packaging.",
        "Buy 2 Get 1 Free + free shipping on prepaid orders over ₹1000.",
    ];

    const i = nameVariantIndex(cleanName, openers.length);
    const j = nameVariantIndex(`${cleanName}|${kind}`, middles.length);

    return truncateMetaDescription(
        [
            openers[i],
            "—",
            middles[j],
            priceLabel && i === 0 ? `At ${priceLabel}` : "",
            i === 0 ? `from ${SITE_NAME}.` : "",
            ...closers,
        ]
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .replace(/\.\s*\./g, ".")
            .trim(),
        155
    );
}

export function buildProductFeatures({ name, categoryName, description } = {}) {
    const kind = detectProductKind(name, categoryName, description);
    const base = [
        "Anti-tarnish & waterproof for everyday Indian wear",
        "18k gold plated look without solid-gold prices",
        "Lightweight, skin-safe finish for all-day comfort",
        "Buy 2 Get 1 Free across the store",
    ];
    if (kind === "earrings") {
        return [
            "Designed for daily office & college wear",
            ...base.slice(0, 3),
            "Pairs easily with ethnic and western outfits",
        ];
    }
    if (kind === "necklace") {
        return [
            "Layer-friendly length for everyday styling",
            ...base.slice(0, 3),
            "Secure clasp for commute-ready wear",
        ];
    }
    if (kind === "bracelet") {
        return [
            "Comfortable for all-day wrist wear",
            ...base.slice(0, 3),
            "Works from office to evening looks",
        ];
    }
    if (kind === "ring") {
        return [
            "Stack-friendly everyday ring silhouette",
            ...base.slice(0, 3),
            "Gift-ready for birthdays and festive weeks",
        ];
    }
    if (kind === "set") {
        return [
            "Coordinated set for effortless styling",
            ...base.slice(0, 3),
            "Ideal gifting bundle under Buy 2 Get 1 Free",
        ];
    }
    return base;
}

export function enrichProductDescription({
    name,
    description,
    categoryName,
    price,
    plating,
}) {
    const cleanName = String(name || "").replace(/\s+/g, " ").trim() || "This piece";
    const category = scrubCategoryTypos(categoryName || "Jewellery").trim();
    const priceNum = Number(price) || 0;
    const priceLabel = priceNum
        ? `₹${priceNum.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
        : "";
    const plate = plating || "18k gold plated";
    const existing = scrubCategoryTypos(String(description || "").replace(/\s+/g, " ").trim());

    const seoClose = [
        `Shop the ${cleanName} from The Luxe Jewels — ${plate}, anti-tarnish and waterproof for humid Indian days.`,
        priceLabel
            ? `Priced at ${priceLabel} in our ${category} edit.`
            : `Part of our ${category} edit.`,
        "Enjoy Buy 2 Get 1 Free, pan-India shipping, and free delivery on prepaid orders over ₹1000.",
    ].join(" ");

    if (!existing) return seoClose;
    if (
        /anti-?tarnish|buy 2 get 1|waterproof|the luxe jewels/i.test(existing) &&
        existing.length >= 180
    ) {
        return existing;
    }
    return `${existing}\n\n${seoClose}`;
}

export function buildProductSeo({
    name,
    description,
    categoryName,
    price,
    imageAlt,
    plating,
}) {
    const category = scrubCategoryTypos(categoryName || "Jewellery").trim() || "Jewellery";
    const priceNum = Number(price) || 0;
    const priceLabel = priceNum
        ? `₹${priceNum.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
        : "";
    const cleanName = String(name || "").replace(/\s+/g, " ").trim() || "Jewellery";
    const kind = detectProductKind(cleanName, category, description);
    const plate = plating || "18k gold plated";

    const meta_title = truncateMetaTitle(cleanName, 42);

    const meta_description = buildUniqueMetaDescription({
        cleanName,
        kind,
        plate,
        priceLabel,
    });

    const meta_keywords = [
        cleanName.toLowerCase(),
        `${cleanName.toLowerCase()} online`,
        `${cleanName.toLowerCase()} india`,
        category.toLowerCase(),
        ...kindSearchTerms(kind),
        "anti tarnish jewellery",
        "waterproof jewellery india",
        "18k gold plated jewellery",
        "buy 2 get 1 free jewellery",
        "the luxe jewels",
        "jewellery noida",
    ]
        .map((k) => scrubCategoryTypos(k).trim())
        .filter(Boolean)
        .filter((k, i, arr) => arr.indexOf(k) === i)
        .slice(0, 14)
        .join(", ");

    const resolvedImageAlt =
        imageAlt?.trim() ||
        `${cleanName} — ${plate} anti-tarnish ${kind} by ${SITE_NAME}`;

    return {
        meta_title,
        meta_description,
        meta_keywords,
        image_alt: scrubCategoryTypos(resolvedImageAlt),
        kind,
    };
}

export function getProductPath(product) {
    if (!product) return "/shop";
    return product.slug ? `/product/${product.slug}` : `/product/${product.id}`;
}

export function getProductCanonicalUrl(product) {
    return `${BASE_URL}${getProductPath(product)}`;
}

export function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value || ""
    );
}

export { SITE_NAME, BASE_URL };
