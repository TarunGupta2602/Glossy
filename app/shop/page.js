import ShopClient from "../components/ShopClient";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { fetchShopProducts } from "@/lib/shopQueries";
import { getReviewCounts } from "@/lib/reviewCounts";
import { attachHoverImages } from "@/lib/hoverImages";
import { buildShopItemListSchema } from "@/lib/itemListSchema";
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
    // Filters + pagination should not compete with brand/homepage in GSC.
    const isPaginated = pageNum > 1 && !hasFilters;
    const canonical = hasFilters || isPaginated ? "/shop" : "/shop";
    const title = isPaginated
        ? `Shop Anti-Tarnish Earrings & Necklaces (Page ${pageNum})`
        : `Shop Anti-Tarnish Earrings & Necklaces`;

    return {
        title,
        description:
            "Browse the anti-tarnish jewellery catalogue — waterproof earrings, necklaces, bracelets and rings. Filter by category, Buy 2 Get 1 Free, free shipping over ₹1000.",
        alternates: { canonical },
        robots: hasFilters || isPaginated
            ? { index: false, follow: true }
            : { index: true, follow: true, "max-image-preview": "large" },
        openGraph: {
            title: "Shop Anti-Tarnish Earrings & Necklaces",
            description:
                "Full catalogue of waterproof earrings, necklaces, bracelets and rings — filter, sort, and shop with Buy 2 Get 1 Free.",
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

    const productsWithDiscounts = await attachHoverImages(
        supabase,
        products.map(withCalculatedDiscount)
    );
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
                <Breadcrumbs items={[{ label: "Shop anti-tarnish jewellery" }]} />
            </section>

            <section className={`${SITE_CONTAINER} pt-2 pb-3 text-center`}>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-light text-gray-950 tracking-tighter mb-3 md:mb-4">Shop anti-tarnish jewellery</h1>
                <p className="text-sm md:text-base text-gray-500 font-normal leading-relaxed max-w-2xl mx-auto mb-4">
                    This is the full catalogue — filter by category and price, then add two paid pieces for Buy 2 Get 1 Free. For a faster start, open a dedicated edit instead of scrolling the whole grid.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    <Link href="/earrings" className="inline-flex min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Earrings
                    </Link>
                    <Link href="/necklaces" className="inline-flex min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Necklaces
                    </Link>
                    <Link href="/bracelets" className="inline-flex min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Bracelets
                    </Link>
                    <Link href="/rings" className="inline-flex min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Rings
                    </Link>
                    <Link href="/gifts/under-499" className="inline-flex min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Gifts under ₹499
                    </Link>
                    <Link href="/festive/diwali" className="inline-flex min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Diwali
                    </Link>
                    <Link href="/festive/navratri" className="inline-flex min-h-9 items-center rounded-full border border-gray-200 px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]">
                        Navratri
                    </Link>
                </div>
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
