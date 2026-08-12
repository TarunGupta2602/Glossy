import { getServiceClient } from "@/lib/supabaseServiceClient";
import CollectionPageContent from "../components/CollectionPageContent";
import SeoIntro from "../components/SeoIntro";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { findNecklacesCategory } from "@/lib/categoryLanding";
import { getPaginatedCanonical } from "@/lib/seo";
import { BRAND_URL } from "@/lib/constants";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    const pageNum = isNaN(page) || page < 1 ? 1 : page;
    const canonical = getPaginatedCanonical("/necklaces", pageNum);

    return {
        title:
            pageNum > 1
                ? `Gold Plated Anti-Tarnish Necklaces (Page ${pageNum})`
                : "Gold Plated Anti-Tarnish Necklaces for Daily Wear India",
        description:
            "Shop waterproof 18k gold plated necklaces for everyday Indian wear — pendants, layered chains, and anti-tarnish finishes that stay bright. Free delivery on orders over ₹1000.",
        alternates: { canonical },
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
        openGraph: {
            title: "Gold Plated Anti-Tarnish Necklaces | Daily Wear India",
            description:
                "Waterproof pendants and chains designed for everyday elegance — anti-tarnish finishes made for Indian climate and gifting.",
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
    };
}

const PAGE_SIZE = 12;

export default async function NecklacesPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/necklaces?page=1");

    const { data: categories } = await supabase.from("categories").select("id, name, slug, image_url, description");
    const category = findNecklacesCategory(categories);
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

    const productsWithDiscounts = products.map(withCalculatedDiscount);
    const totalPages = Math.ceil(count / PAGE_SIZE) || 1;
    const reviewCounts = await getReviewCounts(productsWithDiscounts.map((p) => p.id));

    const pageTitle = category?.name || "Anti-Tarnish Necklaces";
    const pageDescription =
        category?.description || "Timeless chains. Sustainable luxury. Designed to never fade.";

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

            <SeoIntro
                title="How to choose an everyday anti-tarnish necklace"
                links={[
                    { href: "/earrings", label: "Shop Earrings" },
                    { href: "/shop", label: "Shop All" },
                    {
                        href: "/blog/15-best-bracelets-for-daily-wear-in-india-2026-gold-silver-fashion",
                        label: "Daily Wear Guide",
                    },
                    { href: "/blog", label: "More Styling Guides" },
                ]}
            >
                <p>
                    Looking for a necklace you can wear from office to evening without constant
                    polishing? Start with waterproof 18k gold plated chains and pendants from The
                    Luxe Jewels — anti-tarnish pieces made for Indian humidity, festive outfits, and
                    everyday layering.
                </p>
                <p>
                    Choose a delicate pendant for gifting, a satellite or paperclip chain for daily
                    stacking, or a statement charm for evenings. Pair with our{" "}
                    <a href="/earrings" className="text-[#E91E63] font-semibold hover:underline">
                        anti-tarnish earrings
                    </a>{" "}
                    for a complete set, or browse the{" "}
                    <a href="/shop" className="text-[#E91E63] font-semibold hover:underline">
                        full catalogue
                    </a>{" "}
                    if you want bracelets and rings too.
                </p>
                <p>
                    Serving shoppers across Noida, Greater Noida, Delhi NCR, and pan-India with free
                    delivery on orders over ₹1000. Prefer gifts? See our{" "}
                    <a
                        href="/blog/best-jewelry-gifts-raksha-bandhan-friendship-day-2026"
                        className="text-[#E91E63] font-semibold hover:underline"
                    >
                        festive jewellery gift ideas
                    </a>
                    .
                </p>
            </SeoIntro>
        </section>
    );
}
