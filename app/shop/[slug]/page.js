import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import ProductCard from "../../components/ProductCard";
import { calculateDiscount } from "@/lib/discountUtils";

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

    if (!category) return { title: "Collection Not Found" };

    return {
        title: `${category.name} | Premium Anti-Tarnish Collection`,
        description: category.description || `Explore our ${category.name} collection. Shop waterproof, 18k gold plated jewellery at The luxe jewels India.`,
        alternates: {
            canonical: `/shop/${slug}`,
        },
        keywords: [
            `${category.name} jewellery`,
            `anti tarnish ${category.name}`,
            `waterproof ${category.name} india`,
            `18k gold plated ${category.name}`,
            "The luxe jewels collections"
        ],
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
        openGraph: {
            title: `${category.name} | Premium Collection | The luxe jewels`,
            description: category.description || `Explore our premium ${category.name} collection at The luxe jewels.`,
            url: `https://www.theluxejewels.in/shop/${slug}`,
            siteName: "The luxe jewels",
            images: category.image_url ? [{ url: category.image_url }] : [{ url: "/logo.png" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${category.name} | Custom Jewellery Selection`,
            description: category.description,
            images: category.image_url ? [category.image_url] : ["/logo.png"],
        },
    };
}

export default async function CollectionDetails({ params, searchParams }) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams?.page || "1", 10);

    const supabase = getServiceClient();

    // 1. Get category by slug
    const { data: category, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (catError || !category) {
        return <div className="text-center py-20">Collection not found</div>;
    }

    // 2. Get total count
    const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", category.id);

    // 3. Get paginated products
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", category.id)
        .order("created_at", { ascending: false })
        .range(from, to);

    // Calculate discounts server-side for each product
    const productsWithDiscounts = (products || []).map(product => ({
        ...product,
        calculated_discount: product.original_price
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : calculateDiscount(product.id)
    }));

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

    // Collection Schema
    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.name,
        "description": category.description || `Explore our ${category.name} collection at The luxe jewels.`,
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

    // Breadcrumb Schema
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
        <section className="py-24 px-6 md:px-12 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center">{category.name}</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {productsWithDiscounts?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <Link
                            href={`/shop/${slug}?page=${Math.max(1, page - 1)}`}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                page === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-black"
                            }`}
                            aria-disabled={page === 1}
                        >
                            Previous
                        </Link>

                        {Array.from({ length: totalPages }, (_, i) => {
                            const pageNum = i + 1;
                            const isCurrentPage = pageNum === page;
                            const showPage = pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1);

                            if (!showPage) {
                                if (pageNum === page - 2 || pageNum === page + 2) {
                                    return <span key={pageNum} className="px-2">...</span>;
                                }
                                return null;
                            }

                            return (
                                <Link
                                    key={pageNum}
                                    href={`/shop/${slug}?page=${pageNum}`}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        isCurrentPage
                                            ? "bg-pink-600 text-white"
                                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                    }`}
                                >
                                    {pageNum}
                                </Link>
                            );
                        })}

                        <Link
                            href={`/shop/${slug}?page=${Math.min(totalPages, page + 1)}`}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                page === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-black"
                            }`}
                            aria-disabled={page === totalPages}
                        >
                            Next
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}