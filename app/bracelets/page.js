import { getServiceClient } from "@/lib/supabaseServiceClient";
import CollectionPageContent from "../components/CollectionPageContent";
import CategoryBuyingGuide from "../components/CategoryBuyingGuide";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { findBraceletsCategory, productMatchesBracelets } from "@/lib/categoryLanding";
import { BRAND_URL } from "@/lib/constants";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { BRACELETS_GUIDE } from "@/lib/categoryGuides";
import { attachHoverImages } from "@/lib/hoverImages";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const isPaginated = pageNum > 1;
    const canonical = "/bracelets";

    return {
        title: isPaginated
            ? `Daily Wear Bracelet India (Page ${pageNum})`
            : "Daily Wear Bracelet India",
        description:
            "Slim anti-tarnish bangles and cuffs for daily wear in India, plus bangle-and-ring sets. Cash on delivery or UPI. Free shipping over ₹1000.",
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
            title: "Daily Wear Bracelet India",
            description:
                "Daily wear bracelet and trendy cuffs for India — waterproof anti-tarnish styles for office to evening.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

const PAGE_SIZE = 12;

export default async function BraceletsPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const rawPage = params?.page;
    if (rawPage === "1" || rawPage === "0") redirect("/bracelets");
    const page = parseInt(rawPage || "1", 10);
    if (isNaN(page) || page < 1) redirect("/bracelets");

    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug, image_url, description");
    const category = findBraceletsCategory(categories);
    const otherCategories = (categories || []).filter((c) => c.id !== category?.id);

    const { data: catalog } = await supabase
        .from("products")
        .select(PRODUCT_CARD_SELECT)
        .order("created_at", { ascending: false });

    const matched = (catalog || []).filter((product) =>
        productMatchesBracelets(product, category?.id)
    );
    const count = matched.length;
    const products = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const productsWithDiscounts = await attachHoverImages(
        supabase,
        products.map(withCalculatedDiscount)
    );
    const totalPages = Math.ceil(count / PAGE_SIZE) || 1;
    const reviewCounts = await getReviewCounts(
        productsWithDiscounts.map((p) => p.id)
    );

    const pageTitle = "Daily wear bracelet for India";
    const pageDescription =
        "Shop slim anti-tarnish bangles and cuffs for Indian office days — screw-motif, mother-of-pearl, and crystal-edge styles, plus matching bangle-and-ring sets. Cash on delivery or UPI. Free shipping over ₹1000.";

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

            <CategoryBuyingGuide guide={BRACELETS_GUIDE} />
        </section>
    );
}
