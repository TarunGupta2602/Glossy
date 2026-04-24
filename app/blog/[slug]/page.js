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
        ? blog.meta_keywords.split(",").map((k) => k.trim())
        : [];

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: `/blog/${blog.slug}`,
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
                        alt: blog.title,
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

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

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

    // Structured data - FAQ Schema
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

    // BreadcrumbList Schema
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

    // Convert Markdown to HTML for blog content
    const htmlContent = blog.content ? marked.parse(blog.content) : "";

    return (
        <>
            {/* Structured Data */}
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

            <div className="min-h-screen bg-white">
                {/* Breadcrumbs */}
                <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-8">
                    <nav className="flex items-center gap-2 text-xs text-gray-400">
                        <Link href="/" className="hover:text-[#E91E63] transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-[#E91E63] transition-colors">
                            Blog
                        </Link>
                        <span>/</span>
                        <span className="text-gray-600 truncate max-w-[200px]">{blog.title}</span>
                    </nav>
                </div>

                {/* Article Header */}
                <header className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-6 md:pt-12 md:pb-8">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        <span className="font-semibold uppercase tracking-widest text-[#E91E63]">
                            {blog.author}
                        </span>
                        <span>•</span>
                        <time dateTime={blog.date_posted}>{formatDate(blog.date_posted)}</time>
                    </div>

                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {blog.title}
                    </h1>

                    {blog.description && (
                        <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">
                            {blog.description}
                        </p>
                    )}
                </header>

                {/* Featured Image */}
                {blog.image && (
                    <div className="max-w-5xl mx-auto px-4 md:px-6 mb-10 md:mb-14">
                        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 1200px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Article Content */}
                {blog.content && (
                    <article className="max-w-3xl mx-auto px-4 md:px-6 mb-16 md:mb-20">
                        <div
                            className="prose prose-lg prose-gray max-w-none
                                prose-headings:font-bold prose-headings:text-gray-900
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-5
                                prose-a:text-[#E91E63] prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-gray-900
                                prose-ul:my-4 prose-ul:pl-5
                                prose-ol:my-4 prose-ol:pl-5
                                prose-li:text-gray-600 prose-li:mb-2
                                prose-img:rounded-xl prose-img:shadow-md
                                prose-blockquote:border-l-[#E91E63] prose-blockquote:bg-pink-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
                            "
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </article>
                )}

                {/* FAQs Section */}
                {blog.faqs && blog.faqs.length > 0 && (
                    <section className="max-w-3xl mx-auto px-4 md:px-6 mb-16 md:mb-20">
                        <div className="bg-gradient-to-br from-gray-50 to-pink-50/30 rounded-2xl p-8 md:p-10">
                            <h2
                                className="text-2xl md:text-3xl font-bold text-gray-900 mb-8"
                                style={{ fontFamily: "var(--font-playfair)" }}
                            >
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-0 divide-y divide-gray-200/60">
                                {blog.faqs.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group py-5 first:pt-0 last:pb-0"
                                    >
                                        <summary className="flex justify-between items-center cursor-pointer list-none">
                                            <h3 className="font-semibold text-gray-900 text-base md:text-lg pr-4 group-open:text-[#E91E63] transition-colors">
                                                {faq.question}
                                            </h3>
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-open:rotate-180 transition-transform duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <p className="mt-3 text-gray-600 leading-relaxed text-sm md:text-base pr-12">
                                            {faq.answer}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Back to Blog */}
                <div className="max-w-3xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
                    <div className="border-t border-gray-100 pt-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#E91E63] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to all articles
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
