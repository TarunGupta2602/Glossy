import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

/**
 * Verify Bearer JWT and admin role for mutating API routes.
 * Admin client must send: Authorization: Bearer <access_token>
 */
export async function requireAdmin(req) {
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

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return {
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    const service = getServiceClient();
    const { data: profile, error: profileError } = await service
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || profile?.role !== "admin") {
        return {
            error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    return { user, profile };
}

/** Call at the top of protected handlers; returns NextResponse or null. */
export async function guardAdmin(req) {
    const result = await requireAdmin(req);
    return result.error ?? null;
}
