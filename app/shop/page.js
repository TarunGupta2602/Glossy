import ShopClient from "../components/ShopClient";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import Breadcrumbs from "../components/Breadcrumbs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BRAND_URL } from "@/lib/constants";
import { buildShopItemListSchema } from "@/lib/itemListSchema";
import {
    getStorefrontCatalog,
    reviewCountsFor,
    sliceShopProducts,
} from "@/lib/storefrontCatalog";

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
    // Filters + pagination should not compete with brand/homepage in GSC.
    const isPaginated = pageNum > 1 && !hasFilters;
    const canonical = hasFilters || isPaginated ? "/shop" : "/shop";
    const title = isPaginated
        ? `Shop Anti-Tarnish Jewellery India (Page ${pageNum})`
        : `Shop Anti-Tarnish Jewellery India`;

    return {
        title,
        description:
            "Shop anti-tarnish jewellery in India — earrings, everyday necklaces, daily-wear bracelets. Buy 2 Get 1 Free + shipping from ₹50.",
        alternates: { canonical },
        robots: hasFilters || isPaginated
            ? { index: false, follow: true }
            : { index: true, follow: true, "max-image-preview": "large" },
        openGraph: {
            title: "Shop Anti-Tarnish Jewellery India",
            description:
                "Full catalogue of anti-tarnish earrings, everyday necklaces, and daily-wear bracelets — Buy 2 Get 1 Free.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const rawPage = params?.page;
    if (rawPage === "0" || rawPage === "1") redirect("/shop");
    const page = parseInt(rawPage || "1", 10);
    const sort = params?.sort || "newest";
    const categoryIds = params?.category ? String(params.category).split(",").filter(Boolean) : [];
    const minPrice = parseInt(params?.min || "0", 10) || 0;
    const maxPrice = parseInt(params?.max || "5000", 10) || 5000;

    if (isNaN(page) || page < 1) redirect("/shop");

    const { categories, products: catalog, reviewCounts: allReviewCounts } = await getStorefrontCatalog();
    const shopResult = sliceShopProducts(catalog, {
        page,
        sort,
        categoryIds,
        minPrice,
        maxPrice,
    });

    const { products: productsWithDiscounts, count: totalCount, totalPages } = shopResult;

    if (page > totalPages && totalCount > 0) {
        redirect(`/shop?page=${totalPages}`);
    }

    const reviewCounts = reviewCountsFor(allReviewCounts, productsWithDiscounts);

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
                <Breadcrumbs items={[{ label: "Shop anti-tarnish jewellery" }]} />
            </section>

            <section className={`${SITE_CONTAINER} pt-1 pb-3 md:text-center`}>
                <h1 className="text-[1.65rem] sm:text-3xl md:text-5xl font-light text-gray-950 tracking-tight md:tracking-tighter mb-2 md:mb-4">Shop anti-tarnish jewellery</h1>
                <p className="text-[13px] md:text-base text-gray-500 font-normal leading-relaxed max-w-2xl md:mx-auto mb-3 line-clamp-2 md:line-clamp-none">
                    The full anti-tarnish catalogue — earrings, everyday necklaces, daily-wear bracelets, and rings. Filter by category, then add two paid pieces for Buy 2 Get 1 Free. Shipping starts at ₹50 and rises with the order.
                </p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap md:justify-center -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
                    <Link href="/earrings" className="inline-flex shrink-0 min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Earrings
                    </Link>
                    <Link href="/necklaces" className="inline-flex shrink-0 min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Necklaces
                    </Link>
                    <Link href="/bracelets" className="inline-flex shrink-0 min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Bracelets
                    </Link>
                    <Link href="/rings" className="inline-flex shrink-0 min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Rings
                    </Link>
                </div>
            </section>

            <section className={`${SITE_CONTAINER} pb-20 md:pb-24`}>
                <ShopClient
                        products={productsWithDiscounts}
                        categories={[...(categories || [])].sort((a, b) =>
                            String(a.name || "").localeCompare(String(b.name || ""))
                        )}
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
