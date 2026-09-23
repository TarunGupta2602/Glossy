export const revalidate = 60;

import { getServiceClient } from "@/lib/supabaseServiceClient";
import { getDedicatedLandingPath } from "@/lib/categoryLanding";
import { normalizeBlogSlug } from "@/lib/seo";
import { STATIC_BLOG_POSTS } from "@/lib/staticBlogPosts";

const BASE_URL = "https://www.theluxejewels.in";

/** Stable lastmod for rarely edited legal/static pages. Update when content changes. */
const LEGAL_LAST_MODIFIED = new Date("2026-03-01T00:00:00.000Z");

/** Fresh lastmod so Google recrawls new festive / gift / journal URLs. */
const FESTIVE_LAST_MODIFIED = new Date("2026-09-23T12:00:00.000Z");
const FRESH_PATHS = new Set([
    "/festive/diwali",
    "/festive/navratri",
    "/gifts/under-499",
    "/jewellery-shop/noida",
    "/earrings",
    "/necklaces",
    "/bracelets",
    "/shop",
    "/blog/navratri-2026-9-colours-9-jewellery-pairings",
    "/blog/how-to-layer-necklaces-diwali-party-looks",
    "/blog/best-jewellery-gifts-bhai-dooj-karva-chauth",
    "/blog/diwali-jewellery-gifts-under-999-india-2026",
    "/blog/navratri-everyday-festive-earrings-india-2026",
    "/blog/18k-gold-plated-vs-real-gold-jewelry",
    "/blog/15-best-bracelets-for-daily-wear-in-india-2026-gold-silver-fashion",
    "/blog/25-perfect-gift-ideas-for-girlfriend-under-299-that-shell-actually-love",
    "/blog/best-jewelry-gifts-raksha-bandhan-friendship-day-2026",
]);

function toDate(value, fallback) {
    if (!value) return fallback;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date;
}

function staticSitemapPages(lastModified = LEGAL_LAST_MODIFIED) {
    const staticRoutes = [
        { path: "", priority: 1.0, changeFrequency: "daily" },
        { path: "/shop", priority: 0.9, changeFrequency: "daily" },
        { path: "/collection", priority: 0.8, changeFrequency: "weekly" },
        { path: "/earrings", priority: 0.85, changeFrequency: "weekly" },
        { path: "/necklaces", priority: 0.85, changeFrequency: "weekly" },
        { path: "/bracelets", priority: 0.85, changeFrequency: "weekly" },
        { path: "/rings", priority: 0.85, changeFrequency: "weekly" },
        { path: "/gifts/under-499", priority: 0.8, changeFrequency: "weekly" },
        { path: "/festive/diwali", priority: 0.85, changeFrequency: "weekly" },
        { path: "/festive/navratri", priority: 0.85, changeFrequency: "weekly" },
        { path: "/jewellery-shop", priority: 0.75, changeFrequency: "monthly" },
        { path: "/jewellery-shop/noida", priority: 0.8, changeFrequency: "monthly" },
        { path: "/jewellery-shop/greater-noida", priority: 0.75, changeFrequency: "monthly" },
        { path: "/jewellery-shop/ghaziabad", priority: 0.75, changeFrequency: "monthly" },
        { path: "/jewellery-shop/delhi-ncr", priority: 0.8, changeFrequency: "monthly" },
        { path: "/our-story", priority: 0.7, changeFrequency: "monthly" },
        { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
        { path: "/faqs", priority: 0.7, changeFrequency: "monthly" },
        { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
        { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
        { path: "/shipping-returns", priority: 0.6, changeFrequency: "monthly" },
        { path: "/blog", priority: 0.85, changeFrequency: "weekly" },
    ];

    return staticRoutes.map(({ path, priority, changeFrequency }) => ({
        url: `${BASE_URL}${path}`,
        lastModified,
        changeFrequency,
        priority,
    }));
}

function staticBlogSitemapPages(lastModified = LEGAL_LAST_MODIFIED) {
    return STATIC_BLOG_POSTS.map((blog) => ({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: toDate(blog.updated_at || blog.date_posted, lastModified),
        changeFrequency: "monthly",
        priority: 0.75,
    }));
}

export default async function sitemap() {
    try {
        const supabase = getServiceClient();

        const [
            { data: latestProduct },
            { data: latestBlog },
            { data: latestCategory },
        ] = await Promise.all([
            supabase
                .from("products")
                .select("created_at")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle(),
            supabase
                .from("blogs")
                .select("updated_at, date_posted")
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle(),
            supabase
                .from("categories")
                .select("created_at")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle(),
        ]);

        const catalogLastModified = toDate(
            latestProduct?.created_at,
            LEGAL_LAST_MODIFIED
        );
        const blogLastModified = toDate(
            latestBlog?.updated_at || latestBlog?.date_posted,
            catalogLastModified
        );
        const categoryLastModified = toDate(
            latestCategory?.created_at,
            catalogLastModified
        );

        const base = staticSitemapPages(catalogLastModified).map((page) => {
            const path = page.url.replace(BASE_URL, "") || "/";
            if (FRESH_PATHS.has(path)) {
                return { ...page, lastModified: FESTIVE_LAST_MODIFIED };
            }
            if (page.url === `${BASE_URL}/blog`) {
                return { ...page, lastModified: blogLastModified };
            }
            if (page.url.includes("/jewellery-shop") || page.url.includes("/our-story") || page.url.includes("/contact") || page.url.includes("/faqs") || page.url.includes("/privacy") || page.url.includes("/terms") || page.url.includes("/shipping")) {
                return { ...page, lastModified: LEGAL_LAST_MODIFIED };
            }
            if (page.url.includes("/collection")) {
                return { ...page, lastModified: categoryLastModified };
            }
            return page;
        });

        const { data: categories } = await supabase
            .from("categories")
            .select("slug, created_at");

        const categoryPages = (categories || [])
            .filter((cat) => cat.slug && !getDedicatedLandingPath(cat.slug))
            .map((cat) => ({
                url: `${BASE_URL}/shop/${cat.slug}`,
                lastModified: toDate(cat.created_at, categoryLastModified),
                changeFrequency: "weekly",
                priority: 0.8,
            }));

        const { data: products, error: productError } = await supabase
            .from("products")
            .select("slug, created_at, is_bestseller, is_new");

        if (productError) {
            console.error("Sitemap product query failed:", productError);
        }

        const productPages = (products || [])
            .filter((p) => p?.slug && !String(p.slug).startsWith("-"))
            .map((product) => ({
                url: `${BASE_URL}/product/${product.slug}`,
                lastModified: toDate(product.created_at, catalogLastModified),
                changeFrequency: "weekly",
                priority: product.is_bestseller
                    ? 0.9
                    : product.is_new
                      ? 0.85
                      : 0.8,
            }));

        const { data: blogs } = await supabase
            .from("blogs")
            .select("slug, updated_at, date_posted")
            .not("slug", "is", null)
            .order("date_posted", { ascending: false });

        const seenBlogUrls = new Set();
        const blogPages = [];

        for (const blog of blogs || []) {
            const slug = normalizeBlogSlug(blog.slug) || blog.slug;
            if (!slug) continue;
            const url = `${BASE_URL}/blog/${slug}`;
            if (seenBlogUrls.has(url)) continue;
            seenBlogUrls.add(url);
            blogPages.push({
                url,
                lastModified: toDate(
                    blog.updated_at || blog.date_posted,
                    blogLastModified
                ),
                changeFrequency: "monthly",
                priority: 0.75,
            });
        }

        for (const page of staticBlogSitemapPages(blogLastModified)) {
            if (seenBlogUrls.has(page.url)) continue;
            seenBlogUrls.add(page.url);
            const path = page.url.replace(BASE_URL, "");
            blogPages.push(
                FRESH_PATHS.has(path)
                    ? { ...page, lastModified: FESTIVE_LAST_MODIFIED }
                    : page
            );
        }

        for (const page of blogPages) {
            const path = page.url.replace(BASE_URL, "");
            if (FRESH_PATHS.has(path)) {
                page.lastModified = FESTIVE_LAST_MODIFIED;
            }
        }

        return [...base, ...categoryPages, ...productPages, ...blogPages];
    } catch (error) {
        console.error("Sitemap generation failed, returning static fallback:", error);
        return [...staticSitemapPages(), ...staticBlogSitemapPages()];
    }
}
