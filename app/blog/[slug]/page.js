import { getServiceClient } from "@/lib/supabaseServiceClient";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { marked } from "marked";
import { TWITTER_HANDLE, BRAND_URL } from "@/lib/constants";
import {
    formatPageTitle,
    truncateMetaDescription,
    normalizeBlogSlug,
} from "@/lib/seo";
import {
    findBlogBySlug,
    getRelatedBlogPosts,
    parseBlogKeywords,
    keywordToTagSlug,
} from "@/lib/blogQueries";
import { applyBlogSeoOverride } from "@/lib/blogSeoOverrides";
import { getBlogShopCta } from "@/lib/blogShopCtas";
import { getBlogProductPicks } from "@/lib/blogProductPicks";
import { getReviewCounts } from "@/lib/reviewCounts";
import BlogShopCta from "../../components/BlogShopCta";
import BlogProductPicks from "../../components/BlogProductPicks";
import { ShareButtons, MobileStickyCTA } from "./BlogInteraction";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

export const revalidate = 300;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();
    const { blog: rawBlog, requested, canonicalSlug } = await findBlogBySlug(
        supabase,
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
            authors: [blog.author || "The Luxe Jewels"],
            images: blog.image
                ? [
                      {
                          url: blog.image,
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
            images: blog.image ? [blog.image] : ["/og-image.png"],
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

function getMarkdownHeadings(content) {
    return String(content)
        .split(/\r?\n/)
        .map((line) => line.match(/^(#{1,3})\s+(.*)$/))
        .filter(Boolean)
        .map(([_, hashes, text]) => {
            const depth = hashes.length === 1 ? 2 : hashes.length;
            return {
                text: text.trim(),
                depth,
                slug: createSlug(text.trim()),
            };
        });
}

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();

    const { blog: rawBlog, requested, canonicalSlug } = await findBlogBySlug(supabase, slug);

    if (!rawBlog) {
        notFound();
    }

    if (requested !== canonicalSlug) {
        permanentRedirect(`/blog/${canonicalSlug}`);
    }

    const blog = applyBlogSeoOverride(rawBlog, canonicalSlug);
    const shopCta = getBlogShopCta(canonicalSlug);
    const productPicks = await getBlogProductPicks(
        supabase,
        shopCta.pickMode || "popular",
        4
    );
    const reviewCounts = await getReviewCounts(productPicks.map((p) => p.id));
    const relatedPosts = await getRelatedBlogPosts(supabase, blog, 3);
    const keywords = parseBlogKeywords(blog.meta_keywords);

    const plainText = blog.content
        ? blog.content.replace(/[#_*`>\[\]\(\)\-]/g, " ")
        : "";
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

    const tocItems = blog.content ? getMarkdownHeadings(blog.content) : [];

    const renderer = {
        heading({ tokens, depth, raw }) {
            const text = this.parser.parseInline(tokens);
            const cleanRaw = raw.replace(/^#+\s+/, "").trim();
            const headingSlug = createSlug(cleanRaw || text);
            // Demote markdown H1 to H2 so the page keeps a single H1
            const level = depth === 1 ? 2 : depth;
            return `<h${level} id="${headingSlug}" class="scroll-mt-24 group flex items-center">
                ${text}
                <a href="#${headingSlug}" class="ml-2 opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-600 transition-all" aria-hidden="true">#</a>
            </h${level}>`;
        },
        link({ href, title, tokens }) {
            const text = this.parser.parseInline(tokens);
            const isExternal =
                href.startsWith("http") && !href.includes("theluxejewels.in");
            return `<a href="${href}" 
                ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""} 
                class="text-pink-600 hover:text-pink-700 font-bold underline decoration-pink-200 decoration-2 underline-offset-4 hover:decoration-pink-500 transition-all"
                ${title ? `title="${title}"` : ""}>${text}</a>`;
        },
    };

    marked.use({ renderer });

    const htmlContent = blog.content
        ? sanitizeHtml(await marked.parse(blog.content))
        : "";
    const seoTitle = formatPageTitle(blog.meta_title || blog.title);
    const seoDescription = truncateMetaDescription(
        blog.meta_description || blog.description || ""
    );

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: seoTitle,
        description: seoDescription,
        image: blog.image || `${BRAND_URL}/og-image.png`,
        author: {
            "@type": "Person",
            name: blog.author || "The Luxe Jewels Team",
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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-pink-100 selection:text-pink-900">
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

            <div className={`${SITE_CONTAINER} py-6 md:py-10`}>
                <nav
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8 overflow-hidden whitespace-nowrap"
                    aria-label="Breadcrumb"
                >
                    <Link href="/" className="hover:text-pink-600 transition-colors">
                        Home
                    </Link>
                    <span className="text-slate-300">/</span>
                    <Link href="/blog" className="hover:text-pink-600 transition-colors">
                        Journal
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 truncate normal-case tracking-normal">
                        {blog.title}
                    </span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <main className="lg:col-span-8 space-y-8">
                        <header className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                {keywords.slice(0, 1).map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blog/tag/${keywordToTagSlug(tag)}`}
                                        className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-700 hover:bg-pink-200 transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                                <span className="text-slate-400 font-medium">•</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    {readMinutes} min read
                                </span>
                            </div>

                            <h1
                                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-[1.15]"
                                style={{ fontFamily: "var(--font-playfair)" }}
                            >
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-4 py-4 border-y border-slate-200">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">
                                        Written by{" "}
                                        <span className="text-pink-600 underline underline-offset-4">
                                            {blog.author || "The Luxe Jewels"}
                                        </span>
                                    </p>
                                    <time
                                        className="text-xs font-medium text-slate-500"
                                        dateTime={blog.date_posted}
                                    >
                                        Published on {formatDate(blog.date_posted)}
                                    </time>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShareButtons title={blog.title} />
                                </div>
                            </div>
                        </header>

                        {blog.image && (
                            <figure className="relative w-full aspect-16/10 rounded-3xl overflow-hidden shadow-2xl group">
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                                    quality={80}
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABH/2Q=="
                                />
                            </figure>
                        )}

                        <article
                            className="prose prose-slate prose-base sm:prose-lg md:prose-xl max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
                            prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:mt-8 md:prose-h2:mt-12 prose-h2:mb-4 md:prose-h2:mb-6 prose-h2:pb-3 md:prose-h2:pb-4 prose-h2:border-b prose-h2:border-pink-100
                            prose-h3:text-lg sm:prose-h3:text-xl md:prose-h3:text-3xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-3 md:prose-h3:mb-4
                            prose-p:text-slate-600 prose-p:leading-relaxed md:prose-p:leading-loose prose-p:mb-6 md:prose-p:mb-8
                            prose-strong:text-slate-900 prose-strong:font-black prose-strong:text-pink-600/90
                            prose-a:text-pink-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-8 prose-a:decoration-2 transition-all
                            prose-ul:list-disc prose-ul:pl-6 prose-li:mb-4 prose-li:text-slate-600
                            prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-4
                            prose-blockquote:border-l-8 prose-blockquote:border-pink-400 prose-blockquote:bg-gradient-to-r prose-blockquote:from-pink-50 prose-blockquote:to-white prose-blockquote:p-8 prose-blockquote:rounded-2xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:my-10 prose-blockquote:shadow-sm
                            prose-img:rounded-4xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-100 prose-img:my-12
                            "
                        >
                            <div
                                style={{ fontFamily: "var(--font-playfair)" }}
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </article>

                        <BlogShopCta cta={shopCta} />

                        <BlogProductPicks
                            products={productPicks}
                            reviewCounts={reviewCounts}
                            shopHref={shopCta.primary.href}
                            shopLabel={shopCta.primary.label}
                        />

                        {blog.faqs && blog.faqs.length > 0 && (
                            <section className="pt-16 border-t border-slate-200">
                                <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-8">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {blog.faqs.map((faq, idx) => (
                                        <details
                                            key={idx}
                                            className="group border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-pink-200"
                                        >
                                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                                <span className="font-bold text-slate-900 pr-4">
                                                    {faq.question}
                                                </span>
                                                <span className="shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-300">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                                                {faq.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}

                        {keywords.length > 0 && (
                            <div className="pt-10 flex flex-wrap gap-2">
                                <span className="w-full text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                    Article Tags
                                </span>
                                {keywords.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blog/tag/${keywordToTagSlug(tag)}`}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-pink-600 hover:text-pink-600 transition-all"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>

                    <aside className="lg:col-span-4 space-y-10">
                        <div className="hidden lg:block lg:sticky lg:top-28">
                            <BlogShopCta cta={shopCta} compact />
                        </div>
                        {tocItems.length > 0 && (
                            <>
                                <details className="lg:hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm group">
                                    <summary className="flex items-center justify-between cursor-pointer list-none min-h-11 text-sm font-black uppercase tracking-[0.15em] text-slate-900">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                            Contents
                                        </span>
                                        <svg
                                            className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </summary>
                                    <nav className="mt-4 space-y-3">
                                        {tocItems.map((item) => (
                                            <a
                                                key={item.slug}
                                                href={`#${item.slug}`}
                                                className={`block text-sm font-medium py-1 ${item.depth === 2 ? "text-slate-600" : "text-slate-400 pl-4 border-l border-slate-100"}`}
                                            >
                                                {item.text}
                                            </a>
                                        ))}
                                    </nav>
                                </details>
                                <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hidden lg:block">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                        Table of contents
                                    </h3>
                                    <nav className="space-y-4">
                                        {tocItems.map((item) => (
                                            <a
                                                key={item.slug}
                                                href={`#${item.slug}`}
                                                className={`block text-sm font-medium transition-all hover:translate-x-1 ${item.depth === 2 ? "text-slate-600 hover:text-pink-600" : "text-slate-400 hover:text-pink-600 pl-4 border-l border-slate-100"}`}
                                            >
                                                {item.text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </>
                        )}

                        {relatedPosts && relatedPosts.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                                    Keep Reading
                                </h3>
                                <div className="space-y-6">
                                    {relatedPosts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${normalizeBlogSlug(post.slug) || post.slug}`}
                                            className="group flex gap-4 items-start"
                                        >
                                            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                                                <Image
                                                    src={post.image || "/placeholder-blog.png"}
                                                    alt={post.title}
                                                    fill
                                                    sizes="80px"
                                                    quality={75}
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABH/2Q=="
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-pink-600 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h4>
                                                <time className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    {formatDate(post.date_posted)}
                                                </time>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            <MobileStickyCTA
                title={blog.title}
                shopHref={shopCta.primary.href}
                shopLabel={shopCta.primary.label}
            />
        </div>
    );
}
