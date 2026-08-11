import { normalizeBlogSlug } from "@/lib/seo";

/** Blog listing page size — keep in sync with app/blog/page.js */
export const BLOG_PAGE_SIZE = 6;

export function getBlogPageCount(totalPosts) {
    return Math.max(1, Math.ceil((totalPosts || 0) / BLOG_PAGE_SIZE));
}

export function parseBlogKeywords(metaKeywords) {
    if (!metaKeywords) return [];
    return String(metaKeywords)
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
}

export function keywordToTagSlug(keyword) {
    return normalizeBlogSlug(keyword);
}

/** Find a blog by exact or normalized slug (handles legacy leading/trailing hyphens). */
export async function findBlogBySlug(supabase, slug, select = "*") {
    const requested = String(slug || "");
    const normalized = normalizeBlogSlug(requested);

    const { data: exact } = await supabase
        .from("blogs")
        .select(select)
        .eq("slug", requested)
        .maybeSingle();

    if (exact) {
        return { blog: exact, requested, canonicalSlug: normalizeBlogSlug(exact.slug) || exact.slug };
    }

    if (normalized && normalized !== requested) {
        const { data: byNormalized } = await supabase
            .from("blogs")
            .select(select)
            .eq("slug", normalized)
            .maybeSingle();

        if (byNormalized) {
            return {
                blog: byNormalized,
                requested,
                canonicalSlug: normalizeBlogSlug(byNormalized.slug) || byNormalized.slug,
            };
        }
    }

    const { data: candidates } = await supabase
        .from("blogs")
        .select(select)
        .order("date_posted", { ascending: false })
        .limit(200);

    const match = (candidates || []).find(
        (row) => normalizeBlogSlug(row.slug) === normalized
    );

    if (!match) return { blog: null, requested, canonicalSlug: normalized };

    return {
        blog: match,
        requested,
        canonicalSlug: normalizeBlogSlug(match.slug) || match.slug,
    };
}

/**
 * Prefer posts that share meta_keywords; fall back to latest posts.
 */
export async function getRelatedBlogPosts(supabase, blog, limit = 3) {
    const currentKeywords = parseBlogKeywords(blog.meta_keywords).map((k) =>
        k.toLowerCase()
    );

    const { data: candidates } = await supabase
        .from("blogs")
        .select("id, title, slug, image, date_posted, author, meta_keywords")
        .neq("id", blog.id)
        .order("date_posted", { ascending: false })
        .limit(30);

    const list = candidates || [];
    if (!list.length) return [];

    if (!currentKeywords.length) {
        return list.slice(0, limit);
    }

    const scored = list
        .map((post) => {
            const postKeywords = parseBlogKeywords(post.meta_keywords).map((k) =>
                k.toLowerCase()
            );
            const overlap = postKeywords.filter((k) => currentKeywords.includes(k)).length;
            const titleHits = currentKeywords.filter((k) =>
                (post.title || "").toLowerCase().includes(k)
            ).length;
            return { post, score: overlap * 3 + titleHits };
        })
        .sort((a, b) => b.score - a.score || 0);

    const topical = scored.filter((s) => s.score > 0).map((s) => s.post);
    if (topical.length >= limit) return topical.slice(0, limit);

    const used = new Set(topical.map((p) => p.id));
    const fillers = list.filter((p) => !used.has(p.id));
    return [...topical, ...fillers].slice(0, limit);
}

/** Blogs matching a tag slug derived from meta_keywords. */
export async function getBlogsByTagSlug(supabase, tagSlug, { page = 1, pageSize = BLOG_PAGE_SIZE } = {}) {
    const normalizedTag = normalizeBlogSlug(tagSlug);
    const { data: blogs } = await supabase
        .from("blogs")
        .select("id, title, slug, description, image, author, date_posted, meta_keywords")
        .order("date_posted", { ascending: false });

    const matched = (blogs || []).filter((blog) =>
        parseBlogKeywords(blog.meta_keywords).some(
            (keyword) => keywordToTagSlug(keyword) === normalizedTag
        )
    );

    const totalCount = matched.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const from = (safePage - 1) * pageSize;
    const pageItems = matched.slice(from, from + pageSize);

    const label =
        parseBlogKeywords(matched[0]?.meta_keywords).find(
            (keyword) => keywordToTagSlug(keyword) === normalizedTag
        ) || normalizedTag.replace(/-/g, " ");

    return {
        blogs: pageItems,
        totalCount,
        totalPages,
        page: safePage,
        tagLabel: label,
        tagSlug: normalizedTag,
    };
}
