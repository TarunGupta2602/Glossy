import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function getReviewCounts(productIds = []) {
    if (!productIds.length) return {};

    const supabase = getServiceClient();
    const { data, error } = await supabase
        .from("reviews")
        .select("product_id")
        .eq("is_approved", true)
        .in("product_id", productIds);

    if (error) {
        console.error("Review count query failed:", error);
        return {};
    }

    return (data || []).reduce((acc, row) => {
        acc[row.product_id] = (acc[row.product_id] || 0) + 1;
        return acc;
    }, {});
}
