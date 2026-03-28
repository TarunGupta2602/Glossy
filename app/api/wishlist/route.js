import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("wishlist_items")
            .select(`
                product:products (
                    *,
                    categories(name)
                )
            `)
            .eq("user_id", userId);

        if (error) {
            console.error("Wishlist API Fetch Error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // Format to match what the context expects
        const formattedWishlist = (data || [])
            .filter(item => item.product)
            .map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.main_image || "/placeholder.jpg",
                category: item.product.categories?.name || "Jewelry"
            }));

        return NextResponse.json({ success: true, wishlist: formattedWishlist });
    } catch (error) {
        console.error("Wishlist API Error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { userId, productId, action } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

        if (action === "add") {
            const { error } = await supabaseService
                .from("wishlist_items")
                .upsert({
                    user_id: userId,
                    product_id: productId
                }, { onConflict: 'user_id,product_id' });

            if (error) throw error;
        } else if (action === "remove") {
            const { error } = await supabaseService
                .from("wishlist_items")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", productId);

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Wishlist Update Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
