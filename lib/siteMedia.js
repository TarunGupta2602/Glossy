import { BRAND_URL } from "@/lib/constants";

const SUPABASE_HOST = "wsrbnmovzebjxvsacgvb.supabase.co";
const STORAGE_PREFIX = "/storage/v1/object/public/";

/**
 * Rewrite absolute Supabase storage URLs to same-origin `/media/...`
 * so browsers/crawlers hit theluxejewels.in (rewrite → storage) with less
 * cross-origin DNS overhead in HTML/schema. Next/Image already proxies via /_next/image.
 */
export function toSiteMediaUrl(url) {
    if (!url || typeof url !== "string") return url;
    if (url.startsWith("/")) return url;

    try {
        const parsed = new URL(url);
        if (parsed.hostname !== SUPABASE_HOST) return url;
        if (!parsed.pathname.startsWith(STORAGE_PREFIX)) return url;
        const storagePath = parsed.pathname.slice(STORAGE_PREFIX.length);
        return `/media/${storagePath}${parsed.search || ""}`;
    } catch {
        return url;
    }
}

export function toAbsoluteSiteMediaUrl(url) {
    const local = toSiteMediaUrl(url);
    if (!local) return `${BRAND_URL}/logo.png`;
    if (local.startsWith("http")) return local;
    return `${BRAND_URL}${local.startsWith("/") ? local : `/${local}`}`;
}
