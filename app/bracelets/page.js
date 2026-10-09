import CollectionPageContent from "../components/CollectionPageContent";
import CategoryBuyingGuide from "../components/CategoryBuyingGuide";
import { BRACELETS_GUIDE } from "@/lib/categoryGuides";
import { redirect } from "next/navigation";
import { findBraceletsCategory, productMatchesBracelets } from "@/lib/categoryLanding";
import { BRAND_URL } from "@/lib/constants";
import { getStorefrontCatalog, reviewCountsFor, sliceMatchedProducts } from "@/lib/storefrontCatalog";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const isPaginated = pageNum > 1;
    const canonical = "/bracelets";

    return {
        title: isPaginated
            ? `Anti-Tarnish Bracelet (Page ${pageNum})`
            : "Anti-Tarnish Bracelet for Daily Wear",
        description:
            "Anti-tarnish bracelet for daily wear — slim bangles and cuffs, plus bangle-and-ring sets. Cash on delivery. Flat ₹50 shipping.",
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
            title: "Anti-Tarnish Bracelet for Daily Wear",
            description:
                "Slim anti-tarnish bangles and cuffs for office to evening. Flat ₹50 shipping.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

const PAGE_SIZE = 12;

export default async function BraceletsPage({ searchParams }) {
    const params = await searchParams;
    const rawPage = params?.page;
    if (rawPage === "1" || rawPage === "0") redirect("/bracelets");
    const page = parseInt(rawPage || "1", 10);
    if (isNaN(page) || page < 1) redirect("/bracelets");

    const { categories, products: catalog, reviewCounts: allReviewCounts } = await getStorefrontCatalog();
    const category = findBraceletsCategory(categories);
    const otherCategories = (categories || []).filter((c) => c.id !== category?.id);
    const sliced = sliceMatchedProducts(
        catalog,
        (product) => productMatchesBracelets(product, category?.id),
        page,
        PAGE_SIZE
    );
    const productsWithDiscounts = sliced.products;
    const count = sliced.count;
    const totalPages = sliced.totalPages;
    const reviewCounts = reviewCountsFor(allReviewCounts, productsWithDiscounts);

    const pageTitle = "Anti-tarnish bracelet for daily wear";
    const pageDescription =
        "Slim bangles and cuffs for office days — screw-motif, mother-of-pearl, and crystal-edge styles, plus matching bangle-and-ring sets. Cash on delivery. Flat ₹50 shipping.";

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.theluxejewels.in" },
            { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.theluxejewels.in/shop" },
            { "@type": "ListItem", position: 3, name: pageTitle, item: "https://www.theluxejewels.in/bracelets" },
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
                pagination={totalPages > 1 ? { basePath: "/bracelets", page, totalPages } : null}
                otherCategories={otherCategories}
            />
            {page === 1 ? <CategoryBuyingGuide guide={BRACELETS_GUIDE} /> : null}
        </section>
    );
}
