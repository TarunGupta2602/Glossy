export const revalidate = 3600;

import { getServiceClient } from "@/lib/supabaseServiceClient";
import { getDedicatedLandingPath } from "@/lib/categoryLanding";
import { normalizeBlogSlug } from "@/lib/seo";
import { STATIC_BLOG_POSTS } from "@/lib/staticBlogPosts";

const BASE_URL = "https://www.theluxejewels.in";

/** Stable lastmod for rarely edited legal/static pages. Update when content changes. */
const LEGAL_LAST_MODIFIED = new Date("2026-03-01T00:00:00.000Z");

function toDate(value, fallback) {
    if (!value) return fallback;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date;
}

export default async function sitemap() {
    const supabase = getServiceClient();

    const [
        { data: latestProduct },
        { data: latestBlog },
        { data: latestCategory },
    ] = await Promise.all([
        supabase.from("products").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("blogs").select("updated_at, date_posted").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("categories").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const catalogLastModified = toDate(latestProduct?.created_at, LEGAL_LAST_MODIFIED);
    const blogLastModified = toDate(latestBlog?.updated_at || latestBlog?.date_posted, catalogLastModified);
    const categoryLastModified = toDate(latestCategory?.created_at, catalogLastModified);

    const staticRoutes = [
        { path: "", priority: 1.0, changeFrequency: "daily", lastModified: catalogLastModified },
        { path: "/shop", priority: 0.9, changeFrequency: "daily", lastModified: catalogLastModified },
        { path: "/collection", priority: 0.8, changeFrequency: "weekly", lastModified: categoryLastModified },
        { path: "/earrings", priority: 0.85, changeFrequency: "weekly", lastModified: catalogLastModified },
        { path: "/necklaces", priority: 0.85, changeFrequency: "weekly", lastModified: catalogLastModified },
        { path: "/gifts/under-499", priority: 0.8, changeFrequency: "weekly", lastModified: catalogLastModified },
        { path: "/gifts/under-999", priority: 0.8, changeFrequency: "weekly", lastModified: catalogLastModified },
        { path: "/our-story", priority: 0.7, changeFrequency: "monthly", lastModified: LEGAL_LAST_MODIFIED },
        { path: "/contact", priority: 0.7, changeFrequency: "monthly", lastModified: LEGAL_LAST_MODIFIED },
        { path: "/faqs", priority: 0.7, changeFrequency: "monthly", lastModified: LEGAL_LAST_MODIFIED },
        { path: "/privacy", priority: 0.4, changeFrequency: "yearly", lastModified: LEGAL_LAST_MODIFIED },
        { path: "/terms", priority: 0.4, changeFrequency: "yearly", lastModified: LEGAL_LAST_MODIFIED },
        { path: "/shipping-returns", priority: 0.6, changeFrequency: "monthly", lastModified: LEGAL_LAST_MODIFIED },
    ];

    const staticPages = staticRoutes.map(({ path, priority, changeFrequency, lastModified }) => ({
        url: `${BASE_URL}${path}`,
        lastModified,
        changeFrequency,
        priority,
    }));

    const { data: categories } = await supabase.from("categories").select("slug, created_at");

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
            priority: product.is_bestseller ? 0.9 : product.is_new ? 0.85 : 0.8,
        }));

    const { data: blogs } = await supabase
        .from("blogs")
        .select("slug, updated_at, date_posted")
        .order("date_posted", { ascending: false });

    // Only sitemap the main journal hub — paginated pages are noindex
    const blogIndexPages = [
        {
            url: `${BASE_URL}/blog`,
            lastModified: blogLastModified,
            changeFrequency: "weekly",
            priority: 0.85,
        },
    ];

    const blogPages = [
        ...STATIC_BLOG_POSTS.map((blog) => ({
            url: `${BASE_URL}/blog/${blog.slug}`,
            lastModified: toDate(blog.updated_at || blog.date_posted, blogLastModified),
            changeFrequency: "monthly",
            priority: 0.75,
        })),
        ...(blogs || []).map((blog) => ({
            url: `${BASE_URL}/blog/${normalizeBlogSlug(blog.slug) || blog.slug}`,
            lastModified: toDate(blog.updated_at || blog.date_posted, blogLastModified),
            changeFrequency: "monthly",
            priority: 0.7,
        })),
    ];

    return [...staticPages, ...blogIndexPages, ...categoryPages, ...productPages, ...blogPages];
}