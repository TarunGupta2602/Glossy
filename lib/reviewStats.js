import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function getSiteReviewStats() {
    const supabase = getServiceClient();

    const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("is_approved", true);

    if (error || !data?.length) {
        return { count: 0, average: 0 };
    }

    const count = data.length;
    const average = data.reduce((sum, r) => sum + r.rating, 0) / count;

    return {
        count,
        average: parseFloat(average.toFixed(1)),
    };
}
