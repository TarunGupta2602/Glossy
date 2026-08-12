import ShopClient from "../components/ShopClient";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { fetchShopProducts } from "@/lib/shopQueries";
import { getReviewCounts } from "@/lib/reviewCounts";
import { buildShopItemListSchema } from "@/lib/itemListSchema";
import { getPaginatedCanonical } from "@/lib/seo";
import { BRAND_URL } from "@/lib/constants";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const hasFilters = Boolean(
        params?.category ||
        (params?.min && params.min !== "0") ||
        (params?.max && params.max !== "5000") ||
        (params?.sort && params.sort !== "newest")
    );
    // Paginated pages self-canonicalize; filtered views consolidate to /shop (or page N)
    const canonical = getPaginatedCanonical("/shop", hasFilters ? 1 : pageNum);
    const title =
        pageNum > 1 && !hasFilters
            ? `Shop All Anti-Tarnish Jewellery (Page ${pageNum})`
            : "Shop All Anti-Tarnish Jewellery Online | Full Catalogue";

    return {
        title,
        description:
            "Browse the complete The Luxe Jewels catalogue — every anti-tarnish earring, necklace, bracelet, and ring in one place. Filter by style, sort by newest, and shop waterproof everyday luxury with pan-India delivery.",
        alternates: { canonical },
        robots: hasFilters
            ? { index: false, follow: true }
            : { index: true, follow: true, "max-image-preview": "large" },
        openGraph: {
            title: "Shop All Jewellery | Full Anti-Tarnish Catalogue",
            description:
                "Browse every piece in The Luxe Jewels catalogue — waterproof earrings, necklaces, and more with pan-India shipping.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const sort = params?.sort || "newest";
    const categoryIds = params?.category ? String(params.category).split(",").filter(Boolean) : [];
    const minPrice = parseInt(params?.min || "0", 10) || 0;
    const maxPrice = parseInt(params?.max || "5000", 10) || 5000;

    if (isNaN(page) || page < 1) redirect("/shop?page=1");

    const supabase = getServiceClient();

    const [{ data: categories }, shopResult] = await Promise.all([
        supabase
            .from("categories")
            .select("id, name, slug")
            .order("name", { ascending: true }),
        fetchShopProducts({
            page,
            sort,
            categoryIds,
            minPrice,
            maxPrice,
        }),
    ]);

    const { products, totalCount, totalPages } = shopResult;

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
            <section className={`${SITE_CONTAINER} pt-6 md:pt-8`}>
                <Breadcrumbs items={[{ label: "Shop All Collections" }]} />
            </section>

            <section className={`${SITE_CONTAINER} pt-2 pb-3 text-center`}>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-light text-gray-950 tracking-tighter mb-3 md:mb-4">Shop All Collections</h1>
                <p className="text-sm md:text-base text-gray-500 font-normal leading-relaxed max-w-2xl mx-auto">
                    Explore our latest curation of anti-tarnish jewellery and hand-crafted fine jewellery.
                </p>
            </section>

            <section className={`${SITE_CONTAINER} pb-20 md:pb-24`}>
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
            </section>
        </main>
    );
}
