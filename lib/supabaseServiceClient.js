import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client with the service role key.
 * This bypasses RLS and should ONLY be used on the server (API routes, Server Components).
 */
export function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Missing Supabase URL or Service Role Key in environment variables.");
    }

    return createClient(url, key);
}
