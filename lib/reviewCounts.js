import { getServiceClient } from "@/lib/supabaseServiceClient";

/**
 * Count approved reviews per product without downloading every review row.
 * Uses parallel head-count queries (cheap for a page of ~12 products).
 */
export async function getReviewCounts(productIds = []) {
    if (!productIds.length) return {};

    const supabase = getServiceClient();
    const uniqueIds = [...new Set(productIds.filter(Boolean))];

    const results = await Promise.all(
        uniqueIds.map(async (productId) => {
            const { count, error } = await supabase
                .from("reviews")
                .select("id", { count: "exact", head: true })
                .eq("product_id", productId)
                .eq("is_approved", true);

            if (error) {
                console.error("Review count query failed:", productId, error);
                return [productId, 0];
            }
            return [productId, count || 0];
        })
    );

    return Object.fromEntries(results);
}
