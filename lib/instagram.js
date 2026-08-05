const GRAPH_API = "https://graph.instagram.com";

export const INSTAGRAM_FALLBACK_IMAGES = [
    "/iloveimg-resized/hero1.jpg",
    "/iloveimg-resized/hero3.png",
    "/iloveimg-resized/hero4.png",
    "/iloveimg-resized/hero5.png",
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
