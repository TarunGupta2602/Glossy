import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser } from "@/lib/requireAuth";

export async function GET(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("users")
            .select("id, email, full_name, avatar_url, role, phone, created_at")
            .eq("id", auth.user.id)
            .single();

        if (error) {
            console.error("Profile Fetch Error:", error);
            if (error.code === "PGRST116") {
                return NextResponse.json({ success: true, profile: null });
            }
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, profile: data });
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
