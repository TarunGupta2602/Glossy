import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser } from "@/lib/requireAuth";

export async function GET(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("wishlist_items")
            .select(
                `
                product:products (
                    *,
                    slug,
                    categories(name)
                )
            `
            )
            .eq("user_id", auth.user.id);

        if (error) {
            console.error("Wishlist API Fetch Error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        const formattedWishlist = (data || [])
            .filter((item) => item.product)
            .map((item) => ({
                id: item.product.id,
                slug: item.product.slug,
                name: item.product.name,
                price: item.product.price,
                image: item.product.main_image || "/logo.png",
                category: item.product.categories?.name || "Jewellery",
            }));

        return NextResponse.json({ success: true, wishlist: formattedWishlist });
    } catch (error) {
        console.error("Wishlist API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const { productId, action } = await req.json();
        const userId = auth.user.id;

        if (!productId || !action) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const supabaseService = getServiceClient();

        if (action === "add") {
            const { error } = await supabaseService.from("wishlist_items").upsert(
                {
                    user_id: userId,
                    product_id: productId,
                },
                { onConflict: "user_id,product_id" }
            );

            if (error) throw error;
        } else if (action === "remove") {
            const { error } = await supabaseService
                .from("wishlist_items")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", productId);

            if (error) throw error;
        } else {
            return NextResponse.json(
                { success: false, error: "Invalid action" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Wishlist Update Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
