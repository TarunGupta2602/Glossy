import { getServiceClient } from "@/lib/supabaseServiceClient";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { BLOG_PAGE_SIZE, getBlogPageCount } from "@/lib/blogQueries";
import { getPaginatedCanonical } from "@/lib/seo";
import { BRAND_URL, TWITTER_HANDLE } from "@/lib/constants";
import { normalizeBlogSlug } from "@/lib/seo";
import { listStaticBlogSummaries } from "@/lib/staticBlogPosts";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const canonical = getPaginatedCanonical("/blog", pageNum);
    const isPaginated = pageNum > 1;

    const title = isPaginated
        ? `Jewellery Tips & Gift Guides — Page ${pageNum}`
        : "Jewellery Tips, Gift Guides & Trends for India";
    const description = isPaginated
        ? `Page ${pageNum} of The Luxe Jewels journal — anti-tarnish care, 18k gold plated buying guides, and gift ideas for everyday India.`
        : "Anti-tarnish jewellery care, what 18k gold plated means, Friendship Day gift ideas, daily wear bracelets, and styling tips for earrings & necklaces in India.";

    // Paginated journal pages: noindex + canonicalize to hub so Google
    // doesn't keep /blog?page=2 in the index (still happening in GSC).
    const indexableCanonical = isPaginated ? "/blog" : canonical;

    return {
        title,
        description,
        alternates: {
            canonical: indexableCanonical,
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
            url: `${BRAND_URL}${indexableCanonical}`,
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
    const rawPage = params?.page;
    // Collapse page=0 / page=1 noise Google still shows in GSC
    if (rawPage === "0" || rawPage === "1") redirect("/blog");
    const page = parseInt(rawPage || "1", 10);
    if (isNaN(page) || page < 1) redirect("/blog");

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
            <nav className="flex justify-center mt-14 md:mt-16" aria-label="Pagination">
                <ul className="inline-flex items-center gap-1">
                    <li>
                        <Link
                            href={page - 1 <= 1 ? "/blog" : `/blog?page=${page - 1}`}
                            aria-disabled={page === 1}
                            tabIndex={page === 1 ? -1 : 0}
                            className={`min-h-11 inline-flex items-center px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${page === 1 ? "text-[#cfc9c2] pointer-events-none" : "text-[#6b6560] hover:text-[#E91E63]"}`}
                        >
                            Prev
                        </Link>
                    </li>
                    {filtered.map((n, idx) =>
                        n === "..." ? (
                            <li key={"ellipsis-" + idx} className="px-2 text-[#cfc9c2]">
                                …
                            </li>
                        ) : (
                            <li key={n}>
                                <Link
                                    href={n === 1 ? "/blog" : `/blog?page=${n}`}
                                    aria-current={n === page ? "page" : undefined}
                                    className={`min-h-11 min-w-11 inline-flex items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${n === page ? "bg-[#2a2724] text-white" : "text-[#6b6560] hover:text-[#E91E63]"}`}
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
                            className={`min-h-11 inline-flex items-center px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${page === totalPages ? "text-[#cfc9c2] pointer-events-none" : "text-[#6b6560] hover:text-[#E91E63]"}`}
                        >
                            Next
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />

            <section className="border-b border-[#efeae4] bg-[#fdfbf7]">
                <div className={`${HOME_CONTAINER} py-14 md:py-20 lg:py-24`}>
                    <div className="max-w-2xl">
                        <p
                            className="text-[11px] font-medium tracking-[0.22em] uppercase mb-4"
                            style={{ color: "#b89a6a" }}
                        >
                            The Luxe Journal
                        </p>
                        <h1 className="font-playfair text-[2.2rem] sm:text-[2.75rem] md:text-[3.25rem] font-medium text-[#2a2724] tracking-tight leading-[1.12] mb-4">
                            Care, styling &amp;{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                gift ideas
                            </em>
                        </h1>
                        <p className="text-[15px] sm:text-[16px] text-[#6b6560] leading-relaxed mb-7 max-w-xl">
                            Practical guides on anti-tarnish jewellery, 18k gold plating, festive
                            gifting, and everyday styling for earrings, necklaces, and bracelets.
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a847c]">
                            <Link href="/earrings" className="hover:text-[#E91E63] transition-colors">
                                Shop earrings
                            </Link>
                            <span className="text-[#d4cbc0]">·</span>
                            <Link href="/necklaces" className="hover:text-[#E91E63] transition-colors">
                                Shop necklaces
                            </Link>
                            <span className="text-[#d4cbc0]">·</span>
                            <Link href="/shop" className="hover:text-[#E91E63] transition-colors">
                                Shop all
                            </Link>
                            <span className="text-[#d4cbc0]">·</span>
                            <span>{totalCount || 0} articles</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${HOME_CONTAINER} py-12 md:py-16 lg:py-20`}>
                {!blogs || blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="font-playfair text-2xl text-[#2a2724] mb-2">Coming soon</p>
                        <p className="text-[14px] text-[#8a847c]">
                            We&apos;re working on fresh guides for you.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {blogs.map((blog, index) => {
                                const href = `/blog/${normalizeBlogSlug(blog.slug) || blog.slug}`;
                                return (
                                    <Link href={href} key={blog.id || href} className="group block">
                                        <article>
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#efeae4] mb-4">
                                                {blog.image ? (
                                                    <Image
                                                        src={blog.image}
                                                        alt={blog.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        quality={75}
                                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                                        priority={index < 3}
                                                        placeholder="blur"
                                                        blurDataURL={IMAGE_BLUR_DATA_URL}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[#f4f2f0]" />
                                                )}
                                            </div>

                                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#a89880] mb-2">
                                                <time dateTime={blog.date_posted}>
                                                    {formatDate(blog.date_posted)}
                                                </time>
                                                {blog.author ? ` · ${blog.author}` : ""}
                                            </p>

                                            <h2 className="font-playfair text-[1.35rem] md:text-[1.45rem] font-medium text-[#2a2724] tracking-tight leading-snug group-hover:text-[#E91E63] transition-colors">
                                                {blog.title}
                                            </h2>

                                            {blog.description ? (
                                                <p className="mt-2.5 text-[14px] text-[#6b6560] leading-relaxed line-clamp-2">
                                                    {blog.description}
                                                </p>
                                            ) : null}

                                            <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a847c] group-hover:text-[#E91E63] transition-colors">
                                                Read article
                                                <span aria-hidden>→</span>
                                            </span>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                        <Pagination />
                    </>
                )}
            </section>
        </main>
    );
}
