import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(req) {
    try {
        const ip = clientIp(req);
        const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
        if (!limited.ok) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const supabaseService = getServiceClient();

        const { error } = await supabaseService.from("contacts").insert([
            { name, email, message },
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
