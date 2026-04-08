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
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.8,
    }));

    // 2. Dynamic Product Pages
    const { data: products } = await supabase
        .from("products")
        .select("id, updated_at")
        .order("updated_at", { ascending: false });

    const productPages = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // 3. Dynamic Category Pages (Optional — if you have category slugs)
    // For now, these were hardcoded in your previous sitemap.

    return [...staticPages, ...productPages];
}
