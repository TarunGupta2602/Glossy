import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function POST(req) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

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
