import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

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
            // First get category ID by slug if slug is provided
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

        const { data, error } = await supabaseService
            .from("products")
            .insert([body])
            .select()
            .single();

        if (error) {
            console.error("Create Product Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, product: data });
    } catch (error) {
        console.error("Product POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
