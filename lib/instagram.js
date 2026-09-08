const GRAPH_API = "https://graph.instagram.com";

export const INSTAGRAM_FALLBACK_IMAGES = [
    "/iloveimg-resized/hero1.jpg",
    "/iloveimg-resized/hero3.png",
    "/iloveimg-resized/hero4.png",
    "/iloveimg-resized/hero5.png",
];

/**
 * Curated reels from @theluxejewels.in_ — used when Graph API token is absent.
 * Swap or reorder anytime; ids match Instagram reel shortcodes.
 */
export const FEATURED_INSTAGRAM_REELS = [
    {
        id: "DanbeENzKl1",
        permalink: "https://www.instagram.com/reel/DanbeENzKl1/",
    },
    {
        id: "Dam5Bi5zXEW",
        permalink: "https://www.instagram.com/reel/Dam5Bi5zXEW/",
    },
    {
        id: "DakTDpnTumG",
        permalink: "https://www.instagram.com/reel/DakTDpnTumG/",
    },
    {
        id: "DakN37PzpUt",
        permalink: "https://www.instagram.com/reel/DakN37PzpUt/",
    },
    {
        id: "DaingbnTbC9",
        permalink: "https://www.instagram.com/reel/DaingbnTbC9/",
    },
    {
        id: "DXR42rFE9Hc",
        permalink: "https://www.instagram.com/reel/DXR42rFE9Hc/",
    },
];

/** Fetch recent Instagram media via Graph API. Requires INSTAGRAM_ACCESS_TOKEN in env. */
export async function fetchInstagramPosts(limit = 4) {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) return null;

    try {
        const res = await fetch(
            `${GRAPH_API}/me/media?fields=id,caption,media_url,permalink,thumbnail_url,media_type&limit=${limit}&access_token=${token}`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) return null;

        const data = await res.json();
        const posts = (data.data || [])
            .filter((item) => item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM")
            .slice(0, limit)
            .map((item) => ({
                id: item.id,
                imageUrl: item.media_url || item.thumbnail_url,
                permalink: item.permalink,
                caption: item.caption || "",
            }))
            .filter((item) => item.imageUrl);

        return posts.length ? posts : null;
    } catch {
        return null;
    }
}

/** Fetch recent Instagram VIDEO / Reels via Graph API. Falls back to curated list. */
export async function fetchInstagramReels(limit = 6) {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) {
        return FEATURED_INSTAGRAM_REELS.slice(0, limit);
    }

    try {
        const res = await fetch(
            `${GRAPH_API}/me/media?fields=id,caption,media_url,permalink,thumbnail_url,media_type&limit=${Math.max(limit * 3, 12)}&access_token=${token}`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) return FEATURED_INSTAGRAM_REELS.slice(0, limit);

        const data = await res.json();
        const reels = (data.data || [])
            .filter((item) => item.media_type === "VIDEO")
            .slice(0, limit)
            .map((item) => ({
                id: item.id,
                permalink: item.permalink,
                thumbnailUrl: item.thumbnail_url || null,
                mediaUrl: item.media_url || null,
                caption: item.caption || "",
            }))
            .filter((item) => item.permalink);

        return reels.length ? reels : FEATURED_INSTAGRAM_REELS.slice(0, limit);
    } catch {
        return FEATURED_INSTAGRAM_REELS.slice(0, limit);
    }
}
