import { getServiceClient } from "@/lib/supabaseServiceClient";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { attachHoverImages } from "@/lib/hoverImages";
import { BRAND_URL } from "@/lib/constants";
import GiftLandingContent from "../../components/GiftLandingContent";

export const revalidate = 300;

const MAX = 499;

export const metadata = {
    title: `Jewellery Gifts Under ₹499`,
    description:
        "Everyday anti-tarnish jewellery gifts under ₹499 — waterproof earrings and chains she’ll actually wear. Gift wrap included. Buy 2 Get 1 Free.",
    alternates: { canonical: "/gifts/under-499" },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Jewellery Gifts Under ₹499",
        description:
            "Everyday anti-tarnish jewellery gifts under ₹499 — wrap included, Buy 2 Get 1 Free.",
        url: `${BRAND_URL}/gifts/under-499`,
        siteName: "The Luxe Jewels",
        images: [{ url: "/festive/gifts-under-499-hero.jpg", width: 1280, height: 720 }],
        type: "website",
    },
};

export default async function GiftsUnder499Page() {
    const supabase = getServiceClient();
    const { data } = await supabase
        .from("products")
        .select(PRODUCT_CARD_SELECT)
        .gt("price", 0)
        .lte("price", MAX)
        .order("is_bestseller", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(24);

    const products = await attachHoverImages(
        supabase,
        (data || []).map(withCalculatedDiscount)
    );
    const reviewCounts = await getReviewCounts(products.map((p) => p.id));

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BRAND_URL },
            {
                "@type": "ListItem",
                position: 2,
                name: "Gifts under ₹499",
                item: `${BRAND_URL}/gifts/under-499`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <GiftLandingContent
                title="Jewellery gifts under ₹499"
                subtitle="Everyday anti-tarnish studs, chains and bracelets under ₹499 — wrap included. For a festival look, open the Diwali or Navratri edit."
                maxPrice={MAX}
                heroImage="/festive/gifts-under-499-hero.jpg"
                products={products}
                reviewCounts={reviewCounts}
                breadcrumbs={[{ label: "Gifts under ₹499" }]}
            />
        </>
    );
}
