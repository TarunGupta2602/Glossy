import { cache } from "react";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { isUuid } from "@/lib/seo";

/** Columns needed for product cards / grids — avoid select(*). */
export const PRODUCT_CARD_SELECT =
    "id, name, price, original_price, main_image, image_alt, slug, is_bestseller, is_new, stock_count, category_id, created_at, categories(name, id, slug)";

export const fetchProductBySlugOrId = cache(async (param) => {
    const supabase = getServiceClient();

    let query = supabase
        .from("products")
        .select("*, categories(name, id, slug)");

    if (isUuid(param)) {
        query = query.eq("id", param);
    } else {
        query = query.eq("slug", param);
    }

    const { data, error } = await query.single();
    if (error || !data) return null;
    return data;
});

export async function getProductStaticParams(limit = 100) {
    const supabase = getServiceClient();
    const { data } = await supabase
        .from("products")
        .select("slug")
        .not("slug", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);

    return (data || [])
        .filter((p) => p.slug)
        .map((p) => ({ slug: p.slug }));
}

export async function getCategoryStaticParams(limit = 50) {
    const supabase = getServiceClient();
    const { data } = await supabase
        .from("categories")
        .select("slug")
        .not("slug", "is", null)
        .limit(limit);

    return (data || [])
        .filter((c) => c.slug)
        .map((c) => ({ slug: c.slug }));
}
