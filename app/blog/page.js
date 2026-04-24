import { getServiceClient } from "@/lib/supabaseServiceClient";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "Blog | Jewelry Tips, Styling Guides & Latest Trends",
    description:
        "Explore The Luxe Jewels blog for expert jewelry tips, styling guides, care advice, and the latest trends in luxury anti-tarnish and waterproof jewelry.",
    keywords: [
        "jewelry blog",
        "jewelry styling tips",
        "luxury jewelry trends",
        "jewelry care guide",
        "anti tarnish jewelry tips",
        "waterproof jewelry blog",
        "The luxe jewels blog",
    ],
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog | Jewelry Tips & Styling Guides | The Luxe Jewels",
        description:
            "Explore expert jewelry tips, styling guides, and the latest trends from The Luxe Jewels.",
        url: "https://www.theluxejewels.in/blog",
        type: "website",
    },
};

export default async function BlogPage() {
    const supabase = getServiceClient();

    const { data: blogs } = await supabase
        .from("blogs")
        .select("id, title, slug, description, image, author, date_posted")
        .order("date_posted", { ascending: false });

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-50 via-white to-pink-50/30 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#E91E63] mb-3">
                        The Luxe Journal
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        Our Blog
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
                        Discover styling inspiration, jewelry care tips, and the latest trends
                        in luxury accessories.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                {!blogs || blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Coming soon!</p>
                        <p className="text-gray-400 text-sm mt-1">We&apos;re working on some amazing content for you.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <Link
                                href={`/blog/${blog.slug}`}
                                key={blog.id}
                                className="group"
                            >
                                <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                        {blog.image ? (
                                            <Image
                                                src={blog.image}
                                                alt={blog.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority={index < 3}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                            <span className="font-semibold uppercase tracking-widest text-[#E91E63]">
                                                {blog.author}
                                            </span>
                                            <span>•</span>
                                            <time dateTime={blog.date_posted}>
                                                {formatDate(blog.date_posted)}
                                            </time>
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E91E63] transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>

                                        {blog.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                                {blog.description}
                                            </p>
                                        )}

                                        <div className="mt-4 flex items-center text-sm font-semibold text-[#E91E63] group-hover:gap-2 transition-all">
                                            Read Article
                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
