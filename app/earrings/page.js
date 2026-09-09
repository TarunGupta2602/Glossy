import { getServiceClient } from "@/lib/supabaseServiceClient";
import CollectionPageContent from "../components/CollectionPageContent";
import CategoryBuyingGuide from "../components/CategoryBuyingGuide";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { findEarringsCategory } from "@/lib/categoryLanding";
import { BRAND_URL } from "@/lib/constants";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { EARRINGS_GUIDE } from "@/lib/categoryGuides";
import { attachHoverImages } from "@/lib/hoverImages";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const isPaginated = pageNum > 1;
    // Keep one indexable URL for the category (match shop/blog policy)
    const canonical = "/earrings";

    return {
        title: isPaginated
            ? `Anti-Tarnish Waterproof Earrings India (Page ${pageNum})`
            : "Anti-Tarnish Waterproof Earrings for Daily Wear",
        description:
            "Shop anti-tarnish waterproof earrings for daily wear in India — hypoallergenic 18k gold plated studs, hoops & drops. Free shipping over ₹1000 + Buy 2 Get 1 Free.",
        alternates: { canonical },
        robots: isPaginated
            ? { index: false, follow: true }
            : {
                  index: true,
                  follow: true,
                  "max-image-preview": "large",
                  "max-snippet": -1,
              },
        openGraph: {
            title: "Anti-Tarnish Waterproof Earrings for Daily Wear",
            description:
                "Hypoallergenic 18k gold plated studs, hoops, and drops made for everyday wear in Indian weather.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

const PAGE_SIZE = 12;

export default async function EarringsPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const rawPage = params?.page;
    if (rawPage === "1" || rawPage === "0") redirect("/earrings");
    const page = parseInt(rawPage || "1", 10);
    if (isNaN(page) || page < 1) redirect("/earrings");

    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug, image_url, description");
    const category = findEarringsCategory(categories);
    const otherCategories = (categories || []).filter((c) => c.id !== category?.id);

    let products = [];
    let count = 0;

    if (category?.id) {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const [countResult, productsResult] = await Promise.all([
            supabase
                .from("products")
                .select("id", { count: "exact", head: true })
                .eq("category_id", category.id),
            supabase
                .from("products")
                .select(PRODUCT_CARD_SELECT)
                .eq("category_id", category.id)
                .order("created_at", { ascending: false })
                .range(from, to),
        ]);

        count = countResult.count || 0;
        products = productsResult.data || [];
    }

    const productsWithDiscounts = await attachHoverImages(
        supabase,
        products.map(withCalculatedDiscount)
    );
    const totalPages = Math.ceil(count / PAGE_SIZE) || 1;
    const reviewCounts = await getReviewCounts(
        productsWithDiscounts.map((p) => p.id)
    );

    const pageTitle = "Anti-Tarnish Waterproof Earrings";
    const pageDescription =
        category?.description ||
        "Hypoallergenic 18k gold plated studs, hoops & drops made for Indian humidity — wear them to office, college, and evenings without babysitting the shine. Buy 2 Get 1 Free across the store.";

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.theluxejewels.in" },
            { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.theluxejewels.in/shop" },
            { "@type": "ListItem", position: 3, name: pageTitle, item: "https://www.theluxejewels.in/earrings" },
        ],
    };

    return (
        <section className="pb-10 md:pb-14 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <CollectionPageContent
                breadcrumbs={[{ label: "Shop", href: "/shop" }, { label: pageTitle }]}
                heroImageUrl={category?.image_url}
                title={pageTitle}
                description={pageDescription}
                count={count}
                showingCount={productsWithDiscounts.length}
                products={productsWithDiscounts}
                reviewCounts={reviewCounts}
                pagination={totalPages > 1 ? { basePath: "/earrings", page, totalPages } : null}
                otherCategories={otherCategories}
            />

            <CategoryBuyingGuide guide={EARRINGS_GUIDE} />
        </section>
    );
}
