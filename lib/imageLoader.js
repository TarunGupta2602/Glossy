/**
 * Supabase Image Loader
 * Bypasses Next.js optimization server to avoid "Private IP" errors
 * and uses Supabase's built-in image transformation service.
 */
export default function supabaseLoader({ src, width, quality }) {
    if (!src) return "";

    // Only process Supabase storage URLs
    if (src.includes("wsrbnmovzebjxvsacgvb.supabase.co")) {
        try {
            // Convert standard storage URL to render/transformation URL
            // Original: .../storage/v1/object/public/product-images/path/to/img.jpg
            // Target:   .../storage/v1/render/image/public/product-images/path/to/img.jpg
            const url = src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");

            const params = new URLSearchParams();
            if (width) params.set("width", width.toString());
            if (quality) params.set("quality", (quality || 75).toString());
            // Optional: Add resize mode
            params.set("resize", "contain");

            return `${url}?${params.toString()}`;
        } catch (e) {
            return src;
        }
    }

    return src;
}
