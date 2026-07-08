import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { buildProductSeo, generateProductSlug } from "@/lib/seo";

async function enrichProductPayload(body, supabase, existingProduct = null) {
    const payload = { ...body };

    let categoryName = existingProduct?.categories?.name;
    if (payload.category_id && !categoryName) {
        const { data: category } = await supabase
            .from("categories")
            .select("name")
            .eq("id", payload.category_id)
            .single();
        categoryName = category?.name;
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

        if (!payload.slug?.trim()) {
            payload.slug = generateProductSlug(
                name,
                existingProduct?.id || payload.id
            );
        }
    }

    return payload;
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("category_id");
        const slug = searchParams.get("slug");
        const q = searchParams.get("q");

        const supabaseService = getServiceClient();

        let query = supabaseService
            .from("products")
            .select(`
                *,
                categories (
                    name,
                    id,
                    slug
                )
            `);

        if (categoryId) {
            query = query.eq("category_id", categoryId);
        } else if (slug) {
            const { data: category } = await supabaseService
                .from("categories")
                .select("id")
                .eq("slug", slug)
                .single();

            if (category) {
                query = query.eq("category_id", category.id);
            } else {
                return NextResponse.json({ success: true, products: [] });
            }
        }

        if (q) {
            query = query.ilike("name", `%${q}%`);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            console.error("Fetch Products Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, products: data });
    } catch (error) {
        console.error("Products API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const supabaseService = getServiceClient();

        let payload = await enrichProductPayload(body, supabaseService);

        let { data, error } = await supabaseService
            .from("products")
            .insert([payload])
            .select("*, categories(name, id, slug)")
            .single();

        // Retry without slug if column doesn't exist yet
        if (error?.message?.includes("slug")) {
            const { slug, ...withoutSlug } = payload;
            ({ data, error } = await supabaseService
                .from("products")
                .insert([withoutSlug])
                .select("*, categories(name, id, slug)")
                .single());
        }

        if (error) {
            console.error("Create Product Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Backfill slug after insert when column exists
        if (!data.slug && data.name) {
            const slug = generateProductSlug(data.name, data.id);
            const { data: updated } = await supabaseService
                .from("products")
                .update({ slug })
                .eq("id", data.id)
                .select("*, categories(name, id, slug)")
                .single();
            if (updated) data = updated;
        }

        return NextResponse.json({ success: true, product: data });
    } catch (error) {
        console.error("Product POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
