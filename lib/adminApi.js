import { supabase } from "@/lib/supabaseClient";

export async function getAccessToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) return session.access_token;

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;

    const refreshed = await supabase.auth.getSession();
    return refreshed.data.session?.access_token ?? null;
}

/**
 * Authenticated fetch for logged-in user operations (cart, wishlist, orders, reviews).
 * Sends Authorization: Bearer <access_token>.
 */
export async function authFetch(input, init = {}) {
    const token = await getAccessToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    const headers = new Headers(init.headers || {});
    headers.set("Authorization", `Bearer ${token}`);

    if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    return fetch(input, { ...init, headers });
}

/** Authenticated fetch for admin write operations and protected admin reads. */
export async function adminFetch(input, init = {}) {
    return authFetch(input, init);
}
