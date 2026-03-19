import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("category_id");
        const slug = searchParams.get("slug");
        const q = searchParams.get("q");

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
        }

        const supabaseService = createClient(supabaseUrl, serviceRoleKey);

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
