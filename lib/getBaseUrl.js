/**
 * Returns an absolute base URL that works both locally and on Vercel.
 * - On Vercel: uses VERCEL_URL (automatically set by Vercel)
 * - Locally:   falls back to http://localhost:3000
 *
 * Use this for server-side fetch() calls to your own API routes.
 */
export function getBaseUrl() {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
}
