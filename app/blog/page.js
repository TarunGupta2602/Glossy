import { getServiceClient } from "@/lib/supabaseServiceClient";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

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


// Pagination settings
const PAGE_SIZE = 6;

export default async function BlogPage({ searchParams }) {
    const supabase = getServiceClient();
    const page = parseInt(searchParams?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/blog?page=1");

    // Get total count
    const { count } = await supabase
        .from("blogs")
        .select("id", { count: "exact", head: true });

    // Get paginated blogs
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data: blogs } = await supabase
        .from("blogs")
        .select("id, title, slug, description, image, author, date_posted")
        .order("date_posted", { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Pagination bar
    function Pagination() {
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            // Show first, last, current, and neighbors
            if (
                i === 1 ||
                i === totalPages ||
                Math.abs(i - page) <= 1
            ) {
                pageNumbers.push(i);
            } else if (
                (i === page - 2 && page > 3) ||
                (i === page + 2 && page < totalPages - 2)
            ) {
                pageNumbers.push("...");
            }
        }
        // Remove duplicate ellipsis
        const filtered = pageNumbers.filter((n, i, arr) => n !== "..." || arr[i - 1] !== "...");
        return (
            <nav className="flex justify-center mt-12" aria-label="Pagination">
                <ul className="inline-flex items-center gap-1 bg-white/80 rounded-full px-4 py-2 shadow border border-gray-100">
                    <li>
                        <Link
                            href={`/blog?page=${page - 1}`}
                            aria-disabled={page === 1}
                            tabIndex={page === 1 ? -1 : 0}
                            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${page === 1 ? "text-gray-300 cursor-not-allowed" : "text-[#E91E63] hover:bg-pink-50"}`}
                        >
                            Prev
                        </Link>
                    </li>
                    {filtered.map((n, idx) =>
                        n === "..." ? (
                            <li key={"ellipsis-" + idx} className="px-2 text-gray-400">…</li>
                        ) : (
                            <li key={n}>
                                <Link
                                    href={`/blog?page=${n}`}
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
                            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-[#E91E63] hover:bg-pink-50"}`}
                        >
                            Next
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-pink-50 to-pink-100/60 pb-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-pink-50/30 py-16 md:py-24">
                <div className="absolute inset-x-0 top-0 h-44 bg-[#FCE4EC] opacity-80 blur-3xl"></div>
                <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#E91E63] mb-3">
                        The Luxe Journal
                    </p>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight drop-shadow-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                        Stories, styling tips, and jewelry inspiration.
                    </h1>
                    <p className="mx-auto max-w-2xl text-sm md:text-base text-gray-500 font-medium leading-7">
                        Dive into our latest articles to discover jewelry care advice, seasonal styling ideas, and the newest trends in luxury accessories.
                    </p>
                    <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 sm:gap-4">
                        <span className="rounded-full border border-pink-100 bg-white/80 px-4 py-2 font-semibold text-[#c2185b] shadow-sm">
                            {count || 0} articles
                        </span>
                        <span className="rounded-full border border-gray-100 bg-white/80 px-4 py-2 font-medium">
                            {totalPages} page{totalPages === 1 ? "" : "s"}
                        </span>
                        <span className="rounded-full border border-gray-100 bg-white/80 px-4 py-2 font-medium">
                            Updated weekly
                        </span>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                {!blogs || blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Coming soon!</p>
                        <p className="text-gray-400 text-sm mt-1">We&apos;re working on some amazing content for you.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {blogs.map((blog, index) => (
                                <Link
                                    href={`/blog/${blog.slug}`}
                                    key={blog.id}
                                    className="group"
                                >
                                    <article className="flex h-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
                                        <div className="relative aspect-14/9 overflow-hidden bg-gray-100">
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
                                                <div className="flex h-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E63]">
                                                <span className="rounded-full bg-pink-50 px-3 py-1 text-[#C2185B] border border-pink-100">{blog.author}</span>
                                                <time className="text-gray-400">{formatDate(blog.date_posted)}</time>
                                            </div>

                                            <h2 className="min-h-20 text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#E91E63] tracking-tight">
                                                {blog.title}
                                            </h2>

                                            {blog.description && (
                                                <p className="mt-4 text-sm leading-relaxed text-gray-600 line-clamp-3">{blog.description}</p>
                                            )}

                                            <div className="mt-auto pt-6">
                                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E91E63]">
                                                    Read Article
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                        <Pagination />
                    </>
                )}
            </section>
        </div>
    );
}
