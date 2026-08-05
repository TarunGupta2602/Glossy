import CategoryPagination from "../components/CategoryPagination";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import SeoIntro from "../components/SeoIntro";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { findEarringsCategory } from "@/lib/categoryLanding";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Premium Anti-Tarnish Earrings | 18k Gold Plated",
    description: "Shop the best anti-tarnish earrings in India. Our collection features waterproof, hypoallergenic 18k gold plated studs, hoops, and statement drops for daily wear.",
    alternates: {
        canonical: "/earrings",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Anti-Tarnish Earrings | Waterproof & Hypoallergenic | The Luxe Jewels",
        description: "Ethical and elegant waterproof earrings handcrafted for the modern individual. Tarnish-free 18k gold plating.",
        url: "https://www.theluxejewels.in/earrings",
        siteName: "The Luxe Jewels",
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
};

const PAGE_SIZE = 12;

export default async function EarringsPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/earrings?page=1");

    const { data: categories } = await supabase.from("categories").select("id, name, slug");
    const category = findEarringsCategory(categories);

    let products = [];
    let count = 0;

    if (category?.id) {
        const countResult = await supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("category_id", category.id);
        count = countResult.count || 0;

        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data } = await supabase
            .from("products")
            .select("*, categories(name, id, slug)")
            .eq("category_id", category.id)
            .order("created_at", { ascending: false })
            .range(from, to);
        products = data || [];
    }

    const productsWithDiscounts = products.map(withCalculatedDiscount);
    const totalPages = Math.ceil(count / PAGE_SIZE);
    const reviewCounts = await getReviewCounts(productsWithDiscounts.map((p) => p.id));

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.theluxejewels.in" },
            { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.theluxejewels.in/shop" },
            { "@type": "ListItem", "position": 3, "name": "Anti-Tarnish Earrings", "item": "https://www.theluxejewels.in/earrings" },
        ],
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
                {!products.length ? (
                    <p className="text-center text-gray-500 font-medium py-12">Coming Soon.</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {productsWithDiscounts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                reviewCount={reviewCounts[product.id] || 0}
                            />
                        ))}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <CategoryPagination basePath="/earrings" page={page} totalPages={totalPages} />
            )}

            <SeoIntro
                title="Premium Anti-Tarnish Earrings for Women"
                links={[
                    { href: "/shop", label: "Shop All Jewellery" },
                    { href: "/necklaces", label: "Fine Necklaces" },
                ]}
            >
                <p>
                    Explore our collection of anti-tarnish earrings — from minimalist studs to statement drops.
                    Each piece is waterproof, sweat-proof, and crafted with 18k gold plating for daily wear in India.
                </p>
            </SeoIntro>
        </section>
    );
}
