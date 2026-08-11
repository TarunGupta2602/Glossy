import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function getFeaturedReviews(limit = 3) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
        .from("reviews")
        .select("id, user_name, rating, comment, title, is_verified_purchase, products(id, name, slug)")
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
