import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function getFeaturedReviews(limit = 6) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
        .from("reviews")
        .select(
            "id, user_name, rating, comment, title, is_verified_purchase, images, products(id, name, slug, main_image)"
        )
        .eq("is_approved", true)
        .gte("rating", 4)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Featured reviews query failed:", error);
        return [];
    }

    return data || [];
}

export function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

/** First usable photo from review images or linked product */
export function getReviewVisual(review) {
    const imgs = Array.isArray(review?.images) ? review.images : [];
    const first = imgs.find((src) => typeof src === "string" && src.trim());
    if (first) return first;
    return review?.products?.main_image || null;
}
