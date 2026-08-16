import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import {
    normalizeBlogSlug,
    formatPageTitle,
    truncateMetaDescription,
} from "@/lib/seo";

function uniqueSlug(desired, used) {
    let candidate = desired || "post";
    if (!used.has(candidate)) {
        used.add(candidate);
        return candidate;
    }
    let i = 2;
    while (used.has(`${candidate}-${i}`)) i += 1;
    const next = `${candidate}-${i}`;
    used.add(next);
    return next;
}

/** Convert markdown `# Heading` lines to `## Heading` (keep ## / ###). */
function demoteMarkdownH1(content) {
    if (!content) return { content: content || "", changed: false };
    const next = String(content).replace(/^# (?!#)/gm, "## ");
    return { content: next, changed: next !== content };
}

function countMarkdownH1(content) {
    return (String(content || "").match(/^# (?!#)/gm) || []).length;
}

/**
 * POST /api/blogs/normalize-slugs
 * Admin-only SEO cleanup:
 * - normalize slugs
 * - strip brand from meta_title
 * - word-boundary truncate meta_description to 160
 * - demote markdown H1 (#) to H2 (##)
 */
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const supabase = getServiceClient();
        const { data: blogs, error } = await supabase
            .from("blogs")
            .select("id, title, slug, meta_title, meta_description, description, content, meta_keywords")
            .order("date_posted", { ascending: true });

        if (error) throw error;

        const rows = blogs || [];
        const used = new Set();
        const updates = [];

        for (const blog of rows) {
            const base = normalizeBlogSlug(blog.slug || blog.title);
            const nextSlug = uniqueSlug(base, used);

            const nextMetaTitle = blog.meta_title
                ? formatPageTitle(blog.meta_title)
                : blog.meta_title;

            const rawDesc = (blog.meta_description || blog.description || "").trim();
            const nextMetaDescription = rawDesc
                ? truncateMetaDescription(rawDesc, 160)
                : blog.meta_description;

            const { content: nextContent, changed: contentChanged } = demoteMarkdownH1(
                blog.content
            );

            const slugChanged = nextSlug !== blog.slug;
            const metaTitleChanged =
                Boolean(blog.meta_title) && nextMetaTitle !== blog.meta_title;
            const metaDescChanged =
                Boolean(rawDesc) &&
                nextMetaDescription !== (blog.meta_description || "");
            // Only write meta_description if missing/overlong/different after truncate
            const shouldWriteMetaDesc =
                metaDescChanged ||
                (!blog.meta_description && rawDesc) ||
                (blog.meta_description && blog.meta_description.length > 160);

            const payload = {
                updated_at: new Date().toISOString(),
            };

            if (slugChanged) payload.slug = nextSlug;
            if (metaTitleChanged) payload.meta_title = nextMetaTitle;
            if (shouldWriteMetaDesc && nextMetaDescription) {
                payload.meta_description = nextMetaDescription;
            }
            if (contentChanged) payload.content = nextContent;

            const changedKeys = Object.keys(payload).filter((k) => k !== "updated_at");
            if (changedKeys.length > 0) {
                updates.push({
                    id: blog.id,
                    title: blog.title,
                    fromSlug: blog.slug,
                    toSlug: nextSlug,
                    fixes: {
                        slug: slugChanged,
                        metaTitle: metaTitleChanged,
                        metaDescription: Boolean(payload.meta_description),
                        headings: contentChanged,
                        h1Count: countMarkdownH1(blog.content),
                        missingKeywords: !String(blog.meta_keywords || "").trim(),
                    },
                    payload,
                });
            }
        }

        const changed = [];
        const failures = [];

        for (const item of updates) {
            const { error: updateError } = await supabase
                .from("blogs")
                .update(item.payload)
                .eq("id", item.id);

            if (updateError) {
                failures.push({
                    id: item.id,
                    title: item.title,
                    error: updateError.message,
                });
            } else {
                changed.push({
                    id: item.id,
                    title: item.title,
                    fromSlug: item.fromSlug,
                    toSlug: item.toSlug,
                    fixes: item.fixes,
                });
            }
        }

        const missingKeywords = rows.filter(
            (b) => !String(b.meta_keywords || "").trim()
        ).length;

        return NextResponse.json({
            success: true,
            scanned: rows.length,
            updated: changed.length,
            skipped: rows.length - updates.length,
            failed: failures.length,
            missingKeywords,
            changes: changed,
            failures,
        });
    } catch (error) {
        console.error("POST /api/blogs/normalize-slugs error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to normalize SEO fields" },
            { status: 500 }
        );
    }
}
