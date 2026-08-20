import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireAuth";
import { ensureUserProfile } from "@/lib/userProfile";

export async function GET(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const profile = await ensureUserProfile(auth.user);

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
