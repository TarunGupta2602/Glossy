import { getServiceClient } from "@/lib/supabaseServiceClient";
import { BRAND_URL, BRAND_NAME } from "@/lib/constants";
import { normalizeBlogSlug, truncateMetaDescription } from "@/lib/seo";
import { listStaticBlogSummaries } from "@/lib/staticBlogPosts";

export const revalidate = 300;

function escapeXml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET() {
    const supabase = getServiceClient();
    const { data: blogs } = await supabase
        .from("blogs")
        .select("title, slug, description, meta_description, date_posted, updated_at, author, image")
        .order("date_posted", { ascending: false })
        .limit(50);

    const seen = new Set(
        (blogs || []).map((blog) => normalizeBlogSlug(blog.slug) || blog.slug)
    );
    const merged = [...(blogs || [])];
    for (const post of listStaticBlogSummaries()) {
        const slug = normalizeBlogSlug(post.slug) || post.slug;
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        merged.push({
            title: post.title,
            slug,
            description: post.description,
            date_posted: post.date_posted,
            author: post.author,
            image: post.image?.startsWith("http")
                ? post.image
                : `${BRAND_URL}${post.image || ""}`,
        });
    }
    merged.sort(
        (a, b) =>
            new Date(b.date_posted || 0).getTime() -
            new Date(a.date_posted || 0).getTime()
    );

    const items = merged
        .slice(0, 50)
        .map((blog) => {
            const slug = normalizeBlogSlug(blog.slug) || blog.slug;
            const link = `${BRAND_URL}/blog/${slug}`;
            const description = truncateMetaDescription(
                blog.meta_description || blog.description || ""
            );
            const pubDate = new Date(
                blog.date_posted || blog.updated_at || Date.now()
            ).toUTCString();

            return `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      ${blog.author ? `<author>${escapeXml(blog.author)}</author>` : ""}
      ${blog.image ? `<enclosure url="${escapeXml(blog.image)}" type="image/jpeg" />` : ""}
    </item>`;
        })
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BRAND_NAME)} Blog</title>
    <link>${BRAND_URL}/blog</link>
    <atom:link href="${BRAND_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Jewellery tips, styling guides, and care advice from ${escapeXml(BRAND_NAME)}.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
    });
}
