import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

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

        return NextResponse.json({ success: true, category: data });
    } catch (error) {
        console.error("Category PATCH Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
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
