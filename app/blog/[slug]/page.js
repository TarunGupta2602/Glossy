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
        .select("title, meta_title, meta_description, meta_keywords, description, image, slug")
        .eq("slug", slug)
        .single();

    if (!blog) {
        return {
            title: "Blog Not Found",
        };
    }

    const title = blog.meta_title || blog.title;
    const description = blog.meta_description || blog.description || "";
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

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();

    const { data: blog } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!blog) {
        notFound();
    }

    const keywords = blog.meta_keywords
        ? blog.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];

    const plainText = blog.content ? blog.content.replace(/[#_*`>\[\]\(\)\-]/g, " ") : "";
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 220));

    const tocItems = blog.content ? getMarkdownHeadings(blog.content) : [];
    const renderer = new marked.Renderer();
    renderer.heading = (text, level, raw) => {
        const slug = createSlug(raw || text);
        return `<h${level} id="${slug}">${text}</h${level}>`;
    };

    const htmlContent = blog.content
        ? marked.parse(blog.content, { renderer, mangle: false, headerIds: false })
        : "";

    // Structured data - Article Schema
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.meta_title || blog.title,
        description: blog.meta_description || blog.description || "",
        image: blog.image || "",
        author: {
            "@type": "Person",
            name: blog.author,
        },
        publisher: {
            "@type": "Organization",
            name: "The Luxe Jewels",
            url: "https://www.theluxejewels.in",
            logo: {
                "@type": "ImageObject",
                url: "https://www.theluxejewels.in/favicon-symbol.png",
            },
        },
        datePublished: blog.date_posted,
        dateModified: blog.updated_at || blog.date_posted,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.theluxejewels.in/blog/${blog.slug}`,
        },
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <div className="min-h-screen bg-linear-to-br from-white via-pink-50 to-pink-100 pb-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                    <div className="rounded-4xl border border-pink-100 bg-white/90 shadow-[0_28px_80px_-32px_rgba(219,39,119,0.25)] p-6 md:p-8 lg:p-10 mb-8">
                        <nav className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <Link href="/" className="hover:text-[#E91E63] transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/blog" className="hover:text-[#E91E63] transition-colors">
                                Blog
                            </Link>
                            <span>/</span>
                            <span className="text-gray-700 font-semibold truncate max-w-60">
                                {blog.title}
                            </span>
                        </nav>

                        <div className="grid gap-8 lg:items-end mt-8">
                            <div>
                                <div className="inline-flex items-center gap-3 rounded-full border border-pink-100 bg-pink-50/80 px-4 py-2 text-sm text-[#9c27b0] shadow-sm">
                                    <span>{blog.author || "The Luxe Jewels Team"}</span>
                                    <span>•</span>
                                    <time dateTime={blog.date_posted}>{formatDate(blog.date_posted)}</time>
                                    <span>•</span>
                                    <span>{readMinutes} min read</span>
                                </div>
                                <h1
                                    className="mt-5 text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
                                    style={{ fontFamily: "var(--font-playfair)" }}
                                >
                                    {blog.title}
                                </h1>
                                {blog.description && (
                                    <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-600 leading-relaxed">
                                        {blog.description}
                                    </p>
                                )}
                                {keywords.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {keywords.map((keyword) => (
                                            <span
                                                key={keyword}
                                                className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm font-medium text-[#c2185b]"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {blog.image && (
                        <div className="mb-10 overflow-hidden rounded-4xl border border-pink-100 bg-white shadow-[0_28px_80px_-38px_rgba(233,30,99,0.16)]">
                            <div className="relative aspect-video">
                                <Image
                                    src={blog.image}
                                    alt={blog.meta_title || blog.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 1200px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid gap-10 xl:grid-cols-[1.55fr_0.95fr]">
                        <div className="space-y-10">
                            <article className="rounded-4xl border border-gray-100 bg-white/90 shadow-[0_20px_80px_-36px_rgba(15,23,42,0.08)] p-6 md:p-8">
                                <div
                                    className="prose prose-lg prose-gray max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-a:text-[#E91E63] prose-a:no-underline hover:prose-a:underline prose-ul:pl-6 prose-ol:pl-6 prose-img:rounded-3xl prose-img:shadow-lg prose-blockquote:border-l-[#E91E63] prose-blockquote:bg-pink-50/70 prose-code:bg-pink-50 prose-code:text-[#c2185b]"
                                    style={{ fontFamily: "var(--font-playfair)" }}
                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                            </article>

                            {blog.faqs && blog.faqs.length > 0 && (
                                <section className="rounded-4xl border border-pink-100 bg-white/90 p-6 md:p-8 shadow-[0_20px_80px_-36px_rgba(219,39,119,0.16)]">
                                    <h2
                                        className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6"
                                        style={{ fontFamily: "var(--font-playfair)" }}
                                    >
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-4 divide-y divide-gray-200/60">
                                        {blog.faqs.map((faq, index) => (
                                            <details
                                                key={index}
                                                className="group py-5 first:pt-0 last:pb-0"
                                            >
                                                <summary className="flex justify-between items-center cursor-pointer list-none select-none gap-4 text-gray-900 font-semibold">
                                                    <span>{faq.question}</span>
                                                    <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-600 border border-pink-100 transition-all duration-300 group-open:rotate-180">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </span>
                                                </summary>
                                                <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
                                                    {faq.answer}
                                                </p>
                                            </details>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <div className="rounded-4xl border border-gray-100 bg-white/90 p-6 md:p-8 shadow-[0_20px_80px_-36px_rgba(15,23,42,0.08)]">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#E91E63] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-[#c2185b]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to all articles
                                </Link>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="hidden xl:block sticky top-24 rounded-4xl border border-gray-100 bg-white/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.08)]">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of contents</h2>
                                {tocItems.length > 0 ? (
                                    <ul className="space-y-3">
                                        {tocItems.map((item) => (
                                            <li key={item.slug} className={item.depth === 3 ? "pl-5" : "pl-0"}>
                                                <a
                                                    href={`#${item.slug}`}
                                                    className="text-sm text-gray-600 hover:text-[#E91E63] transition-colors"
                                                >
                                                    {item.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">Add headings to the blog content to generate an auto table of contents.</p>
                                )}
                            </div>

                            <div className="rounded-4xl border border-pink-100 bg-pink-50/80 p-6 shadow-[0_20px_60px_-30px_rgba(219,39,119,0.18)]">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Need expert help?</h3>
                                <p className="text-sm text-gray-700 leading-relaxed mb-5">
                                    Discover more jewelry styling, care advice, and trend updates on our blog.
                                </p>
                                <Link
                                    href="/blog"
                                    className="inline-flex w-full items-center justify-center rounded-full bg-[#E91E63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c2185b]"
                                >
                                    Explore more stories
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
