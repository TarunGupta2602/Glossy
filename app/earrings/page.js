import { getServiceClient } from "@/lib/supabaseServiceClient";
import CollectionPageContent from "../components/CollectionPageContent";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { findEarringsCategory } from "@/lib/categoryLanding";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Premium Anti-Tarnish Earrings | 18k Gold Plated",
    description: "Shop the best anti-tarnish earrings in India. Our collection features waterproof, hypoallergenic 18k gold plated studs, hoops, and statement drops for daily wear.",
    alternates: {
        canonical: "/earrings",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Anti-Tarnish Earrings | Waterproof & Hypoallergenic | The Luxe Jewels",
        description: "Ethical and elegant waterproof earrings handcrafted for the modern individual. Tarnish-free 18k gold plating.",
        url: "https://www.theluxejewels.in/earrings",
        siteName: "The Luxe Jewels",
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
        type: "website",
    },
};

const PAGE_SIZE = 12;

export default async function EarringsPage({ searchParams }) {
    const supabase = getServiceClient();
    const params = await searchParams;
    const page = parseInt(params?.page || "1", 10);
    if (isNaN(page) || page < 1) redirect("/earrings?page=1");

    const { data: categories } = await supabase.from("categories").select("id, name, slug, image_url, description");
    const category = findEarringsCategory(categories);
    const otherCategories = (categories || []).filter((c) => c.id !== category?.id);

    let products = [];
    let count = 0;

    if (category?.id) {
        const countResult = await supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("category_id", category.id);
        count = countResult.count || 0;

        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data } = await supabase
            .from("products")
            .select("*, categories(name, id, slug)")
            .eq("category_id", category.id)
            .order("created_at", { ascending: false })
            .range(from, to);
        products = data || [];
    }

    const productsWithDiscounts = products.map(withCalculatedDiscount);
    const totalPages = Math.ceil(count / PAGE_SIZE);
    const reviewCounts = await getReviewCounts(productsWithDiscounts.map((p) => p.id));

    const pageTitle = category?.name || "Anti-Tarnish Earrings";
    const pageDescription =
        category?.description || "Waterproof. Everyday-proof. Crafted for the modern individual.";

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
        </section>
    );
}
