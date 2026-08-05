import Link from "next/link";
import Image from "next/image";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import ProductCard from "../../components/ProductCard";
import Breadcrumbs from "../../components/Breadcrumbs";
import SeoIntro from "../../components/SeoIntro";
import CategoryPagination from "../../components/CategoryPagination";
import { notFound, redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { buildLandingRedirect, getCategoryHref, getDedicatedLandingPath } from "@/lib/categoryLanding";

const PAGE_SIZE = 12;

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();

    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!category) {
        return { title: "Collection Not Found", robots: { index: false, follow: false } };
    }

    const title = category.meta_title || `${category.name} | Premium Anti-Tarnish Collection`;
    const description = category.meta_description || category.description || `Explore our ${category.name} collection. Shop waterproof, 18k gold plated jewellery at The Luxe Jewels India.`;

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
            title: `${category.name} | Premium Collection | The Luxe Jewels`,
            description,
            url: `https://www.theluxejewels.in/shop/${slug}`,
            siteName: "The Luxe Jewels",
            images: category.image_url ? [{ url: category.image_url }] : [{ url: "/logo.png" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${category.name} | Custom Jewellery Selection`,
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

    const supabase = getServiceClient();

    const [{ data: category, error: catError }, { data: allCategories }] = await Promise.all([
        supabase.from("categories").select("*").eq("slug", slug).single(),
        supabase.from("categories").select("id, name, slug, image_url").order("name"),
    ]);

    if (catError || !category) {
        notFound();
    }

    const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", category.id);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", category.id)
        .order("created_at", { ascending: false })
        .range(from, to);

    const productsWithDiscounts = (products || []).map(withCalculatedDiscount);
    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
    const reviewCounts = await getReviewCounts(productsWithDiscounts.map((p) => p.id));
    const otherCategories = (allCategories || []).filter((c) => c.id !== category.id);

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.name,
        "description": category.description || `Explore our ${category.name} collection at The Luxe Jewels.`,
        "url": `https://www.theluxejewels.in/shop/${slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": products?.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.name,
                    "url": `https://www.theluxejewels.in/product/${product.slug}`,
                    "image": product.main_image,
                    "price": product.price,
                    "priceCurrency": "INR",
                    "category": category.name
                }
            })) || []
        }
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.theluxejewels.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://www.theluxejewels.in/shop"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": category.name,
                "item": `https://www.theluxejewels.in/shop/${slug}`
            }
        ]
    };

    return (
        <section className="pb-24 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {category.image_url && (
                <div className="relative w-full h-48 md:h-64 overflow-hidden bg-gray-100">
                    <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: category.name }]} />
                <div className="text-center mb-12 mt-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">{category.name}</h1>
                    {category.description && (
                        <p className="text-gray-500 max-w-xl mx-auto italic font-medium">{category.description}</p>
                    )}
                    {count > 0 && (
                        <p className="text-sm text-gray-400 mt-4 font-medium">
                            Showing {productsWithDiscounts.length} of {count} piece{count === 1 ? "" : "s"}
                        </p>
                    )}
                </div>

                {productsWithDiscounts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                            {productsWithDiscounts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    reviewCount={reviewCounts[product.id] || 0}
                                />
                            ))}
                        </div>
                        <CategoryPagination basePath={`/shop/${slug}`} page={page} totalPages={totalPages} />
                    </>
                ) : (
                    <div className="text-center py-20 px-6 border border-dashed border-gray-200 rounded-3xl">
                        <p className="text-gray-500 font-medium mb-2">This collection is being curated.</p>
                        <p className="text-sm text-gray-400 mb-8">Explore our other collections while we add new pieces.</p>
                        {otherCategories.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-3">
                                {otherCategories.slice(0, 6).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={getCategoryHref(cat)}
                                        className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <Link
                            href="/shop"
                            className="inline-block mt-8 text-[#E91E63] font-bold text-sm uppercase tracking-widest hover:underline"
                        >
                            Browse All Jewellery →
                        </Link>
                    </div>
                )}
            </div>

            {category.description && (
                <SeoIntro title={`About ${category.name}`}>
                    <p>{category.description}</p>
                </SeoIntro>
            )}
        </section>
    );
}
