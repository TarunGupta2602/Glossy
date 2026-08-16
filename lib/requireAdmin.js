import { NextResponse } from "next/server";
import { requireUser, isAdminUser } from "@/lib/requireAuth";

/**
 * Verify Bearer JWT and admin role for mutating API routes.
 * Admin client must send: Authorization: Bearer <access_token>
 */
export async function requireAdmin(req) {
    const auth = await requireUser(req);
    if (auth.error) return auth;

    const ok = await isAdminUser(auth.user.id);
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
