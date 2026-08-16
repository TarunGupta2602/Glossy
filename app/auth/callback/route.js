import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") || "/";
    const origin = new URL(request.url).origin;

    if (!code) {
        return NextResponse.redirect(new URL("/?error=auth_missing_code", origin));
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        return NextResponse.redirect(new URL("/?error=auth_misconfigured", origin));
    }

    let response = NextResponse.redirect(new URL(next, origin));

    const supabase = createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value);
                });
                response = NextResponse.redirect(new URL(next, origin));
                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
        console.error("Auth Exchange Error:", exchangeError.message);
        return NextResponse.redirect(
            new URL("/?error=auth_exchange_failed", origin)
        );
    }

    return response;
}
