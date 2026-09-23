import { getServiceClient } from "@/lib/supabaseServiceClient";

export { getReviewSummary, reviewCardProps } from "@/lib/reviewDisplay";

function emptySummary() {
    return { count: 0, average: 0 };
}

/**
 * Approved review count + average per product (single query).
 * Returns { [productId]: { count, average } }.
 */
export async function getReviewCounts(productIds = []) {
    if (!productIds.length) return {};

    const supabase = getServiceClient();
    const uniqueIds = [...new Set(productIds.filter(Boolean))];
    if (!uniqueIds.length) return {};

    const empty = Object.fromEntries(uniqueIds.map((id) => [id, emptySummary()]));

    const { data, error } = await supabase
        .from("reviews")
        .select("product_id, rating")
        .eq("is_approved", true)
        .in("product_id", uniqueIds);

    if (error) {
        console.error("Review count query failed:", error);
        return empty;
    }

    const totals = {};
    for (const row of data || []) {
        if (!row?.product_id || empty[row.product_id] === undefined) continue;
        if (!totals[row.product_id]) totals[row.product_id] = { sum: 0, count: 0 };
        totals[row.product_id].sum += Number(row.rating) || 0;
        totals[row.product_id].count += 1;
    }

    const summaries = { ...empty };
    for (const [id, total] of Object.entries(totals)) {
        summaries[id] = {
            count: total.count,
            average: total.count ? parseFloat((total.sum / total.count).toFixed(1)) : 0,
        };
    }
    return summaries;
}
