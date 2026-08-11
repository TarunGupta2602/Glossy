import { getServiceClient } from "@/lib/supabaseServiceClient";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
    getBlogsByTagSlug,
    BLOG_PAGE_SIZE,
} from "@/lib/blogQueries";
import { getPaginatedCanonical, normalizeBlogSlug, formatPageTitle } from "@/lib/seo";
import { BRAND_URL, TWITTER_HANDLE } from "@/lib/constants";

export const revalidate = 300;

export async function generateMetadata({ params, searchParams }) {
    const { tag } = await params;
    const query = await searchParams;
    const page = parseInt(query?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const tagSlug = normalizeBlogSlug(tag);

    if (!tagSlug) {
        return { title: "Tag Not Found", robots: { index: false, follow: false } };
    }

    const supabase = getServiceClient();
    const { totalCount, tagLabel } = await getBlogsByTagSlug(supabase, tagSlug, {
        page: 1,
        pageSize: 1,
    });

    if (!totalCount) {
        return {
            title: "Tag Not Found",
            description: "No articles found for this topic.",
            robots: { index: false, follow: true },
        };
    }

    const label = tagLabel;
    const canonical = getPaginatedCanonical(`/blog/tag/${tagSlug}`, pageNum);
    const title = formatPageTitle(
        pageNum > 1
            ? `${label} Articles (Page ${pageNum})`
            : `${label} — Jewellery Tips & Guides`
    );

    return {
        title,
        description: `Browse ${totalCount} jewellery article${totalCount === 1 ? "" : "s"} about ${label} from The Luxe Jewels journal.`,
        alternates: { canonical },
        openGraph: {
            title: `${label} | The Luxe Jewels Blog`,
            description: `Articles and styling tips tagged ${label}.`,
            url: `${BRAND_URL}${canonical}`,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${label} | The Luxe Jewels Blog`,
            description: `Articles and styling tips tagged ${label}.`,
            images: ["/og-image.png"],
            creator: TWITTER_HANDLE,
        },
        robots: { index: true, follow: true, "max-image-preview": "large" },
    };
}

export default async function BlogTagPage({ params, searchParams }) {
    const { tag } = await params;
    const query = await searchParams;
    const page = parseInt(query?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect(`/blog/tag/${normalizeBlogSlug(tag)}?page=1`);

    const tagSlug = normalizeBlogSlug(tag);
    if (!tagSlug) notFound();

    const supabase = getServiceClient();
    const { blogs, totalCount, totalPages, page: safePage, tagLabel } =
        await getBlogsByTagSlug(supabase, tagSlug, {
            page,
            pageSize: BLOG_PAGE_SIZE,
        });

    if (!totalCount) notFound();

    if (page !== safePage) {
        redirect(
            safePage === 1
                ? `/blog/tag/${tagSlug}`
                : `/blog/tag/${tagSlug}?page=${safePage}`
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100/60 pb-8">
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50/30 py-14 md:py-20">
                <div className={`${SITE_CONTAINER} relative text-center`}>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#E91E63] mb-3">
                        Journal Tag
                    </p>
                    <h1
                        className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {tagLabel}
                    </h1>
                    <p className="mx-auto max-w-xl text-sm text-gray-500 font-medium">
                        {totalCount} article{totalCount === 1 ? "" : "s"} tagged with this topic.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/blog"
                            className="text-sm font-semibold text-[#E91E63] hover:underline"
                        >
                            ← Back to all articles
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`${SITE_CONTAINER} py-12 md:py-16`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            href={`/blog/${normalizeBlogSlug(blog.slug) || blog.slug}`}
                            className="group"
                        >
                            <article className="flex h-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
                                <div className="relative aspect-14/9 overflow-hidden bg-gray-100">
                                    {blog.image ? (
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : null}
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <time className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                        {formatDate(blog.date_posted)}
                                    </time>
                                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#E91E63] transition-colors">
                                        {blog.title}
                                    </h2>
                                    {blog.description && (
                                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                                            {blog.description}
                                        </p>
                                    )}
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {totalPages > 1 && (
                    <nav className="flex justify-center gap-3 mt-12" aria-label="Pagination">
                        {safePage > 1 && (
                            <Link
                                href={
                                    safePage - 1 === 1
                                        ? `/blog/tag/${tagSlug}`
                                        : `/blog/tag/${tagSlug}?page=${safePage - 1}`
                                }
                                className="rounded-full px-4 py-2 text-sm font-semibold text-[#E91E63] border border-pink-100 bg-white"
                            >
                                Prev
                            </Link>
                        )}
                        <span className="rounded-full px-4 py-2 text-sm font-semibold text-gray-500">
                            Page {safePage} of {totalPages}
                        </span>
                        {safePage < totalPages && (
                            <Link
                                href={`/blog/tag/${tagSlug}?page=${safePage + 1}`}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-[#E91E63] border border-pink-100 bg-white"
                            >
                                Next
                            </Link>
                        )}
                    </nav>
                )}
            </section>
        </div>
    );
}
