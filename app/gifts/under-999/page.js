import { getServiceClient } from "@/lib/supabaseServiceClient";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { attachHoverImages } from "@/lib/hoverImages";
import { BRAND_URL } from "@/lib/constants";
import { PROMO_LABEL } from "@/lib/promo";
import GiftLandingContent from "../../components/GiftLandingContent";

export const revalidate = 300;

const MAX = 999;

export const metadata = {
    title: `Jewellery Gifts Under ₹999 | Anti-Tarnish Edit · ${PROMO_LABEL}`,
    description:
        "Curated anti-tarnish jewellery gifts under ₹999 — earrings, necklaces & bracelets for Raksha Bandhan, Friendship Day, and everyday gifting in India. Buy 2 Get 1 Free.",
    alternates: { canonical: "/gifts/under-999" },
    openGraph: {
        title: "Jewellery Gifts Under ₹999 | The Luxe Jewels",
        description:
            "Gift-ready waterproof jewellery under ₹999 — shoppable picks with Buy 2 Get 1 Free.",
        url: `${BRAND_URL}/gifts/under-999`,
        siteName: "The Luxe Jewels",
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
};

export default async function GiftsUnder999Page() {
    const supabase = getServiceClient();
    const { data } = await supabase
        .from("products")
        .select(PRODUCT_CARD_SELECT)
        .gt("price", 0)
        .lte("price", MAX)
        .order("is_bestseller", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(32);

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
                name: "Gifts under ₹999",
                item: `${BRAND_URL}/gifts/under-999`,
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
                title="Jewellery gifts under ₹999"
                subtitle="Festive-ready and everyday-friendly anti-tarnish jewellery under ₹999 — perfect for Raksha Bandhan, Friendship Day, and thoughtful year-round gifting."
                maxPrice={MAX}
                products={products}
                reviewCounts={reviewCounts}
                breadcrumbs={[{ label: "Gifts under ₹999" }]}
            />
        </>
    );
}
