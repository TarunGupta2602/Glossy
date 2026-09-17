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

export function buildProductSeo({ name, description, categoryName, price, imageAlt }) {
    const category = scrubCategoryTypos(categoryName || "Jewellery").trim() || "Jewellery";
    const priceNum = Number(price) || 0;
    const cleanName = String(name || "").replace(/\s+/g, " ").trim() || "Jewellery";

    // Name only — layout template adds " | The Luxe Jewels"
    const meta_title = truncateMetaTitle(cleanName, 42);
    const meta_description = description?.trim()
        ? truncateMetaDescription(scrubCategoryTypos(description.trim()), 160)
        : truncateMetaDescription(
              `Shop ${cleanName} from our ${category} collection at ${SITE_NAME}. Premium anti-tarnish, waterproof jewellery at ₹${priceNum.toLocaleString("en-IN", { maximumFractionDigits: 0 })}. Buy 2 Get 1 Free + free shipping across India.`,
              160
          );

    const meta_keywords = [
        cleanName,
        category,
        `${cleanName} online india`,
        "anti tarnish jewellery",
        "waterproof jewellery india",
        "gold plated jewellery",
        "buy 2 get 1 free jewellery",
        "the luxe jewels india",
    ].join(", ");

    const resolvedImageAlt =
        imageAlt?.trim() || `${cleanName} — ${category} by ${SITE_NAME}`;

    return {
        meta_title,
        meta_description,
        meta_keywords,
        image_alt: scrubCategoryTypos(resolvedImageAlt),
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
