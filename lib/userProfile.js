import { getServiceClient } from "@/lib/supabaseServiceClient";
import { SUPPORT_EMAIL } from "@/lib/constants";

// Matches public.users schema: email, name, avatar, role, created_at
const PROFILE_COLUMNS = "id, email, name, avatar, role, created_at";

function adminEmailList() {
    const fromEnv = String(process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    const defaults = [String(SUPPORT_EMAIL || "").toLowerCase()].filter(Boolean);
    return [...new Set([...fromEnv, ...defaults])];
}

export function isAdminEmail(email) {
    if (!email) return false;
    return adminEmailList().includes(String(email).toLowerCase());
}

/**
 * Load or create the public.users row for an authenticated Supabase Auth user.
 * Re-links orphaned rows that match by email but have a different id.
 */
export async function ensureUserProfile(authUser) {
    if (!authUser?.id) return null;

    const service = getServiceClient();
    const email = authUser.email ? String(authUser.email).toLowerCase() : null;
    const displayName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        null;

    const { data: byId, error: byIdError } = await service
        .from("users")
        .select(PROFILE_COLUMNS)
        .eq("id", authUser.id)
        .maybeSingle();

    if (byIdError && byIdError.code !== "PGRST116") {
        throw byIdError;
    }

    if (byId) {
        // Promote to admin if listed in ADMIN_EMAILS (optional override)
        if (byId.role !== "admin" && isAdminEmail(byId.email || email)) {
            const { data: promoted, error: promoteError } = await service
                .from("users")
                .update({ role: "admin" })
                .eq("id", byId.id)
                .select(PROFILE_COLUMNS)
                .single();
            if (promoteError) throw promoteError;
            return promoted;
        }
        return byId;
    }

    // Orphaned profile: same email, different auth id (common after re-create)
    if (email) {
        const { data: byEmail, error: byEmailError } = await service
            .from("users")
            .select(PROFILE_COLUMNS)
            .ilike("email", email)
            .maybeSingle();

        if (byEmailError && byEmailError.code !== "PGRST116") {
            throw byEmailError;
        }

        if (byEmail) {
            const role =
                byEmail.role === "admin" || isAdminEmail(email)
                    ? "admin"
                    : byEmail.role || "user";

            await service.from("users").delete().eq("id", byEmail.id);

            const { data: relinked, error: relinkError } = await service
                .from("users")
                .insert({
                    id: authUser.id,
                    email: authUser.email,
                    name: byEmail.name || displayName,
                    avatar: byEmail.avatar || null,
                    role,
                })
                .select(PROFILE_COLUMNS)
                .single();

            if (relinkError) throw relinkError;
            return relinked;
        }
    }

    const role = isAdminEmail(email) ? "admin" : "user";

    const { data: created, error: createError } = await service
        .from("users")
        .insert({
            id: authUser.id,
            email: authUser.email,
            name: displayName,
            role,
        })
        .select(PROFILE_COLUMNS)
        .single();

    if (createError) throw createError;
    return created;
}

export async function isAdminUser(userId, email) {
    if (!userId && !email) return false;

    const service = getServiceClient();

    if (userId) {
        const { data } = await service
            .from("users")
            .select("role, email")
            .eq("id", userId)
            .maybeSingle();
        if (data?.role === "admin") return true;
        if (isAdminEmail(data?.email || email)) return true;
    }

    if (email && isAdminEmail(email)) return true;

    return false;
}
