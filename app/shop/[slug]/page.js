import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import CollectionPageContent from "../../components/CollectionPageContent";
import { notFound, redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { buildLandingRedirect, getDedicatedLandingPath, getDisplayCategoryName } from "@/lib/categoryLanding";
import { formatPageTitle, truncateMetaDescription } from "@/lib/seo";
import {
    PRODUCT_CARD_SELECT,
    getCategoryStaticParams,
} from "@/lib/productQueries";

const PAGE_SIZE = 12;

export const revalidate = 3600;

export async function generateStaticParams() {
    return getCategoryStaticParams(50);
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();

    const { data: category } = await supabase
        .from("categories")
        .select("name, meta_title, meta_description, description, image_url, slug")
        .eq("slug", slug)
        .single();

    if (!category) {
        return { title: "Collection Not Found", robots: { index: false, follow: false } };
    }

    const displayName = getDisplayCategoryName(category);
    const title = formatPageTitle(
        category.meta_title || `${displayName} | Premium Anti-Tarnish Collection`
    );
    const description = truncateMetaDescription(
        category.meta_description ||
            category.description ||
            `Explore our ${displayName} collection. Shop waterproof, 18k gold plated jewellery at The Luxe Jewels India.`
    );

    return {
        title,
        description,
        alternates: {
            canonical: `/shop/${slug}`,
        },
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
        openGraph: {
            title: `${displayName} | Premium Collection | The Luxe Jewels`,
            description,
            url: `https://www.theluxejewels.in/shop/${slug}`,
            siteName: "The Luxe Jewels",
            images: category.image_url ? [{ url: category.image_url }] : [{ url: "/logo.png" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${displayName} | Custom Jewellery Selection`,
            description,
            images: category.image_url ? [category.image_url] : ["/logo.png"],
        },
    };
}

export default async function CollectionDetails({ params, searchParams }) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    const landingPath = getDedicatedLandingPath(slug);
    if (landingPath) {
        redirect(buildLandingRedirect(landingPath, resolvedSearchParams));
    }

    const page = parseInt(resolvedSearchParams?.page || "1", 10);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const supabase = getServiceClient();

    const [{ data: category, error: catError }, { data: allCategories }] = await Promise.all([
        supabase
            .from("categories")
            .select("id, name, slug, image_url, description")
            .eq("slug", slug)
            .single(),
        supabase.from("categories").select("id, name, slug, image_url").order("name"),
    ]);

    if (catError || !category) {
        notFound();
    }

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

    const count = countResult.count || 0;
    const products = productsResult.data || [];
    const productsWithDiscounts = products.map(withCalculatedDiscount);
    const totalPages = Math.ceil(count / PAGE_SIZE) || 1;
    const reviewCounts = await getReviewCounts(productsWithDiscounts.map((p) => p.id));
    const otherCategories = (allCategories || []).filter((c) => c.id !== category.id);

    const displayName = getDisplayCategoryName(category);
    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: displayName,
        description: category.description || `Explore our ${displayName} collection at The Luxe Jewels.`,
        url: `https://www.theluxejewels.in/shop/${slug}`,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: productsWithDiscounts.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Product",
                    name: product.name,
                    url: `https://www.theluxejewels.in/product/${product.slug}`,
                    image: product.main_image,
                    price: product.price,
                    priceCurrency: "INR",
                    category: displayName,
                },
            })),
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.theluxejewels.in" },
            { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.theluxejewels.in/shop" },
            { "@type": "ListItem", position: 3, name: displayName, item: `https://www.theluxejewels.in/shop/${slug}` },
        ],
    };

    return (
        <section className="pb-10 md:pb-14 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <CollectionPageContent
                breadcrumbs={[{ label: "Shop", href: "/shop" }, { label: getDisplayCategoryName(category) }]}
                heroImageUrl={category.image_url}
                title={getDisplayCategoryName(category)}
                description={category.description}
                count={count}
                showingCount={productsWithDiscounts.length}
                products={productsWithDiscounts}
                reviewCounts={reviewCounts}
                pagination={totalPages > 1 ? { basePath: `/shop/${slug}`, page, totalPages } : null}
                otherCategories={otherCategories}
            />
        </section>
    );
}
