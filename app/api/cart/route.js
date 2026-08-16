import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser } from "@/lib/requireAuth";

export async function GET(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("cart_items")
            .select(
                `
                quantity,
                product:products (
                    *,
                    slug,
                    stock_count,
                    categories(name)
                )
            `
            )
            .eq("user_id", auth.user.id);

        if (error) {
            console.error("Cart API Fetch Error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        const formattedCart = (data || [])
            .filter((item) => item.product)
            .map((item) => ({
                id: item.product.id,
                slug: item.product.slug,
                name: item.product.name,
                price: item.product.price,
                description: item.product.description,
                image: item.product.main_image || "/logo.png",
                category: item.product.categories?.name || "Jewellery",
                quantity: item.quantity,
                stock_count: item.product.stock_count,
            }));

        return NextResponse.json({ success: true, cart: formattedCart });
    } catch (error) {
        console.error("Cart API Error:", error);
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

        const { productId, quantity, action } = await req.json();
        const userId = auth.user.id;

        if (!action) {
            return NextResponse.json(
                { success: false, error: "Missing action" },
                { status: 400 }
            );
        }

        const supabaseService = getServiceClient();

        if (action === "add" || action === "update") {
            if (!productId) {
                return NextResponse.json(
                    { success: false, error: "Missing productId" },
                    { status: 400 }
                );
            }

            const qty = Number(quantity) || 1;
            if (qty < 1) {
                return NextResponse.json(
                    { success: false, error: "Invalid quantity" },
                    { status: 400 }
                );
            }

            const { data: product, error: productError } = await supabaseService
                .from("products")
                .select("id, stock_count")
                .eq("id", productId)
                .single();

            if (productError || !product) {
                return NextResponse.json(
                    { success: false, error: "Product not found" },
                    { status: 404 }
                );
            }

            if (
                product.stock_count != null &&
                product.stock_count < qty
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            product.stock_count <= 0
                                ? "Out of stock"
                                : `Only ${product.stock_count} left in stock`,
                    },
                    { status: 409 }
                );
            }

            const { error } = await supabaseService.from("cart_items").upsert(
                {
                    user_id: userId,
                    product_id: productId,
                    quantity: qty,
                },
                { onConflict: "user_id,product_id" }
            );

            if (error) throw error;
        } else if (action === "remove") {
            if (!productId) {
                return NextResponse.json(
                    { success: false, error: "Missing productId" },
                    { status: 400 }
                );
            }

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
        } else {
            return NextResponse.json(
                { success: false, error: "Invalid action" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cart Update Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
