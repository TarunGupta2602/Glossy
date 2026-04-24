/**
 * Supabase Image Loader
 * Bypasses Next.js optimization server to avoid "Private IP" errors
 * and uses Supabase's built-in image transformation service.
 */
export default function supabaseLoader({ src, width, quality }) {
    if (!src) return "";

    // Return processed Supabase URL
    if (src.includes("wsrbnmovzebjxvsacgvb.supabase.co")) {
        try {
            const url = src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
            const params = new URLSearchParams();
            if (width) params.set("width", width.toString());
            if (quality) params.set("quality", (quality || 75).toString());
            params.set("resize", "contain");
            return `${url}?${params.toString()}`;
        } catch (e) {
            return src;
        }
    }

    // For local or other images, append width and quality as query params
    // to satisfy Next.js loader requirements (even if ignored by static server)
    try {
        const isAbsolute = src.startsWith('http') || src.startsWith('//');
        const url = isAbsolute ? new URL(src) : new URL(src, "http://n");

        if (width) url.searchParams.set("w", width.toString());
        if (quality) url.searchParams.set("q", (quality || 75).toString());

        return isAbsolute ? url.toString() : url.pathname + url.search;
    } catch (e) {
        return src;
    }
}
