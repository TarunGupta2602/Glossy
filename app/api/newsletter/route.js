import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

        const { error } = await supabaseService
            .from("newsletter_subscribers")
            .insert([{ email }]);

        if (error) {
            if (error.code === "23505") { // Duplicate email
                return NextResponse.json({ success: false, error: "Already subscribed" }, { status: 400 });
            }
            console.error("Newsletter Subscription Error:", error);
            return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
        console.error("Newsletter POST Error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
