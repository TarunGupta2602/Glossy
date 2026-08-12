import { getServiceClient } from "@/lib/supabaseServiceClient";

/**
 * Count approved reviews per product in a single query (product_id only).
 */
export async function getReviewCounts(productIds = []) {
    if (!productIds.length) return {};

    const supabase = getServiceClient();
    const uniqueIds = [...new Set(productIds.filter(Boolean))];
    if (!uniqueIds.length) return {};

    const { data, error } = await supabase
        .from("reviews")
        .select("product_id")
        .eq("is_approved", true)
        .in("product_id", uniqueIds);

    if (error) {
        console.error("Review count query failed:", error);
        return Object.fromEntries(uniqueIds.map((id) => [id, 0]));
    }

    const counts = Object.fromEntries(uniqueIds.map((id) => [id, 0]));
    for (const row of data || []) {
        if (row?.product_id && counts[row.product_id] !== undefined) {
            counts[row.product_id] += 1;
        }
    }
    return counts;
}
