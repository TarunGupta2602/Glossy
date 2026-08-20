import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/userProfile";

export { isAdminUser };

/**
 * Verify Bearer JWT and return the authenticated user.
 * Client must send: Authorization: Bearer <access_token>
 */
export async function requireUser(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return {
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return {
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        return {
            error: NextResponse.json({ error: "Server misconfigured" }, { status: 500 }),
        };
    }

    const supabase = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return {
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    return { user, token };
}

/**
 * Verify Bearer JWT and admin role for mutating API routes.
 */
export async function requireAdmin(req) {
    const auth = await requireUser(req);
    if (auth.error) return auth;

    const ok = await isAdminUser(auth.user.id, auth.user.email);
    if (!ok) {
        return {
            error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    return { user: auth.user, token: auth.token };
}

/** Call at the top of protected handlers; returns NextResponse or null. */
export async function guardAdmin(req) {
    const result = await requireAdmin(req);
    return result.error ?? null;
}
