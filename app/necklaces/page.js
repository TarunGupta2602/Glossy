import CollectionPageContent from "../components/CollectionPageContent";
import CategoryBuyingGuide from "../components/CategoryBuyingGuide";
import { redirect } from "next/navigation";
import { findNecklacesCategory } from "@/lib/categoryLanding";
import { BRAND_URL } from "@/lib/constants";
import { NECKLACES_GUIDE } from "@/lib/categoryGuides";
import { getStorefrontCatalog, reviewCountsFor, sliceMatchedProducts } from "@/lib/storefrontCatalog";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const isPaginated = pageNum > 1;
    const canonical = "/necklaces";

    return {
        title: isPaginated
            ? `Waterproof Everyday Necklace India (Page ${pageNum})`
            : "Waterproof Everyday Necklace India",
        description:
            "Waterproof everyday necklace for India — anti-tarnish 18k gold plated pendants, fine chains & layers. Buy 2 Get 1 Free + shipping from ₹50.",
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
            title: "Waterproof Everyday Necklace India",
            description:
                "A waterproof everyday necklace for Indian weather — layer, gift, and wear without constant polishing.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

const PAGE_SIZE = 12;

export default async function NecklacesPage({ searchParams }) {
    const params = await searchParams;
    const rawPage = params?.page;
    if (rawPage === "1" || rawPage === "0") redirect("/necklaces");
    const page = parseInt(rawPage || "1", 10);
    if (isNaN(page) || page < 1) redirect("/necklaces");

    const { categories, products: catalog, reviewCounts: allReviewCounts } = await getStorefrontCatalog();
    const category = findNecklacesCategory(categories);
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

    const pageTitle = "Waterproof everyday necklace for India";
    const pageDescription =
        "A waterproof everyday necklace for Indian weather — lightweight 18k gold plated anti-tarnish pendants and fine chains you can layer from commute to festive dinner. Buy 2 Get 1 Free, shipping from ₹50.";

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.theluxejewels.in" },
            { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.theluxejewels.in/shop" },
            { "@type": "ListItem", position: 3, name: pageTitle, item: "https://www.theluxejewels.in/necklaces" },
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
                pagination={totalPages > 1 ? { basePath: "/necklaces", page, totalPages } : null}
                otherCategories={otherCategories}
            />

            <CategoryBuyingGuide guide={NECKLACES_GUIDE} />
        </section>
    );
}
