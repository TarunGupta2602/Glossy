import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
        }

        const supabaseService = createClient(supabaseUrl, serviceRoleKey);

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
