import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

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

/** Returns true if the authenticated user has admin role. */
export async function isAdminUser(userId) {
    const service = getServiceClient();
    const { data: profile } = await service
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();
    return profile?.role === "admin";
}
