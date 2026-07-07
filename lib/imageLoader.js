/**
 * Supabase Image Loader
 * Returns direct public storage URLs. Supabase image transformation
 * (/render/image/) requires a paid plan feature — use /object/public/ instead.
 */
export default function supabaseLoader({ src, width, quality }) {
    if (!src) return "";

    // Supabase public bucket URLs — serve directly without transformation
    if (src.includes("wsrbnmovzebjxvsacgvb.supabase.co")) {
        return src;
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
