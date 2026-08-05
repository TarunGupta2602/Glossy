import CategoryPagination from "../components/CategoryPagination";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import SeoIntro from "../components/SeoIntro";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { findNecklacesCategory } from "@/lib/categoryLanding";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Premium Anti-Tarnish Necklaces | Waterproof Gold Chains",
    description: "Discover the finest anti-tarnish necklaces in India. Our collection includes waterproof 18k gold plated chains, pendants, and layered sets designed for everyday elegance.",
    alternates: {
        canonical: "/necklaces",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Anti-Tarnish Necklaces | Luxury Waterproof Jewellery | The Luxe Jewels",
        description: "Luminous accents for every style. Handcrafted waterproof fine necklaces. Designed to never fade.",
        url: "https://www.theluxejewels.in/necklaces",
        siteName: "The Luxe Jewels",
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
};

const PAGE_SIZE = 12;

export default async function NecklacesPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/necklaces?page=1");

    const { data: categories } = await supabase.from("categories").select("id, name, slug");
    const category = findNecklacesCategory(categories);

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
            { "@type": "ListItem", "position": 3, "name": "Anti-Tarnish Necklaces", "item": "https://www.theluxejewels.in/necklaces" },
        ],
    };

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Anti-Tarnish Necklaces" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Anti-Tarnish Necklaces</h1>
                    <p className="text-gray-500 max-w-xl mx-auto italic font-medium">Timeless chains. Sustainable luxury. Designed to never fade.</p>
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
                <CategoryPagination basePath="/necklaces" page={page} totalPages={totalPages} />
            )}

            <SeoIntro
                title="Elegant Anti-Tarnish Necklaces for Modern Styling"
                links={[
                    { href: "/shop", label: "Fine Jewellery Collections" },
                    { href: "/earrings", label: "Premium Earrings" },
                ]}
            >
                <p>
                    Shop anti-tarnish necklaces from delicate 18k gold plated chains to bold statement pendants.
                    Waterproof, sweat-proof, and designed for everyday elegance across India.
                </p>
            </SeoIntro>
        </section>
    );
}
