import { BRAND_NAME, BRAND_URL } from "@/lib/constants";
import { getProductPath } from "@/lib/seo";
import { toAbsoluteSiteMediaUrl } from "@/lib/siteMedia";
import { PAID_SHIPPING_FEE } from "@/lib/promo";

const GOOGLE_CATEGORY_BY_SLUG = {
    earrings: "188",
    necklaces: "196",
    bracelets: "191",
    rings: "201",
};

function escapeXml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function plainText(value, max = 5000) {
    return String(value || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max);
}

function formatPrice(value) {
    return `${Number(value || 0).toFixed(2)} INR`;
}

function productType(category) {
    const name = category?.name || "Jewellery";
    return `Apparel & Accessories > Jewelry > ${name}`;
}

export function buildMerchantItemXml(product) {
    const slug = product?.slug;
    if (!slug || String(slug).startsWith("-")) return "";
    const price = Number(product.price);
    if (!price || price <= 0) return "";

    const image = toAbsoluteSiteMediaUrl(product.main_image);
    if (!image || image.endsWith("/logo.png")) return "";

    const link = `${BRAND_URL}${getProductPath(product)}`;
    const title = plainText(product.name, 150);
    const description =
        plainText(product.meta_description || product.description, 5000) ||
        `${title} — anti-tarnish waterproof jewellery from ${BRAND_NAME}. Buy 2 Get 1 Free, pan-India shipping.`;
    const inStock = product.stock_count == null || Number(product.stock_count) > 0;
    const categorySlug = product.categories?.slug || "";
    const googleCategory = GOOGLE_CATEGORY_BY_SLUG[categorySlug] || "188";
    const original = Number(product.original_price);
    const salePrice =
        original && original > price ? `<g:sale_price>${formatPrice(price)}</g:sale_price>` : "";
    const listedPrice = original && original > price ? original : price;

    return `
    <item>
      <g:id>${escapeXml(slug)}</g:id>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:availability>${inStock ? "in stock" : "out of stock"}</g:availability>
      <g:price>${formatPrice(listedPrice)}</g:price>
      ${salePrice}
      <g:brand>${escapeXml(BRAND_NAME)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type>${escapeXml(productType(product.categories))}</g:product_type>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard</g:service>
        <g:price>${formatPrice(PAID_SHIPPING_FEE)}</g:price>
      </g:shipping>
    </item>`;
}

export function buildMerchantRss(products = []) {
    const items = products.map(buildMerchantItemXml).filter(Boolean).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BRAND_NAME)} product feed</title>
    <link>${BRAND_URL}/shop</link>
    <atom:link href="${BRAND_URL}/feeds/merchant.xml" rel="self" type="application/rss+xml" />
    <description>Anti-tarnish waterproof jewellery from ${escapeXml(BRAND_NAME)} — India shipping, Buy 2 Get 1 Free.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}
