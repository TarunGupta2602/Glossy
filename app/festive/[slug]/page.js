import { notFound } from "next/navigation";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import FestiveCollectionContent from "../../components/FestiveCollectionContent";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { attachHoverImages } from "@/lib/hoverImages";
import { BRAND_URL } from "@/lib/constants";
import {
    getFestiveCollection,
    listFestiveCollections,
    fetchFestiveProducts,
    curateFestiveEdit,
} from "@/lib/festiveCollections";

export const revalidate = 300;

export function generateStaticParams() {
    return listFestiveCollections().map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const collection = getFestiveCollection(slug);
    if (!collection) {
        return { title: "Festive jewellery" };
    }

    const canonical = `/festive/${collection.slug}`;

    return {
        title: collection.metaTitle,
        description: collection.metaDescription,
        alternates: { canonical },
        openGraph: {
            title: collection.metaTitle,
            description: collection.metaDescription,
            url: `${BRAND_URL}${canonical}`,
            siteName: "The Luxe Jewels",
            images: [{ url: collection.heroImage, width: 1200, height: 630 }],
            type: "website",
        },
    };
}

export default async function FestiveCollectionPage({ params }) {
    const { slug } = await params;
    const collection = getFestiveCollection(slug);
    if (!collection) notFound();

    const supabase = getServiceClient();
    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug, image_url, description");

    const rawProducts = await fetchFestiveProducts(supabase, categories || []);
    const decorated = await attachHoverImages(
        supabase,
        rawProducts.map(withCalculatedDiscount)
    );
    const { products, sections } = curateFestiveEdit(decorated, collection);
    const reviewCounts = await getReviewCounts(products.map((p) => p.id));

    const sibling = listFestiveCollections().find((item) => item.slug !== collection.slug);
    const path = `/festive/${collection.slug}`;

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BRAND_URL },
            { "@type": "ListItem", position: 2, name: "Shop", item: `${BRAND_URL}/shop` },
            { "@type": "ListItem", position: 3, name: collection.title, item: `${BRAND_URL}${path}` },
        ],
    };

    return (
        <section className="pb-10 md:pb-14 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <FestiveCollectionContent
                collection={collection}
                breadcrumbs={[
                    { label: "Shop", href: "/shop" },
                    { label: collection.title },
                ]}
                products={products}
                sections={sections}
                reviewCounts={reviewCounts}
                intentLinks={[
                    { href: "/earrings", label: "Earrings" },
                    { href: "/necklaces", label: "Necklaces" },
                    { href: "/bracelets", label: "Bracelets" },
                    { href: "/gifts/under-499", label: "Gifts under ₹499" },
                    sibling
                        ? { href: `/festive/${sibling.slug}`, label: sibling.title }
                        : null,
                    collection.blogSlug
                        ? { href: `/blog/${collection.blogSlug}`, label: collection.blogLabel }
                        : null,
                ].filter(Boolean)}
            />
        </section>
    );
}
