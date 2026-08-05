import { supabase } from "@/lib/supabaseClient";

export async function getAccessToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
}

/** Authenticated fetch for admin write operations and protected admin reads. */
export async function adminFetch(input, init = {}) {
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
