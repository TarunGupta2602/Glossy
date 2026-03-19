import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
        }

        const supabaseService = createClient(supabaseUrl, serviceRoleKey);

        const { error } = await supabaseService.from("contacts").insert([
            { name, email, message }
        ]);

        if (error) {
            console.error("Contact Insertion Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
