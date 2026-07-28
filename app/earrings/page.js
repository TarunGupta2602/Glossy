import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import { redirect } from "next/navigation";
import { calculateDiscount } from "@/lib/discountUtils";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Premium Anti-Tarnish Earrings | 18k Gold Plated",
    description: "Shop the best anti-tarnish earrings in India. Our collection features waterproof, hypoallergenic 18k gold plated studs, hoops, and statement drops for daily wear.",
    alternates: {
        canonical: "/earrings",
    },
    keywords: [
        "anti tarnish earrings india",
        "gold plated earrings online",
        "waterproof earrings for daily wear",
        "hypoallergenic earrings for sensitive skin",
        "18k gold earrings india",
        "minimalist earrings brand",
        "buy luxury earrings online india"
    ],
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Anti-Tarnish Earrings | Waterproof & Hypoallergenic | The luxe jewels",
        description: "Ethical and elegant waterproof earrings handcrafted for the modern individual. Tarnish-free 18k gold plating.",
        url: "https://www.theluxejewels.in/earrings",
        siteName: "The luxe jewels",
        images: [{ url: "/logo.png" }],
        type: "website",
    },
};

// Pagination settings
const PAGE_SIZE = 12;

export default async function EarringsPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/earrings?page=1");
    const slug = "-statement-piecess";

    const { data: category } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", slug)
        .single();

    // Get total count
    const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", category?.id);

    // Get paginated products
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", category?.id)
        .order("created_at", { ascending: false })
        .range(from, to);

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
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Anti-Tarnish Earrings",
                "item": "https://www.theluxejewels.in/earrings"
            }
        ]
    };

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Anti-Tarnish Earrings" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Anti-Tarnish Earrings</h1>
                    <p className="text-gray-500 max-w-xl mx-auto italic font-medium">Waterproof. Everyday-proof. Crafted for the modern individual.</p>
                </div>
                {!products || products.length === 0 ? (
                    <p className="text-center text-gray-500 font-medium py-12">Coming Soon.</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {productsWithDiscounts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <section className="pt-12">
                    <nav className="flex justify-center" aria-label="Pagination">
                        <ul className="inline-flex items-center gap-1 bg-white/80 rounded-full px-4 py-2 shadow border border-gray-100">
                            <li>
                                <Link
                                    href={`/earrings?page=${page - 1}`}
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
                                        href={`/earrings?page=${n}`}
                                        aria-current={n === page ? "page" : undefined}
                                        className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${n === page ? "bg-[#E91E63] text-white shadow" : "text-[#E91E63] hover:bg-pink-50"}`}
                                    >
                                        {n}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href={`/earrings?page=${page + 1}`}
                                    aria-disabled={page === totalPages}
                                    tabIndex={page === totalPages ? -1 : 0}
                                    className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-[#E91E63] hover:bg-pink-50"}`}
                                >
                                    Next
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </section>
            )}

            {/* SEO Footnote - Visually Hidden */}
            <div className="sr-only">
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Premium Anti-Tarnish Earrings for Women</h2>
                <p>
                    Explore our premium collection of **anti-tarnish earrings**, ranging from everyday minimalist studs to statement-making drops.
                    Each piece at <Link href="/" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels</Link> is crafted with intentional design,
                    using fine materials like recycled silver and high-quality 18k gold plating. Our jewelry is designed to be **waterproof and sweat-proof**,
                    making it perfect for daily wear in India.
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Craftsmanship and Sustainable Quality</h2>
                <p>
                    We pride ourselves on delivering <Link href="/shop" className="text-gray-900 transition-colors font-semibold">luxury fine jewelry</Link> that doesn&apos;t compromise on ethical standards.
                    Whether you&apos;re looking for classic hoops or modern sculptural earrings, our jewelry is created to elevate your look
                    while remaining timeless. Browse our <Link href="/necklaces" className="text-gray-900 transition-colors font-semibold">fine necklaces</Link> collection too to complete your signature look.
                </p>
            </div>
        </section>
    );
}