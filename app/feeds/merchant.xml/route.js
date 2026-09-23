import { getServiceClient } from "@/lib/supabaseServiceClient";
import { buildMerchantRss } from "@/lib/merchantFeed";

export const revalidate = 300;

/**
 * Google Merchant Center product feed (RSS 2.0 + g: namespace).
 * Connect this URL in Merchant Center → Products → Feeds:
 * https://www.theluxejewels.in/feeds/merchant.xml
 */
export async function GET() {
    const supabase = getServiceClient();
    const { data: products, error } = await supabase
        .from("products")
        .select(
            "id, name, price, original_price, main_image, slug, stock_count, description, meta_description, categories(name, slug)"
        )
        .not("slug", "is", null)
        .order("created_at", { ascending: false })
        .limit(500);

    if (error) {
        console.error("Merchant feed query failed:", error);
    }

    const xml = buildMerchantRss(products || []);

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
    });
}
