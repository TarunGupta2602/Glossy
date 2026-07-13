import slugify from "slugify";

const SITE_NAME = "The luxe jewels";
const BASE_URL = "https://www.theluxejewels.in";

/** Strip layout template suffix so titles aren't doubled. */
export function formatPageTitle(title) {
    if (!title) return title;
    return title
        .replace(/\s*\|\s*The\s+[Ll]uxe\s+[Jj]ewels\s*$/i, "")
        .trim();
}

export function generateProductSlug(name, id) {
    const base = slugify(name || "product", { lower: true, strict: true });
    const suffix = id ? id.split("-")[0] : Date.now().toString(36);
    return `${base}-${suffix}`;
}

export function buildProductSeo({ name, description, categoryName, price, imageAlt }) {
    const category = categoryName || "Jewellery";
    const priceNum = Number(price) || 0;

    const meta_title = `${name} | ${category}`;
    const meta_description = description?.trim()
        ? description.trim().slice(0, 160)
        : `Shop ${name} from our ${category} collection at The Luxe Jewels. Premium anti-tarnish, waterproof jewellery at ₹${priceNum.toLocaleString("en-IN")}. Buy 2 Get 1 Free + free shipping across India.`;

    const meta_keywords = [
        name,
        category,
        `${name} online india`,
        "anti tarnish jewellery",
        "waterproof jewellery india",
        "gold plated jewellery",
        "buy 2 get 1 free jewellery",
        "the luxe jewels",
    ].join(", ");

    const resolvedImageAlt =
        imageAlt?.trim() || `${name} — ${category} by The Luxe Jewels`;

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
