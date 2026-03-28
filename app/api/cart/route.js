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
            .from("cart_items")
            .select(`
                quantity,
                product:products (
                    *,
                    categories(name)
                )
            `)
            .eq("user_id", userId);

        if (error) {
            console.error("Cart API Fetch Error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const formattedCart = (data || [])
            .filter(item => item.product)
            .map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                description: item.product.description,
                image: item.product.main_image || "/placeholder.jpg",
                category: item.product.categories?.name || "Jewelry",
                quantity: item.quantity
            }));


        return NextResponse.json({ success: true, cart: formattedCart });
    } catch (error) {
        console.error("Cart API Error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { userId, productId, quantity, action } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

        if (action === "add" || action === "update") {
            const { error } = await supabaseService
                .from("cart_items")
                .upsert({
                    user_id: userId,
                    product_id: productId,
                    quantity: quantity
                }, { onConflict: 'user_id,product_id' });

            if (error) throw error;
        } else if (action === "remove") {
            const { error } = await supabaseService
                .from("cart_items")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", productId);

            if (error) throw error;
        } else if (action === "clear") {
            const { error } = await supabaseService
                .from("cart_items")
                .delete()
                .eq("user_id", userId);

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cart Update Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
