import { getServiceClient } from "@/lib/supabaseServiceClient";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();

    const { data: blog } = await supabase
        .from("blogs")
        .select("title, meta_title, meta_description, meta_keywords, description, image, slug, date_posted, updated_at, author")
        .eq("slug", slug)
        .single();

    if (!blog) {
        return {
            title: "Article Not Found | The Luxe Jewels",
            description: "The requested article could not be found.",
        };
    }

    const title = blog.meta_title || blog.title;
    const description = (blog.meta_description || blog.description || "").slice(0, 160);
    const keywords = blog.meta_keywords
        ? blog.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: `https://www.theluxejewels.in/blog/${blog.slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://www.theluxejewels.in/blog/${blog.slug}`,
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
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: blog.image ? [blog.image] : [],
            creator: "@theluxejewels",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
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
    const value = String(text || "");
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function getMarkdownHeadings(content) {
    return String(content)
        .split(/\r?\n/)
        .map((line) => line.match(/^(#{1,3})\s+(.*)$/))
        .filter(Boolean)
        .map(([_, hashes, text]) => ({
            text: text.trim(),
            depth: hashes.length,
            slug: createSlug(text.trim()),
        }));
}

import { ShareButtons, MobileStickyCTA } from "./BlogInteraction";

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();

    // Fetch current blog
    const { data: blog } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!blog) {
        notFound();
    }

    // Fetch related articles (latest 3 excluding current)
    const { data: relatedPosts } = await supabase
        .from("blogs")
        .select("id, title, slug, image, date_posted, author")
        .neq("slug", slug)
        .order("date_posted", { ascending: false })
        .limit(3);

    const keywords = blog.meta_keywords
        ? blog.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];

    const plainText = blog.content ? blog.content.replace(/[#_*`>\[\]\(\)\-]/g, " ") : "";
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

    const tocItems = blog.content ? getMarkdownHeadings(blog.content) : [];

    // Custom renderer for marked v12+
    const renderer = {
        heading({ tokens, depth, raw }) {
            const text = this.parser.parseInline(tokens);
            // Remove the hashes from the raw text for slugging
            const cleanRaw = raw.replace(/^#+\s+/, '').trim();
            const slug = createSlug(cleanRaw || text);
            return `<h${depth} id="${slug}" class="scroll-mt-24 group flex items-center">
                ${text}
                <a href="#${slug}" class="ml-2 opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-600 transition-all" aria-hidden="true">#</a>
            </h${depth}>`;
        },
        link({ href, title, tokens }) {
            const text = this.parser.parseInline(tokens);
            const isExternal = href.startsWith('http') && !href.includes('theluxejewels.in');
            return `<a href="${href}" 
                ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} 
                class="text-pink-600 hover:text-pink-700 font-bold underline decoration-pink-200 decoration-2 underline-offset-4 hover:decoration-pink-500 transition-all"
                ${title ? `title="${title}"` : ''}>${text}</a>`;
        }
    };

    marked.use({ renderer });

    const htmlContent = blog.content
        ? await marked.parse(blog.content)
        : "";

    // Structured data - Article Schema
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.meta_title || blog.title,
        description: (blog.meta_description || blog.description || "").slice(0, 160),
        image: blog.image || "",
        author: {
            "@type": "Person",
            name: blog.author || "The Luxe Jewels Team",
        },
        publisher: {
            "@type": "Organization",
            name: "The Luxe Jewels",
            url: "https://www.theluxejewels.in",
            logo: {
                "@type": "ImageObject",
                url: "https://www.theluxejewels.in/logo.png",
            },
        },
        datePublished: blog.date_posted,
        dateModified: blog.updated_at || blog.date_posted,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.theluxejewels.in/blog/${blog.slug}`,
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
                item: "https://www.theluxejewels.in",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.theluxejewels.in/blog",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: blog.title,
                item: `https://www.theluxejewels.in/blog/${blog.slug}`,
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
            {/* Structured Data */}
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

            {/* Reading Progress Indicator (Client-side would be better, but we can do a stationary one or just skip) */}

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8 overflow-hidden whitespace-nowrap">
                    <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link>
                    <span className="text-slate-300">/</span>
                    <Link href="/blog" className="hover:text-pink-600 transition-colors">Journal</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 truncate">Article Detail</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <main className="lg:col-span-8 space-y-8">
                        <header className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                {keywords.slice(0, 1).map((tag) => (
                                    <span key={tag} className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-700">
                                        {tag}
                                    </span>
                                ))}
                                <span className="text-slate-400 font-medium">•</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    {readMinutes} min read
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]" style={{ fontFamily: "var(--font-playfair)" }}>
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-4 py-4 border-y border-slate-200">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">
                                        Written by <span className="text-pink-600 underline underline-offset-4">{blog.author || "The Luxe Jewels"}</span>
                                    </p>
                                    <time className="text-xs font-medium text-slate-500" dateTime={blog.date_posted}>
                                        Published on {formatDate(blog.date_posted)}
                                    </time>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Share Buttons */}
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
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                            </figure>
                        )}

                        <article className="prose prose-slate prose-lg md:prose-xl max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
                            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-pink-100
                            prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-slate-600 prose-p:leading-relaxed md:prose-p:leading-loose prose-p:mb-8
                            prose-strong:text-slate-900 prose-strong:font-black prose-strong:text-pink-600/90
                            prose-a:text-pink-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-8 prose-a:decoration-2 transition-all
                            prose-ul:list-disc prose-ul:pl-6 prose-li:mb-4 prose-li:text-slate-600
                            prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-4
                            prose-blockquote:border-l-8 prose-blockquote:border-pink-400 prose-blockquote:bg-linear-to-r prose-blockquote:from-pink-50 prose-blockquote:to-white prose-blockquote:p-8 prose-blockquote:rounded-2xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:my-10 prose-blockquote:shadow-sm
                            prose-img:rounded-4xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-100 prose-img:my-12
                            ">
                            <div
                                style={{ fontFamily: "var(--font-playfair)" }}
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </article>

                        {/* FAQs Section */}
                        {blog.faqs && blog.faqs.length > 0 && (
                            <section className="pt-16 border-t border-slate-200">
                                <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-8">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    {blog.faqs.map((faq, idx) => (
                                        <details key={idx} className="group border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-pink-200">
                                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                                <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                                                <span className="shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
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

                        {/* Tag Cloud */}
                        {keywords.length > 0 && (
                            <div className="pt-10 flex flex-wrap gap-2">
                                <span className="w-full text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Article Tags</span>
                                {keywords.map((tag) => (
                                    <span key={tag} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-pink-600 hover:text-pink-600 transition-all cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Table of Contents */}
                        {tocItems.length > 0 && (
                            <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm lg:block hidden">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                    Table of contents
                                </h3>
                                <nav className="space-y-4">
                                    {tocItems.map((item) => (
                                        <a
                                            key={item.slug}
                                            href={`#${item.slug}`}
                                            className={`block text-sm font-medium transition-all hover:translate-x-1 ${item.depth === 2 ? 'text-slate-600 hover:text-pink-600' : 'text-slate-400 hover:text-pink-600 pl-4 border-l border-slate-100'}`}
                                        >
                                            {item.text}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Related Posts */}
                        {relatedPosts && relatedPosts.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                                    Keep Reading
                                </h3>
                                <div className="space-y-6">
                                    {relatedPosts.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
                                            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                                                <Image
                                                    src={post.image || '/placeholder-blog.png'}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
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

                        {/* Newsletter CTA */}
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-black mb-4 relative z-10">Luxury in your inbox.</h3>
                            <p className="text-slate-400 text-sm mb-6 relative z-10 font-medium">Join 5,000+ others for exclusive styling tips, trend reports, and VIP access.</p>
                            <Link href="/account" className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-slate-900 text-sm font-bold uppercase tracking-widest hover:bg-pink-50 transition-colors relative z-10">
                                Join The Club
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Bottom Sticky CTA for Mobile */}
            <MobileStickyCTA title={blog.title} />
        </div>
    );
}
