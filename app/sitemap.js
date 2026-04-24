export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getServiceClient } from "@/lib/supabaseServiceClient";

export default async function sitemap() {
    const supabase = getServiceClient();
    const baseUrl = "https://www.theluxejewels.in";

    // 1. Static Pages
    const staticPages = [
        "",
        "/shop",
        "/collection",
        "/earrings",
        "/necklaces",
        "/our-story",
        "/contact",
        "/faqs",
        "/privacy",
        "/terms",
        "/shipping-returns",
        "/blog",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/shop" ? "daily" : route === "/blog" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : route === "/blog" ? 0.8 : 0.8,
    }));

    // 2. Dynamic Category Pages
    const { data: categories } = await supabase
        .from("categories")
        .select("slug");

    const categoryPages = (categories || []).map((cat) => ({
        url: `${baseUrl}/shop/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // 3. Dynamic Product Pages
    const { data: products } = await supabase
        .from("products")
        .select("id, created_at")
        .order("created_at", { ascending: false });

    const productPages = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: product.created_at ? new Date(product.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // 4. Dynamic Blog Pages
    const { data: blogs } = await supabase
        .from("blogs")
        .select("slug, updated_at, date_posted")
        .order("date_posted", { ascending: false });

    const blogPages = (blogs || []).map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}

