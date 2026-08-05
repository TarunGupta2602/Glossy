import ShopClient from "../components/ShopClient";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import SeoIntro from "../components/SeoIntro";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { fetchShopProducts } from "@/lib/shopQueries";
import { getReviewCounts } from "@/lib/reviewCounts";
import { buildShopItemListSchema } from "@/lib/itemListSchema";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Shop All Fine Jewellery | Buy Anti-Tarnish & Waterproof Jewellery",
    description: "Explore our full collection of premium anti-tarnish, waterproof, and handcrafted jewellery at The Luxe Jewels. From ethical earrings to gold plated necklaces, find everyday luxury.",
    alternates: { canonical: "/shop" },
    openGraph: {
        title: "Shop All Fine Jewellery | Premium & Sustainable | The Luxe Jewels",
        description: "Handcrafted ethical fine jewellery. Modern designs, sustainable luxury, and waterproof durability.",
        url: "https://www.theluxejewels.in/shop",
        siteName: "The Luxe Jewels",
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
};

export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const sort = params?.sort || "newest";
    const categoryIds = params?.category ? String(params.category).split(",").filter(Boolean) : [];
    const minPrice = parseInt(params?.min || "0", 10) || 0;
    const maxPrice = parseInt(params?.max || "5000", 10) || 5000;

    if (isNaN(page) || page < 1) redirect("/shop?page=1");

    const supabase = getServiceClient();
    const { data: categories } = await supabase.from("categories").select("*").order("name", { ascending: true });

    const { products, totalCount, totalPages } = await fetchShopProducts({
        page,
        sort,
        categoryIds,
        minPrice,
        maxPrice,
    });

    if (page > totalPages && totalCount > 0) {
        redirect(`/shop?page=${totalPages}`);
    }

    const productsWithDiscounts = products.map(withCalculatedDiscount);
    const reviewCounts = await getReviewCounts(productsWithDiscounts.map((p) => p.id));

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.theluxejewels.in" },
            { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.theluxejewels.in/shop" },
        ],
    };

    const itemListJsonLd = buildShopItemListSchema({
        products: productsWithDiscounts,
        totalCount,
        page,
    });

    return (
        <main className="min-h-screen bg-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
            <section className="pt-10 px-6 md:px-12 max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Shop All Collections" }]} />
            </section>

            <section className="pt-5 pb-5 px-6 md:px-12 text-center max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-light text-gray-950 tracking-tighter mb-8">Shop All Collections</h1>
                <p className="text-base md:text-lg text-gray-500 font-normal leading-relaxed max-w-2xl mx-auto">
                    Explore our latest curation of anti-tarnish jewellery and hand-crafted fine jewellery.
                </p>
            </section>

            <section className="pb-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <ShopClient
                        products={productsWithDiscounts}
                        categories={categories || []}
                        totalCount={totalCount}
                        totalPages={totalPages}
                        currentPage={page}
                        sortBy={sort}
                        selectedCategories={categoryIds}
                        priceRange={[minPrice, maxPrice]}
                        reviewCounts={reviewCounts}
                    />
                </div>
            </section>

            <SeoIntro
                title="Premium Anti-Tarnish & Fine Jewellery"
                links={[
                    { href: "/earrings", label: "18k Gold Plated Earrings" },
                    { href: "/necklaces", label: "Daily Wear Fine Necklaces" },
                    { href: "/our-story", label: "Our Story" },
                ]}
            >
                <p>
                    Welcome to The Luxe Jewels shop — a curated selection of anti-tarnish, waterproof, and everyday wear jewellery
                    crafted for modern luxury in India.
                </p>
            </SeoIntro>
        </main>
    );
}
