import { getServiceClient } from "@/lib/supabaseServiceClient";
import { isUuid } from "@/lib/seo";

export async function fetchProductBySlugOrId(param) {
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
}
