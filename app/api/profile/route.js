import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Profile Fetch Error:", error);
            // Don't leak too much info, but confirm if it's "not found"
            if (error.code === 'PGRST116') {
                return NextResponse.json({ success: true, profile: null });
            }
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, profile: data });
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
