import slugify from "slugify";

const SITE_NAME = "The Luxe Jewels";
const BASE_URL = "https://www.theluxejewels.in";

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
    const category = categoryName || "Jewellery";
    const priceNum = Number(price) || 0;

    const meta_title = `${name} | ${category}`;
    const meta_description = description?.trim()
        ? truncateMetaDescription(description.trim(), 160)
        : `Shop ${name} from our ${category} collection at ${SITE_NAME}. Premium anti-tarnish, waterproof jewellery at ₹${priceNum.toLocaleString("en-IN", { maximumFractionDigits: 0 })}. Buy 2 Get 1 Free + free shipping across India.`;

    const meta_keywords = [
        name,
        category,
        `${name} online india`,
        "anti tarnish jewellery",
        "waterproof jewellery india",
        "gold plated jewellery",
        "buy 2 get 1 free jewellery",
        "the luxe jewels india",
    ].join(", ");

    const resolvedImageAlt =
        imageAlt?.trim() || `${name} — ${category} by ${SITE_NAME}`;

    return { meta_title, meta_description, meta_keywords, image_alt: resolvedImageAlt };
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
