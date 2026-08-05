import { notFound, redirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { fetchProductBySlugOrId } from "@/lib/productQueries";
import {
    BASE_URL,
    formatPageTitle,
    getProductCanonicalUrl,
    getProductPath,
    isUuid,
    SITE_NAME,
} from "@/lib/seo";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { getProductAvailability } from "@/lib/productAvailability";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { slug: param } = await params;
    const product = await fetchProductBySlugOrId(param);

    if (!product) {
        return { title: "Product Not Found", robots: { index: false, follow: false } };
    }

    const categoryName = product.categories?.name || "Fine Jewellery";
    const seoTitle = formatPageTitle(product.meta_title || `${product.name} | ${categoryName}`);
    const seoDescription =
        product.meta_description ||
        product.description ||
        `Shop ${product.name} from our ${categoryName} collection. Premium anti-tarnish jewellery with free shipping across India.`;
    const canonicalPath = getProductPath(product);

    return {
        title: seoTitle,
        description: seoDescription,
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
        alternates: { canonical: canonicalPath },
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: `${BASE_URL}${canonicalPath}`,
            siteName: SITE_NAME,
            images: product.main_image
                ? [{ 
                    url: product.main_image, 
                    alt: product.image_alt || product.name, 
                    width: 1200, 
                    height: 630,
                    type: "image/jpeg"
                }]
                : [{ 
                    url: "/logo.png", 
                    width: 1200, 
                    height: 630,
                    type: "image/png"
                }],
            type: "website",
        },
        other: {
            "og:type": "product",
        },
        twitter: {
            card: "summary_large_image",
            title: seoTitle,
            description: seoDescription,
            images: product.main_image ? [product.main_image] : ["/logo.png"],
        },
    };
}

export default async function ProductPage({ params }) {
    const { slug: param } = await params;
    const product = await fetchProductBySlugOrId(param);

    if (!product) notFound();

    // Redirect UUID URLs to slug URLs for SEO when slug is available
    if (isUuid(param) && product.slug && product.slug !== param) {
        redirect(getProductPath(product));
    }

    const id = product.id;
    const supabase = getServiceClient();

    // Parallel queries for better performance
    const [galleryRows, related, reviewsData] = await Promise.all([
        supabase
            .from("product_images")
            .select("image_url")
            .eq("product_id", id)
            .order("created_at", { ascending: true })
            .limit(5),
        supabase
            .from("products")
            .select("id, name, price, main_image, image_alt, slug, categories(name)")
            .eq("category_id", product.category_id)
            .neq("id", id)
            .order("created_at", { ascending: false })
            .limit(4),
        supabase
            .from("reviews")
            .select("*")
            .eq("product_id", id)
            .eq("is_approved", true)
            .order("created_at", { ascending: false })
    ]);

    const galleryImages = (galleryRows?.data || []).map((r) => r.image_url).filter(Boolean).slice(0, 5);
    let relatedProducts = (related?.data || []).slice(0, 4);
    const reviews = reviewsData?.data || [];

    // Calculate discount for main product
    const productWithDiscount = withCalculatedDiscount(product);

    // Calculate discounts for related products
    relatedProducts = (relatedProducts || []).map(withCalculatedDiscount);
    const relatedReviewCounts = await getReviewCounts(relatedProducts.map((p) => p.id));

    const productUrl = getProductCanonicalUrl(product);
    const images = [product.main_image, ...galleryImages].filter(Boolean);

    // Calculate review statistics for schema
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;

    // Build review schema
    const reviewSchema = reviews.slice(0, 10).map(review => ({
        "@type": "Review",
        author: {
            "@type": "Person",
            name: review.user_name || "Anonymous"
        },
        reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: "5"
        },
        reviewBody: review.comment || "",
        datePublished: review.created_at
    }));

    // Simplified structured data for faster load
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                name: product.name,
                sku: product.slug || product.id,
                image: images.length ? images : [`${BASE_URL}/logo.png`],
                description: product.meta_description || product.description || `Premium ${product.name} from ${SITE_NAME}.`,
                brand: { "@type": "Brand", name: SITE_NAME },
                category: product.categories?.name,
                ...(totalReviews > 0 && {
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: parseFloat(avgRating.toFixed(1)),
                        reviewCount: totalReviews,
                        bestRating: "5",
                        worstRating: "1"
                    }
                }),
                ...(reviewSchema.length > 0 && {
                    review: reviewSchema
                }),
                offers: {
                    "@type": "Offer",
                    url: productUrl,
                    priceCurrency: "INR",
                    price: product.price,
                    availability: getProductAvailability(product),
                    itemCondition: "https://schema.org/NewCondition",
                    shippingDetails: {
                        "@type": "OfferShippingDetails",
                        shippingDestination: {
                            "@type": "DefinedRegion",
                            addressCountry: "IN",
                        },
                        deliveryTime: {
                            "@type": "ShippingDeliveryTime",
                            handlingTime: {
                                "@type": "QuantitativeValue",
                                minValue: 1,
                                maxValue: 2,
                                unitCode: "DAY",
                            },
                            transitTime: {
                                "@type": "QuantitativeValue",
                                minValue: 3,
                                maxValue: 5,
                                unitCode: "DAY",
                            },
                        },
                    },
                    hasMerchantReturnPolicy: {
                        "@type": "MerchantReturnPolicy",
                        applicableCountry: "IN",
                        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                        merchantReturnDays: 10,
                        returnMethod: "https://schema.org/ReturnByMail",
                        returnFees: "https://schema.org/FreeReturn",
                    },
                },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: product.categories?.name || "Jewellery",
                        item: `${BASE_URL}/shop/${product.categories?.slug || ""}`,
                    },
                    { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
                ],
            },
        ],
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient
                product={productWithDiscount}
                galleryImages={galleryImages}
                relatedProducts={relatedProducts}
                relatedReviewCounts={relatedReviewCounts}
            />
        </main>
    );
}
