import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const supabaseService = getServiceClient();

        // 1. Fetch main product
        const { data: product, error: productError } = await supabaseService
            .from("products")
            .select(`
                *,
                categories(name, id, slug)
            `)
            .eq("id", id)
            .single();

        if (productError || !product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // 2. Fetch gallery images
        const { data: galleryImages } = await supabaseService
            .from("product_images")
            .select("image_url")
            .eq("product_id", id)
            .order("created_at", { ascending: true });

        // 3. Fetch related products (same category)
        const { data: related } = await supabaseService
            .from("products")
            .select(`
                id, name, price, main_image,
                categories(name)
            `)
            .eq("category_id", product.category_id)
            .neq("id", id)
            .order("created_at", { ascending: false })
            .limit(4);

        let relatedProducts = related || [];

        // Fallback to newest products if not enough in same category
        if (relatedProducts.length < 4) {
            const excludeIds = [id, ...relatedProducts.map((p) => p.id)];
            const { data: extras } = await supabaseService
                .from("products")
                .select(`
                    id, name, price, main_image,
                    categories(name)
                `)
                .not("id", "in", `(${excludeIds.join(",")})`)
                .order("created_at", { ascending: false })
                .limit(4 - relatedProducts.length);

            relatedProducts = [...relatedProducts, ...(extras || [])];
        }

        return NextResponse.json({
            success: true,
            product,
            galleryImages: (galleryImages || []).map(r => r.image_url).filter(Boolean),
            relatedProducts
        });
    } catch (error) {
        console.error("Product Detail API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("products")
            .update(body)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Update Product Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, product: data });
    } catch (error) {
        console.error("Product PATCH Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const supabaseService = getServiceClient();

        // Optional: First delete from product_images table if needed (or cascade might handle it)
        await supabaseService.from("product_images").delete().eq("product_id", id);

        const { error } = await supabaseService
            .from("products")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete Product Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("Product DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
