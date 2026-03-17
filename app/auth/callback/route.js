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

        if (session?.user) {
            const user = session.user;
            console.log("Session User found:", user.id, user.email);

            // Directly upsert user info
            const { error: upsertError } = await supabase.from("users").upsert({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name,
                avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            }, {
                onConflict: 'id'
            });

            if (upsertError) {
                console.error("User Upsert Error:", upsertError.message);
                console.error("Details:", upsertError.details, upsertError.hint);
            } else {
                console.log("User successfully saved/updated in database.");
            }
        } else {
            console.warn("No user found in session after exchange.");
        }
    }

    return NextResponse.redirect(new URL("/", request.url));
}
