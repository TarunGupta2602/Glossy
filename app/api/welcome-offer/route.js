import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser } from "@/lib/requireAuth";
import { resolveWelcomeDiscount } from "@/lib/checkoutTotals";
import { WELCOME_CODE, WELCOME_PERCENT } from "@/lib/welcomeOffer";

export async function POST(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const body = await req.json().catch(() => ({}));
        const supabase = getServiceClient();
        const result = await resolveWelcomeDiscount(supabase, auth.user.id, body.code, 0);

        if (result.error) {
            return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            ok: true,
            code: WELCOME_CODE,
            percent: WELCOME_PERCENT,
        });
    } catch (error) {
        console.error("Welcome offer error:", error);
        return NextResponse.json({ ok: false, error: "Could not check the offer" }, { status: 500 });
    }
}
