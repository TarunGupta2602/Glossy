import CollectionPageContent from "../components/CollectionPageContent";
import CategoryBuyingGuide from "../components/CategoryBuyingGuide";
import { EARRINGS_GUIDE } from "@/lib/categoryGuides";
import { redirect } from "next/navigation";
import { findEarringsCategory } from "@/lib/categoryLanding";
import { BRAND_URL } from "@/lib/constants";
import { getStorefrontCatalog, reviewCountsFor, sliceMatchedProducts } from "@/lib/storefrontCatalog";

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
            ? `Anti-Tarnish Earrings India (Page ${pageNum})`
            : "Anti-Tarnish Earrings",
        description:
            "Anti-tarnish earrings for daily wear — studs, hoops and drops in an 18k gold plated finish. Buy 2 Get 1 Free. Flat ₹50 shipping.",
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
            title: "Anti-Tarnish Earrings",
            description:
                "Anti-tarnish studs, hoops and drops for office, college, and evenings. Flat ₹50 shipping.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

const PAGE_SIZE = 12;

export default async function EarringsPage({ searchParams }) {
    const params = await searchParams;
    const rawPage = params?.page;
    if (rawPage === "1" || rawPage === "0") redirect("/earrings");
    const page = parseInt(rawPage || "1", 10);
    if (isNaN(page) || page < 1) redirect("/earrings");

    const { categories, products: catalog, reviewCounts: allReviewCounts } = await getStorefrontCatalog();
    const category = findEarringsCategory(categories);
    const otherCategories = (categories || []).filter((c) => c.id !== category?.id);
    const sliced = sliceMatchedProducts(
        catalog,
        (product) => category?.id && product.category_id === category.id,
        page,
        PAGE_SIZE
    );
    const productsWithDiscounts = sliced.products;
    const count = sliced.count;
    const totalPages = sliced.totalPages;
    const reviewCounts = reviewCountsFor(allReviewCounts, productsWithDiscounts);

    const pageTitle = "Anti-tarnish earrings";
    const pageDescription =
        "Studs, small hoops, and drops in an 18k gold plated anti-tarnish finish for office to festive nights. Buy 2 Get 1 Free. Flat ₹50 shipping across India.";

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
            {page === 1 ? <CategoryBuyingGuide guide={EARRINGS_GUIDE} /> : null}
        </section>
    );
}
