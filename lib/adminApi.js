import { supabase } from "@/lib/supabaseClient";

export async function getAccessToken() {
    for (let attempt = 0; attempt < 4; attempt += 1) {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) return session.access_token;

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            const refreshed = await supabase.auth.getSession();
            if (refreshed.data.session?.access_token) {
                return refreshed.data.session.access_token;
            }
        }

        await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
    }

    return null;
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

/** Parse an API response. A too-large upload comes back as plain text, which Safari cannot read as JSON. */
export async function readApiJson(res) {
    const text = await res.text();
    if (!text) {
        throw new Error(res.ok ? "Empty response from the server." : `Request failed (${res.status}).`);
    }
    try {
        return JSON.parse(text);
    } catch {
        if (res.status === 413 || /payload too large|entity too large/i.test(text)) {
            throw new Error(
                "This post or cover photo is too large. Use one cover image under a few MB, and don’t paste pictures inside the article."
            );
        }
        const snippet = text.replace(/\s+/g, " ").trim().slice(0, 160);
        throw new Error(snippet || `Request failed (${res.status}).`);
    }
}
