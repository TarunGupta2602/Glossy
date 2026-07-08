import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { buildProductSeo, generateProductSlug, isUuid } from "@/lib/seo";

async function enrichProductPayload(body, supabase, existingProduct) {
    const payload = { ...body };

    let categoryName = existingProduct?.categories?.name;
    if (payload.category_id) {
        const { data: category } = await supabase
            .from("categories")
            .select("name")
            .eq("id", payload.category_id)
            .single();
        categoryName = category?.name || categoryName;
    }

    const name = payload.name || existingProduct?.name;
    const description = payload.description ?? existingProduct?.description;
    const price = payload.price ?? existingProduct?.price;

    if (name) {
        const autoSeo = buildProductSeo({
            name,
            description,
            categoryName,
            price,
            imageAlt: payload.image_alt || existingProduct?.image_alt,
        });

        if (!payload.meta_title?.trim()) payload.meta_title = autoSeo.meta_title;
        if (!payload.meta_description?.trim()) payload.meta_description = autoSeo.meta_description;
        if (!payload.meta_keywords?.trim()) payload.meta_keywords = autoSeo.meta_keywords;
        if (!payload.image_alt?.trim()) payload.image_alt = autoSeo.image_alt;

        if (!existingProduct?.slug && !payload.slug?.trim()) {
            payload.slug = generateProductSlug(name, existingProduct?.id);
        }
    }

    return payload;
}

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const supabaseService = getServiceClient();

        let query = supabaseService
            .from("products")
            .select(`*, categories(name, id, slug)`);

        query = isUuid(id) ? query.eq("id", id) : query.eq("slug", id);

        const { data: product, error: productError } = await query.single();

        if (productError || !product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const productId = product.id;

        const { data: galleryImages } = await supabaseService
            .from("product_images")
            .select("id, image_url")
            .eq("product_id", productId)
            .order("created_at", { ascending: true });

        const { data: related } = await supabaseService
            .from("products")
            .select(`id, name, price, main_image, image_alt, slug, categories(name)`)
            .eq("category_id", product.category_id)
            .neq("id", productId)
            .order("created_at", { ascending: false })
            .limit(4);

        let relatedProducts = related || [];

        if (relatedProducts.length < 4) {
            const excludeIds = [productId, ...relatedProducts.map((p) => p.id)];
            const { data: extras } = await supabaseService
                .from("products")
                .select(`id, name, price, main_image, image_alt, slug, categories(name)`)
                .not("id", "in", `(${excludeIds.join(",")})`)
                .order("created_at", { ascending: false })
                .limit(4 - relatedProducts.length);

            relatedProducts = [...relatedProducts, ...(extras || [])];
        }

        return NextResponse.json({
            success: true,
            product,
            galleryImages: (galleryImages || []).filter((img) => img.image_url),
            relatedProducts,
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

        const lookup = isUuid(id)
            ? supabaseService.from("products").select("*, categories(name, id, slug)").eq("id", id).single()
            : supabaseService.from("products").select("*, categories(name, id, slug)").eq("slug", id).single();

        const { data: existing } = await lookup;
        if (!existing) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        let payload = await enrichProductPayload(body, supabaseService, existing);

        let { data, error } = await supabaseService
            .from("products")
            .update(payload)
            .eq("id", existing.id)
            .select("*, categories(name, id, slug)")
            .single();

        if (error?.message?.includes("slug")) {
            const { slug, ...withoutSlug } = payload;
            ({ data, error } = await supabaseService
                .from("products")
                .update(withoutSlug)
                .eq("id", existing.id)
                .select("*, categories(name, id, slug)")
                .single());
        }

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

        const lookup = isUuid(id)
            ? supabaseService.from("products").select("id").eq("id", id).single()
            : supabaseService.from("products").select("id").eq("slug", id).single();

        const { data: existing } = await lookup;
        if (!existing) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await supabaseService.from("product_images").delete().eq("product_id", existing.id);

        const { error } = await supabaseService
            .from("products")
            .delete()
            .eq("id", existing.id);

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
