import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

/**
 * Returns a Supabase client with the service role key.
 * Singleton — reuse across requests in the same server process.
 * ONLY use on the server (API routes, Server Components).
 */
export function getServiceClient() {
    if (cachedClient) return cachedClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
        );
    }

    cachedClient = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    return cachedClient;
}
