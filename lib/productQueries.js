import { cache } from "react";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { isUuid } from "@/lib/seo";
import { extractProductIdPrefix } from "@/lib/legacyProductRedirects";

/** Columns needed for product cards / grids — avoid select(*). */
export const PRODUCT_CARD_SELECT =
    "id, name, price, original_price, main_image, image_alt, slug, is_bestseller, is_new, stock_count, category_id, created_at, categories(name, id, slug)";

const PRODUCT_DETAIL_SELECT = "*, categories(name, id, slug)";

async function fetchProductByIdPrefix(supabase, prefix) {
    if (!prefix) return null;

    // Product slugs are generated as `{name}-{first8OfUuid}` — match that suffix first
    const { data: bySlug } = await supabase
        .from("products")
        .select(PRODUCT_DETAIL_SELECT)
        .ilike("slug", `%-${prefix}`)
        .limit(1)
        .maybeSingle();

    if (bySlug) return bySlug;

    // Fallback: cast-friendly text match if any legacy rows still use UUID-only paths
    const { data: candidates } = await supabase
        .from("products")
        .select(PRODUCT_DETAIL_SELECT)
        .like("id", `${prefix}%`)
        .limit(1);

    return candidates?.[0] || null;
}

export const fetchProductBySlugOrId = cache(async (param) => {
    const supabase = getServiceClient();

    let query = supabase.from("products").select(PRODUCT_DETAIL_SELECT);

    if (isUuid(param)) {
        query = query.eq("id", param);
    } else {
        query = query.eq("slug", param);
    }

    const { data, error } = await query.maybeSingle();
    if (!error && data) return data;

    // Recover corrupted GSC slugs like "-odern-bstract-…-448bfb2e" via UUID prefix
    const prefix = extractProductIdPrefix(param);
    if (prefix && !isUuid(param)) {
        return fetchProductByIdPrefix(supabase, prefix);
    }

    return null;
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
