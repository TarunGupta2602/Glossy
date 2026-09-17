import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { guardAdmin } from "@/lib/requireAdmin";
import { revalidatePath } from "next/cache";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("categories")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, category: data });
    } catch (error) {
        console.error("Category API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const { id } = await params;
        const body = await req.json();
        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("categories")
            .update(body)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Update Category Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        try {
            revalidatePath("/shop");
            revalidatePath("/earrings");
            revalidatePath("/necklaces");
            revalidatePath("/bracelets");
            revalidatePath("/rings");
            revalidatePath("/collection");
            revalidatePath("/sitemap.xml");
            if (data?.slug) {
                const clean = String(data.slug).replace(/^-+/, "");
                if (clean) revalidatePath(`/shop/${clean}`);
            }
        } catch (revalidateError) {
            console.error("category revalidate:", revalidateError);
        }

        return NextResponse.json({ success: true, category: data });
    } catch (error) {
        console.error("Category PATCH Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const { id } = await params;
        const supabaseService = getServiceClient();

        const { error } = await supabaseService
            .from("categories")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete Category Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.error("Category DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
