import { getServiceClient } from "@/lib/supabaseServiceClient";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BLOG_PAGE_SIZE, getBlogPageCount } from "@/lib/blogQueries";
import { getPaginatedCanonical } from "@/lib/seo";
import { BRAND_URL, TWITTER_HANDLE } from "@/lib/constants";
import { normalizeBlogSlug } from "@/lib/seo";
import { listStaticBlogSummaries } from "@/lib/staticBlogPosts";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const canonical = getPaginatedCanonical("/blog", pageNum);
    const isPaginated = pageNum > 1;

    const title = isPaginated
        ? `Jewellery Tips & Trends — Page ${pageNum}`
        : "Jewellery Care, Styling Guides & Trends | The Luxe Journal";
    const description = isPaginated
        ? `Page ${pageNum} of The Luxe Jewels journal — anti-tarnish jewellery care, styling ideas, and gift guides for everyday luxury in India.`
        : "Read The Luxe Jewels journal for anti-tarnish jewellery care, 18k gold plated buying guides, festive gift ideas, and styling tips for earrings, necklaces, and bracelets in India.";

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        robots: isPaginated
            ? { index: false, follow: true }
            : {
                  index: true,
                  follow: true,
                  "max-image-preview": "large",
                  "max-snippet": -1,
              },
        openGraph: {
            title: isPaginated
                ? `Journal — Page ${pageNum} | The Luxe Jewels`
                : "The Luxe Journal | Jewellery Care, Styling & Gift Guides",
            description,
            url: `${BRAND_URL}${canonical}`,
            type: "website",
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "The Luxe Jewels Blog",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isPaginated
                ? `Journal — Page ${pageNum} | The Luxe Jewels`
                : "The Luxe Journal | Jewellery Care & Styling Guides",
            description,
            images: ["/og-image.png"],
            creator: TWITTER_HANDLE,
        },
    };
}

export default async function BlogPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/blog?page=1");

    const { count } = await supabase
        .from("blogs")
        .select("id", { count: "exact", head: true });

    const staticSummaries = listStaticBlogSummaries();
    const dbCount = count || 0;
    const totalCount = dbCount + staticSummaries.length;

    const from = (page - 1) * BLOG_PAGE_SIZE;
    const to = from + BLOG_PAGE_SIZE - 1;

    // Merge static growth posts at the front of the journal feed
    const merged = [...staticSummaries];
    const staticSlugs = new Set(staticSummaries.map((p) => p.slug));

    const { data: dbBlogs } = await supabase
        .from("blogs")
        .select("id, title, slug, description, image, author, date_posted")
        .order("date_posted", { ascending: false })
        .limit(200);

    for (const blog of dbBlogs || []) {
        const slug = normalizeBlogSlug(blog.slug) || blog.slug;
        if (staticSlugs.has(slug)) continue;
        merged.push({ ...blog, slug });
    }

    merged.sort(
        (a, b) => new Date(b.date_posted || 0).getTime() - new Date(a.date_posted || 0).getTime()
    );

    const blogs = merged.slice(from, to + 1);
    const totalPages = getBlogPageCount(totalCount);

    if (page > totalPages && totalCount > 0) {
        redirect(totalPages === 1 ? "/blog" : `/blog?page=${totalPages}`);
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "The Luxe Jewels Journal",
        description:
            "Guides on anti-tarnish jewellery care, 18k gold plated buying advice, festive gifting, and styling for earrings, necklaces, and bracelets in India.",
        url: `${BRAND_URL}/blog`,
        isPartOf: {
            "@type": "WebSite",
            name: "The Luxe Jewels",
            url: BRAND_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            name: "Latest jewellery guides",
            numberOfItems: totalCount || 0,
            itemListElement: (blogs || []).map((blog, index) => ({
                "@type": "ListItem",
                position: from + index + 1,
                url: `${BRAND_URL}/blog/${normalizeBlogSlug(blog.slug) || blog.slug}`,
                name: blog.title,
            })),
        },
    };

    function Pagination() {
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
                pageNumbers.push(i);
            } else if (
                (i === page - 2 && page > 3) ||
                (i === page + 2 && page < totalPages - 2)
            ) {
                pageNumbers.push("...");
            }
        }
        const filtered = pageNumbers.filter(
            (n, i, arr) => n !== "..." || arr[i - 1] !== "..."
        );
        return (
            <nav className="flex justify-center mt-12" aria-label="Pagination">
                <ul className="inline-flex items-center gap-1 bg-white/80 rounded-full px-4 py-2 shadow border border-gray-100">
                    <li>
                        <Link
                            href={page - 1 <= 1 ? "/blog" : `/blog?page=${page - 1}`}
                            aria-disabled={page === 1}
                            tabIndex={page === 1 ? -1 : 0}
                            className={`min-h-11 inline-flex items-center rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${page === 1 ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-[#E91E63] hover:bg-pink-50"}`}
                        >
                            Prev
                        </Link>
                    </li>
                    {filtered.map((n, idx) =>
                        n === "..." ? (
                            <li key={"ellipsis-" + idx} className="px-2 text-gray-400">
                                …
                            </li>
                        ) : (
                            <li key={n}>
                                <Link
                                    href={n === 1 ? "/blog" : `/blog?page=${n}`}
                                    aria-current={n === page ? "page" : undefined}
                                    className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${n === page ? "bg-[#E91E63] text-white shadow" : "text-[#E91E63] hover:bg-pink-50"}`}
                                >
                                    {n}
                                </Link>
                            </li>
                        )
                    )}
                    <li>
                        <Link
                            href={`/blog?page=${page + 1}`}
                            aria-disabled={page === totalPages}
                            tabIndex={page === totalPages ? -1 : 0}
                            className={`min-h-11 inline-flex items-center rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${page === totalPages ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-[#E91E63] hover:bg-pink-50"}`}
                        >
                            Next
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100/60 pb-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />

            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50/30 py-16 md:py-24">
                <div className="absolute inset-x-0 top-0 h-44 bg-[#FCE4EC] opacity-80 blur-3xl"></div>
                <div className={`${SITE_CONTAINER} relative text-center`}>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#E91E63] mb-3">
                        The Luxe Journal
                    </p>
                    <h1
                        className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight drop-shadow-sm"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Jewellery care, styling guides &amp; gift ideas for India
                    </h1>
                    <p className="mx-auto max-w-2xl text-sm md:text-base text-gray-500 font-medium leading-7">
                        Practical articles on anti-tarnish and waterproof jewellery — how to
                        clean gold plated pieces, what 18k plating really means, festive gift
                        picks for Raksha Bandhan and Friendship Day, and everyday styling for
                        earrings, necklaces, and bracelets.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#E91E63]">
                        <Link href="/earrings" className="underline-offset-4 hover:underline">
                            Shop earrings
                        </Link>
                        <span className="text-gray-300">·</span>
                        <Link href="/necklaces" className="underline-offset-4 hover:underline">
                            Shop necklaces
                        </Link>
                        <span className="text-gray-300">·</span>
                        <Link href="/shop" className="underline-offset-4 hover:underline">
                            Shop all jewellery
                        </Link>
                    </div>
                    <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 sm:gap-4">
                        <span className="rounded-full border border-pink-100 bg-white/80 px-4 py-2 font-semibold text-[#c2185b] shadow-sm">
                            {totalCount || 0} articles
                        </span>
                        <span className="rounded-full border border-gray-100 bg-white/80 px-4 py-2 font-medium">
                            {totalPages} page{totalPages === 1 ? "" : "s"}
                        </span>
                        <Link
                            href="/feed.xml"
                            className="rounded-full border border-gray-100 bg-white/80 px-4 py-2 font-medium hover:border-pink-200 hover:text-[#E91E63] transition-colors"
                        >
                            RSS feed
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`${SITE_CONTAINER} py-12 md:py-20`}>
                {!blogs || blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Coming soon!</p>
                        <p className="text-gray-400 text-sm mt-1">
                            We&apos;re working on some amazing content for you.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {blogs.map((blog, index) => {
                                const href = `/blog/${normalizeBlogSlug(blog.slug) || blog.slug}`;
                                return (
                                    <Link href={href} key={blog.id} className="group">
                                        <article className="flex h-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
                                            <div className="relative aspect-14/9 overflow-hidden bg-gray-100">
                                                {blog.image ? (
                                                    <Image
                                                        src={blog.image}
                                                        alt={blog.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        quality={75}
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        priority={index < 3}
                                                        placeholder="blur"
                                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABH/2Q=="
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-12 w-12 text-gray-300"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col p-6">
                                                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E63]">
                                                    <span className="rounded-full bg-pink-50 px-3 py-1 text-[#C2185B] border border-pink-100">
                                                        {blog.author}
                                                    </span>
                                                    <time className="text-gray-400">
                                                        {formatDate(blog.date_posted)}
                                                    </time>
                                                </div>

                                                <h2 className="min-h-20 text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#E91E63] tracking-tight">
                                                    {blog.title}
                                                </h2>

                                                {blog.description && (
                                                    <p className="mt-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                                                        {blog.description}
                                                    </p>
                                                )}

                                                <div className="mt-auto pt-6">
                                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E91E63]">
                                                        Read Article
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                        <Pagination />
                    </>
                )}
            </section>
        </div>
    );
}
