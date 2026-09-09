import { getServiceClient } from "@/lib/supabaseServiceClient";
import { HOME_CONTAINER } from "@/lib/siteLayout";
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
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

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
        <main className="min-h-screen bg-white text-[#2a2724]">
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

            <div className={`${HOME_CONTAINER} py-8 md:py-12 lg:py-14`}>
                <nav
                    className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8a847c] mb-8 md:mb-10 overflow-hidden whitespace-nowrap"
                    aria-label="Breadcrumb"
                >
                    <Link href="/" className="hover:text-[#E91E63] transition-colors">
                        Home
                    </Link>
                    <span className="text-[#d4cbc0]">/</span>
                    <Link href="/blog" className="hover:text-[#E91E63] transition-colors">
                        Journal
                    </Link>
                    <span className="text-[#d4cbc0]">/</span>
                    <span className="text-[#2a2724] truncate normal-case tracking-normal font-normal">
                        {blog.title}
                    </span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16">
                    <div className="lg:col-span-8 space-y-8 md:space-y-10">
                        <header className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                {keywords.slice(0, 1).map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blog/tag/${keywordToTagSlug(tag)}`}
                                        className="text-[10px] font-medium uppercase tracking-[0.18em] hover:text-[#E91E63] transition-colors"
                                        style={{ color: "#b89a6a" }}
                                    >
                                        {tag}
                                    </Link>
                                ))}
                                {keywords.length > 0 && (
                                    <span className="text-[#d4cbc0]">·</span>
                                )}
                                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8a847c]">
                                    {readMinutes} min read
                                </span>
                            </div>

                            <h1 className="font-playfair text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.25rem] font-medium tracking-tight text-[#2a2724] leading-[1.12]">
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-4 py-4 border-y border-[#efeae4]">
                                <div className="flex-1">
                                    <p className="text-[13px] font-medium text-[#2a2724]">
                                        Written by {blog.author || "The Luxe Jewels"}
                                    </p>
                                    <time
                                        className="text-[12px] text-[#8a847c]"
                                        dateTime={blog.date_posted}
                                    >
                                        Published on {formatDate(blog.date_posted)}
                                    </time>
                                </div>
                                <ShareButtons title={blog.title} />
                            </div>
                        </header>

                        {blog.image && (
                            <figure className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-[#efeae4]">
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                                    quality={82}
                                    className="object-cover"
                                    priority
                                    placeholder="blur"
                                    blurDataURL={IMAGE_BLUR_DATA_URL}
                                />
                            </figure>
                        )}

                        <article
                            className="prose prose-neutral prose-base sm:prose-lg max-w-none
                            prose-headings:font-playfair prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#2a2724]
                            prose-h2:text-[1.55rem] sm:prose-h2:text-[1.85rem] prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-[#efeae4]
                            prose-h3:text-[1.2rem] sm:prose-h3:text-[1.35rem] prose-h3:mt-8 prose-h3:mb-3
                            prose-p:text-[#6b6560] prose-p:leading-relaxed prose-p:mb-5
                            prose-strong:text-[#2a2724] prose-strong:font-semibold
                            prose-a:text-[#b89a6a] prose-a:font-medium prose-a:no-underline hover:prose-a:text-[#E91E63] hover:prose-a:underline prose-a:underline-offset-4
                            prose-ul:pl-5 prose-li:text-[#6b6560] prose-li:mb-2
                            prose-ol:pl-5
                            prose-blockquote:border-l-2 prose-blockquote:border-[#b89a6a] prose-blockquote:bg-[#fdfbf7] prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-[#6b6560] prose-blockquote:rounded-r-xl
                            prose-img:rounded-2xl prose-img:my-8
                            "
                        >
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        </article>

                        <BlogShopCta cta={shopCta} />

                        <BlogProductPicks
                            products={productPicks}
                            reviewCounts={reviewCounts}
                            shopHref={shopCta.primary.href}
                            shopLabel={shopCta.primary.label}
                        />

                        {blog.faqs && blog.faqs.length > 0 && (
                            <section className="pt-12 border-t border-[#efeae4]">
                                <p
                                    className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                                    style={{ color: "#b89a6a" }}
                                >
                                    Support
                                </p>
                                <h2 className="font-playfair text-2xl md:text-3xl font-medium text-[#2a2724] tracking-tight mb-6">
                                    Questions,{" "}
                                    <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                        answered
                                    </em>
                                </h2>
                                <div className="divide-y divide-[#e8e2da] border-y border-[#e8e2da]">
                                    {blog.faqs.map((faq, idx) => (
                                        <details key={idx} className="group py-5">
                                            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                                                <span className="font-playfair text-[17px] md:text-[18px] font-medium text-[#2a2724] pr-2 leading-snug">
                                                    {faq.question}
                                                </span>
                                                <span
                                                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[#8a847c] group-open:border-[#b89a6a] group-open:text-[#b89a6a]"
                                                    style={{ borderColor: "#d4cbc0" }}
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
                                            <p className="mt-3 text-[14px] sm:text-[15px] text-[#6b6560] leading-relaxed max-w-2xl pr-10">
                                                {faq.answer}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}

                        {keywords.length > 0 && (
                            <div className="pt-8 flex flex-wrap gap-2">
                                <span className="w-full text-[10px] font-medium uppercase tracking-[0.18em] text-[#a89880] mb-1">
                                    Topics
                                </span>
                                {keywords.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blog/tag/${keywordToTagSlug(tag)}`}
                                        className="px-3.5 py-2 border border-[#efeae4] text-[12px] text-[#6b6560] hover:border-[#b89a6a] hover:text-[#2a2724] transition-colors rounded-full"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="lg:col-span-4 space-y-8">
                        <div className="hidden lg:block lg:sticky lg:top-28 space-y-8">
                            <BlogShopCta cta={shopCta} compact />

                            {tocItems.length > 0 && (
                                <div className="border border-[#efeae4] rounded-2xl p-6 bg-[#fdfbf7]">
                                    <h3
                                        className="text-[11px] font-medium uppercase tracking-[0.18em] mb-5"
                                        style={{ color: "#b89a6a" }}
                                    >
                                        On this page
                                    </h3>
                                    <nav className="space-y-3">
                                        {tocItems.map((item) => (
                                            <a
                                                key={item.slug}
                                                href={`#${item.slug}`}
                                                className={`block text-[13px] leading-snug transition-colors hover:text-[#E91E63] ${item.depth === 2 ? "text-[#3d3935]" : "text-[#8a847c] pl-3 border-l border-[#e8e2da]"}`}
                                            >
                                                {item.text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>

                        {tocItems.length > 0 && (
                            <details className="lg:hidden border border-[#efeae4] rounded-2xl p-4 bg-[#fdfbf7] group">
                                <summary className="flex items-center justify-between cursor-pointer list-none min-h-11 text-[11px] font-medium uppercase tracking-[0.16em] text-[#2a2724]">
                                    <span style={{ color: "#b89a6a" }}>On this page</span>
                                    <svg
                                        className="w-4 h-4 text-[#8a847c] transition-transform group-open:rotate-180"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.8"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </summary>
                                <nav className="mt-4 space-y-3">
                                    {tocItems.map((item) => (
                                        <a
                                            key={item.slug}
                                            href={`#${item.slug}`}
                                            className={`block text-[13px] ${item.depth === 2 ? "text-[#3d3935]" : "text-[#8a847c] pl-3"}`}
                                        >
                                            {item.text}
                                        </a>
                                    ))}
                                </nav>
                            </details>
                        )}

                        {relatedPosts && relatedPosts.length > 0 && (
                            <div className="space-y-5 pt-2">
                                <h3
                                    className="text-[11px] font-medium uppercase tracking-[0.18em]"
                                    style={{ color: "#b89a6a" }}
                                >
                                    Keep reading
                                </h3>
                                <div className="space-y-5">
                                    {relatedPosts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${normalizeBlogSlug(post.slug) || post.slug}`}
                                            className="group flex gap-4 items-start"
                                        >
                                            <div className="relative w-[72px] h-[72px] shrink-0 overflow-hidden rounded-xl bg-[#efeae4]">
                                                <Image
                                                    src={post.image || "/logo.png"}
                                                    alt={post.title}
                                                    fill
                                                    sizes="72px"
                                                    quality={70}
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                                    placeholder="blur"
                                                    blurDataURL={IMAGE_BLUR_DATA_URL}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-playfair text-[15px] font-medium text-[#2a2724] leading-snug group-hover:text-[#E91E63] transition-colors line-clamp-2">
                                                    {post.title}
                                                </h4>
                                                <time className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-[#a89880]">
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
        </main>
    );
}
