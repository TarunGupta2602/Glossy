import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        console.log("Exchanging code for session...");
        const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error("Auth Exchange Error:", exchangeError.message);
            return NextResponse.redirect(new URL("/?error=auth_exchange_failed", request.url));
        }
    }

    return NextResponse.redirect(new URL("/", request.url));
}
