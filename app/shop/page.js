import ShopClient from "../components/ShopClient";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { calculateDiscount } from "@/lib/discountUtils";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Shop All Fine Jewellery | Buy Anti-Tarnish & Waterproof Jewellery",
    description: "Explore our full collection of premium anti-tarnish, waterproof, and handcrafted jewellery at The luxe jewels. From ethical earrings to gold plated necklaces, find everyday luxury.",
    alternates: {
        canonical: "/shop",
    },
    keywords: [
        "shop jewellery online india",
        "buy anti tarnish jewellery",
        "waterproof jewellery shop",
        "18k gold plated accessories",
        "luxury fine jewellery India",
        "minimalist jewellery collection",
        "hypoallergenic jewellery store"
    ],
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Shop All Fine Jewellery | Premium & Sustainable | The luxe jewels",
        description: "Handcrafted ethical fine jewellery. Modern designs, sustainable luxury, and waterproof durability.",
        url: "https://www.theluxejewels.in/shop",
        siteName: "The luxe jewels",
        images: [{ url: "/logo.png" }],
        type: "website",
    },
};

// Pagination settings
const PAGE_SIZE = 12;

export default async function ShopPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/shop?page=1");

    // Get total count
    const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true });

    // Get paginated products
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const [{ data: categories }, { data: products }] = await Promise.all([
        supabase.from("categories").select("*").order("name", { ascending: true }),
        supabase.from("products").select("*, categories(name, id, slug)").order("created_at", { ascending: false }).range(from, to),
    ]);

    // Calculate discounts server-side for each product
    const productsWithDiscounts = (products || []).map(product => ({
        ...product,
        calculated_discount: product.original_price
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : calculateDiscount(product.id)
    }));

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

    // Breadcrumb Schema
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.theluxejewels.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://www.theluxejewels.in/shop"
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <section className="pt-10 px-6 md:px-12 max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Shop All Collections" }]} />
            </section>

            <section className="pt-5 pb-5 px-6 md:px-12 text-center max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-light text-gray-950 tracking-tighter mb-8">
                    Featured Collection
                </h1>
                <p className="text-base md:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                    Explore our latest curation of anti-tarnish jewellery and hand-crafted fine jewellery.

                </p>
            </section>

            <section className="pb-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <ShopClient
                        initialProducts={productsWithDiscounts || []}
                        categories={categories || []}
                    />
                </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <section className="pb-16 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <nav className="flex justify-center" aria-label="Pagination">
                            <ul className="inline-flex items-center gap-1 bg-white/80 rounded-full px-4 py-2 shadow border border-gray-100">
                                <li>
                                    <Link
                                        href={`/shop?page=${page - 1}`}
                                        aria-disabled={page === 1}
                                        tabIndex={page === 1 ? -1 : 0}
                                        className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${page === 1 ? "text-gray-300 cursor-not-allowed" : "text-[#E91E63] hover:bg-pink-50"}`}
                                    >
                                        Prev
                                    </Link>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                    <li key={n}>
                                        <Link
                                            href={`/shop?page=${n}`}
                                            aria-current={n === page ? "page" : undefined}
                                            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${n === page ? "bg-[#E91E63] text-white shadow" : "text-[#E91E63] hover:bg-pink-50"}`}
                                        >
                                            {n}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href={`/shop?page=${page + 1}`}
                                        aria-disabled={page === totalPages}
                                        tabIndex={page === totalPages ? -1 : 0}
                                        className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-[#E91E63] hover:bg-pink-50"}`}
                                    >
                                        Next
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </section>
            )}

            {/* SEO Footnote - Visually Hidden */}
            <section className="sr-only">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm leading-relaxed text-gray-500">
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Premium Anti-Tarnish & Fine Jewellery</h2>
                        <p>
                            Welcome to the <Link href="/shop" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels shop</Link>.
                            We offer a meticulously curated selection of anti-tarnish, waterproof, and everyday wear jewellery blends traditional craftsmanship with modern design.
                            Our pieces are made for jewellery lovers in India who value ethical luxury.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Explore Collections</h3>
                        <ul className="space-y-4">
                            <li><Link href="/earrings" className="hover:text-[#E91E63] transition-colors font-semibold">18k Gold Plated Earrings</Link></li>
                            <li><Link href="/necklaces" className="hover:text-[#E91E63] transition-colors font-semibold">Daily Wear Fine Necklaces</Link></li>
                            <li><Link href="/shop" className="hover:text-[#E91E63] transition-colors font-semibold">New Jewellery Arrivals India</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6">About Our Ethics</h3>
                        <p>
                            At <Link href="/" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels</Link>, every piece in our collection is a testament to our commitment to sustainability.
                            We believe that <Link href="/our-story" className="text-gray-900 transition-colors font-semibold">our story</Link>
                            is defined by the care we put into every design. Shop India&apos;s best **anti-tarnish jewellery** online now.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
