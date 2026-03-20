import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function GET() {
    try {
        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Fetch Categories Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, categories: data });
    } catch (error) {
        console.error("Categories API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("categories")
            .insert([body])
            .select()
            .single();

        if (error) {
            console.error("Create Category Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, category: data });
    } catch (error) {
        console.error("Category POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
