import { getServiceClient } from "@/lib/supabaseServiceClient";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { marked } from "marked";
import { TWITTER_HANDLE, BRAND_URL } from "@/lib/constants";
import {
    formatPageTitle,
    truncateMetaDescription,
    normalizeBlogSlug,
    normalizeBlogImageSrc,
    absoluteBlogImageUrl,
} from "@/lib/seo";
import {
    findBlogBySlug,
    getRelatedBlogPosts,
    parseBlogKeywords,
    keywordToTagSlug,
} from "@/lib/blogQueries";
import { applyBlogSeoOverride } from "@/lib/blogSeoOverrides";
import { getBlogShopCta, isShopCatalogueHref } from "@/lib/blogShopCtas";
import { getBlogProductPicks } from "@/lib/blogProductPicks";
import { getReviewCounts } from "@/lib/reviewCounts";
import { resolveBlogAuthor } from "@/lib/blogAuthors";
import BlogShopCta from "../../components/BlogShopCta";
import BlogProductPicks from "../../components/BlogProductPicks";
import BlogContentSections from "../../components/BlogContentSections";
import { ShareButtons, MobileStickyCTA } from "./BlogInteraction";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import {
    looksLikeHtml,
    enhanceBlogHtml,
    ensureBlogInterlinks,
} from "@/lib/blogFormat";

export const revalidate = 300;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { blog: rawBlog, requested, canonicalSlug } = await findBlogBySlug(
        getServiceClient(),
        slug,
        "title, meta_title, meta_description, meta_keywords, description, image, slug, date_posted, updated_at, author, faqs"
    );

    if (!rawBlog) {
        return {
            title: "Article Not Found",
            description: "The requested article could not be found.",
            robots: { index: false, follow: false },
        };
    }

    const blog = applyBlogSeoOverride(rawBlog, canonicalSlug);

    if (requested !== canonicalSlug) {
        // Metadata still generated; page will permanentRedirect
    }

    const title = formatPageTitle(blog.meta_title || blog.title);
    const description = truncateMetaDescription(
        blog.meta_description || blog.description || ""
    );
    const keywords = parseBlogKeywords(blog.meta_keywords);
    const canonicalPath = `/blog/${canonicalSlug}`;
    const authorName = resolveBlogAuthor(blog).name;
    const ogImage = absoluteBlogImageUrl(blog.image);

    return {
        title,
        description,
        keywords: keywords.length ? keywords : undefined,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `${BRAND_URL}${canonicalPath}`,
            type: "article",
            publishedTime: blog.date_posted,
            modifiedTime: blog.updated_at || blog.date_posted,
            authors: [authorName],
            images: blog.image
                ? [
                      {
                          url: ogImage,
                          width: 1200,
                          height: 630,
                          alt: title,
                      },
                  ]
                : [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: blog.image ? [ogImage] : ["/og-image.png"],
            creator: TWITTER_HANDLE,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function createSlug(text) {
    return normalizeBlogSlug(text);
}

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    let supabase = null;
    try {
        supabase = getServiceClient();
    } catch {
        supabase = null;
    }

    const { blog: rawBlog, requested, canonicalSlug } = await findBlogBySlug(supabase, slug);

    if (!rawBlog) {
        notFound();
    }

    if (requested !== canonicalSlug) {
        permanentRedirect(`/blog/${canonicalSlug}`);
    }

    const blog = applyBlogSeoOverride(rawBlog, canonicalSlug);
    const authorProfile = resolveBlogAuthor(blog);
    const sections = blog.content_sections || {};
    const shopCta = getBlogShopCta(canonicalSlug);
    const productPicks = supabase
        ? await getBlogProductPicks(supabase, shopCta.pickMode || "popular", 4)
        : [];
    const reviewCounts = supabase
        ? await getReviewCounts(productPicks.map((p) => p.id))
        : {};
    const relatedPosts = await getRelatedBlogPosts(supabase, blog, 3);
    const keywords = parseBlogKeywords(blog.meta_keywords);

    const plainText = blog.content
        ? blog.content.replace(/<[^>]+>/g, " ").replace(/[#_*`>\[\]\(\)\-]/g, " ")
        : "";
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

    const contentIsHtml = looksLikeHtml(blog.content);

    const renderer = {
        heading({ tokens, depth, raw }) {
            const text = this.parser.parseInline(tokens);
            const cleanRaw = raw.replace(/^#+\s+/, "").trim();
            const headingSlug = createSlug(cleanRaw || text);
            // Demote markdown H1 to H2 so the page keeps a single H1
            const level = depth === 1 ? 2 : depth;
            return `<h${level} id="${headingSlug}" class="scroll-mt-24">${text}</h${level}>`;
        },
        link({ href, title, tokens }) {
            const text = this.parser.parseInline(tokens);
            const isExternal =
                href.startsWith("http") && !href.includes("theluxejewels.in");
            const localHref = href.replace(
                /^https?:\/\/(?:www\.)?theluxejewels\.in/i,
                ""
            );
            return `<a href="${localHref || href}" 
                ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""} 
                ${title ? `title="${title}"` : ""}>${text}</a>`;
        },
    };

    marked.use({ renderer });

    let htmlContent = "";
    if (blog.content) {
        const parsed = contentIsHtml
            ? blog.content
            : await marked.parse(blog.content);
        htmlContent = sanitizeHtml(
            ensureBlogInterlinks(enhanceBlogHtml(parsed), {
                shopLinks: [
                    ...(shopCta.links || []),
                    shopCta.primary,
                ].filter(Boolean),
                blogLinks: (relatedPosts || []).slice(0, 2).map((p) => ({
                    href: `/blog/${p.slug}`,
                    label: p.title,
                })),
            })
        );
    }

    const seoTitle = formatPageTitle(blog.meta_title || blog.title);
    const seoDescription = truncateMetaDescription(
        blog.meta_description || blog.description || ""
    );
    const heroImageSrc = normalizeBlogImageSrc(blog.image);
    const heroImageAbsolute = absoluteBlogImageUrl(blog.image);

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: seoTitle,
        description: seoDescription,
        image: heroImageAbsolute,
        author: {
            "@type": "Person",
            name: authorProfile.name,
            ...(authorProfile.bio
                ? { description: authorProfile.bio }
                : {}),
        },
        publisher: {
            "@type": "Organization",
            name: "The Luxe Jewels",
            url: BRAND_URL,
            logo: {
                "@type": "ImageObject",
                url: `${BRAND_URL}/logo.png`,
            },
        },
        datePublished: blog.date_posted,
        dateModified: blog.updated_at || blog.date_posted,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BRAND_URL}/blog/${canonicalSlug}`,
        },
        wordCount: wordCount,
        keywords: keywords.join(", "),
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: BRAND_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${BRAND_URL}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: blog.title,
                item: `${BRAND_URL}/blog/${canonicalSlug}`,
            },
        ],
    };

    const faqJsonLd =
        blog.faqs && blog.faqs.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: blog.faqs.map((faq) => ({
                      "@type": "Question",
                      name: faq.question,
                      acceptedAnswer: {
                          "@type": "Answer",
                          text: faq.answer,
                      },
                  })),
              }
            : null;

    const categoryLabel = keywords[0] || "Jewellery tips";
    const publishedLabel = formatDate(blog.date_posted);
    const updatedLabel = formatDate(blog.updated_at || blog.date_posted);

    return (
        <main className="min-h-screen bg-white text-[#1f1c1a]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            {/* Education-article layout inspired by luxury house journals (left-aligned, calm, image after meta) */}
            <div className="mx-auto w-full max-w-[720px] px-5 sm:px-6 pt-6 md:pt-10 pb-16 md:pb-24">
                <nav
                    className="flex items-center gap-2 text-[12px] text-[#6b6560] mb-8 md:mb-10 overflow-hidden whitespace-nowrap"
                    aria-label="Breadcrumb"
                >
                    <Link href="/" className="hover:text-[#E91E63] transition-colors">
                        Home
                    </Link>
                    <span className="text-[#cfc7bd]">—</span>
                    <Link href="/blog" className="hover:text-[#E91E63] transition-colors">
                        Journal
                    </Link>
                </nav>

                <header className="mb-7 md:mb-8">
                    <p className="text-[13px] text-[#6b6560] mb-4">
                        Category:{" "}
                        <Link
                            href={`/blog/tag/${keywordToTagSlug(categoryLabel)}`}
                            className="text-[#1f1c1a] underline underline-offset-4 decoration-[#d8d0c6] hover:text-[#E91E63] hover:decoration-[#E91E63]"
                        >
                            {categoryLabel}
                        </Link>
                    </p>

                    <h1 className="font-playfair text-[2rem] sm:text-[2.5rem] md:text-[2.85rem] font-medium tracking-tight text-[#1f1c1a] leading-[1.18]">
                        {blog.title}
                    </h1>

                    {blog.description ? (
                        <p className="mt-4 text-[17px] sm:text-[18px] text-[#4a453f] leading-relaxed">
                            {blog.description}
                        </p>
                    ) : null}

                    <p className="mt-6 text-[13px] text-[#6b6560]">
                        Author:{" "}
                        <span className="text-[#1f1c1a] font-medium">{authorProfile.name}</span>
                        <span className="mx-2 text-[#cfc7bd]">|</span>
                        {readMinutes} min read
                    </p>
                    <p className="mt-1.5 text-[13px] text-[#6b6560]">
                        Published: <time dateTime={blog.date_posted}>{publishedLabel}</time>
                        <span className="mx-2 text-[#cfc7bd]">|</span>
                        Last updated:{" "}
                        <time dateTime={blog.updated_at || blog.date_posted}>{updatedLabel}</time>
                    </p>
                </header>

                {heroImageSrc && (
                    <figure className="relative w-full aspect-[16/10] overflow-hidden bg-[#f3efe9] mb-5 md:mb-6">
                        <Image
                            src={heroImageSrc}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 720px"
                            quality={84}
                            className="object-cover object-center"
                            priority
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                        />
                    </figure>
                )}

                <div className="mb-10 md:mb-12">
                    <ShareButtons title={blog.title} labeled />
                </div>

                <article
                    className="prose prose-neutral prose-base sm:prose-lg max-w-none
                    prose-headings:font-playfair prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#1f1c1a]
                    prose-h2:text-[1.45rem] sm:prose-h2:text-[1.7rem] prose-h2:leading-snug prose-h2:mt-11 sm:prose-h2:mt-12 prose-h2:mb-4
                    prose-h3:text-[1.15rem] sm:prose-h3:text-[1.28rem] prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-[#3f3a35] prose-p:leading-[1.85] prose-p:mb-5
                    prose-strong:text-[#1f1c1a] prose-strong:font-semibold
                    prose-a:text-[#8a6538] prose-a:font-medium prose-a:underline prose-a:decoration-[#d8cbb8] prose-a:underline-offset-4 hover:prose-a:text-[#E91E63] hover:prose-a:decoration-[#E91E63]
                    prose-ul:my-6 prose-ul:pl-5 prose-li:text-[#3f3a35] prose-li:my-1.5 prose-li:leading-relaxed
                    prose-ol:my-6 prose-ol:pl-5
                    prose-blockquote:border-l-2 prose-blockquote:border-[#c4a574] prose-blockquote:pl-5 prose-blockquote:not-italic prose-blockquote:text-[#5c5752] prose-blockquote:my-8
                    prose-img:rounded-none prose-img:my-8
                    "
                >
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </article>

                <BlogContentSections
                    whyThisMatters={sections.why_this_matters}
                    comparisonTable={sections.comparison_table}
                    tipsMistakes={sections.tips_mistakes}
                />

                <div className="mt-12 md:mt-14">
                    <ShareButtons title={blog.title} labeled />
                </div>

                <div className="mt-12 md:mt-14">
                    <BlogShopCta cta={shopCta} />
                </div>

                <BlogProductPicks
                    products={productPicks}
                    reviewCounts={reviewCounts}
                    shopHref={shopCta.primary.href}
                    shopLabel={shopCta.primary.label}
                />

                {blog.faqs && blog.faqs.length > 0 && (
                    <section className="pt-14 md:pt-16 border-t border-[#ece7e1]">
                        <h2 className="font-playfair text-[1.6rem] md:text-[1.85rem] font-medium text-[#1f1c1a] tracking-tight mb-6">
                            Questions answered
                        </h2>
                        <div className="divide-y divide-[#ece7e1] border-y border-[#ece7e1]">
                            {blog.faqs.map((faq, idx) => (
                                <details key={idx} className="group py-5">
                                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                                        <span className="font-playfair text-[17px] md:text-[18px] font-medium text-[#1f1c1a] pr-2 leading-snug">
                                            {faq.question}
                                        </span>
                                        <span
                                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ddd6ce] text-[#8a847c] group-open:border-[#b89a6a] group-open:text-[#b89a6a]"
                                            aria-hidden
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            >
                                                <path d="M12 5v14" className="group-open:opacity-0" />
                                                <path d="M5 12h14" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-[14px] sm:text-[15px] text-[#5c5752] leading-relaxed pr-8">
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
                <section className="border-t border-[#ece7e1] bg-[#faf8f5]">
                    <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-6 py-12 md:py-16">
                        <h2 className="font-playfair text-[1.75rem] md:text-[2rem] text-[#1f1c1a] mb-8 md:mb-10">
                            Discover more
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
                            {relatedPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${normalizeBlogSlug(post.slug) || post.slug}`}
                                    className="group block"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-[#efeae4] mb-4">
                                        <Image
                                            src={normalizeBlogImageSrc(post.image) || "/logo.png"}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, 33vw"
                                            quality={70}
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            placeholder="blur"
                                            blurDataURL={IMAGE_BLUR_DATA_URL}
                                        />
                                    </div>
                                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8a847c] mb-2">
                                        Journal
                                    </p>
                                    <h3 className="font-playfair text-[1.15rem] font-medium text-[#1f1c1a] leading-snug group-hover:text-[#E91E63] transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="mt-2 text-[12px] text-[#8a847c]">
                                        {formatDate(post.date_posted)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <MobileStickyCTA
                title={blog.title}
                shopHref={isShopCatalogueHref(shopCta.primary.href) ? "" : shopCta.primary.href}
                shopLabel={shopCta.primary.label}
            />
        </main>
    );
}
