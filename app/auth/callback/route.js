import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const origin = new URL(request.url).origin;
    const next = safeNext(searchParams.get("next") || request.cookies.get("auth_next")?.value);

    if (!code) {
        return NextResponse.redirect(new URL("/?error=auth_missing_code", origin));
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        return NextResponse.redirect(new URL("/?error=auth_misconfigured", origin));
    }

    let response = NextResponse.redirect(new URL(next, origin));
    response.cookies.set("auth_next", "", { path: "/", maxAge: 0 });

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
                response.cookies.set("auth_next", "", { path: "/", maxAge: 0 });
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

function safeNext(value) {
    if (!value) return "/";
    let decoded = value;
    try {
        decoded = decodeURIComponent(value);
    } catch {
        return "/";
    }
    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\")) return "/";
    return decoded;
}
