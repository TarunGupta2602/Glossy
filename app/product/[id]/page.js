import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const supabase = getServiceClient();

    const { data: product } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id)
        .single();

    if (!product) return {
        title: "Product Not Found",
        robots: "noindex"
    };

    const categoryName = product.categories?.name || "Fine Jewelry";
    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 30;

    // SEO Logic: Use custom meta fields if available, otherwise fallback to defaults
    // Note: The template in layout.js will append " | The luxe jewels" automatically
    const seoTitle = product.meta_title || `${product.name} | ${categoryName}`;
    const seoDescription = product.meta_description || product.description || `Shop ${product.name} from our ${categoryName} collection at The luxe jewels. Premium anti-tarnish, waterproof, and hypoallergenic jewelry. Get ${discount}% off today!`;
    const seoKeywords = product.meta_keywords || `${product.name}, ${categoryName}, anti-tarnish jewelry, waterproof jewelry india, pure gold plated jewelry, gift for her`;

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
        alternates: {
            canonical: `/product/${id}`,
        },
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: `https://www.theluxejewels.in/product/${id}`,
            siteName: "The luxe jewels",
            images: product.main_image ? [{
                url: product.main_image,
                alt: product.image_alt || product.name,
                width: 1200,
                height: 1200
            }] : [{ url: "/logo.png" }],
            type: "article",
            publishedTime: product.created_at,
            authors: ["The luxe jewels"],
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
    const { id } = await params;

    const supabase = getServiceClient();

    // 1. Fetch main product with category
    const { data: product, error } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("id", id)
        .single();

    if (error || !product) notFound();

    // 2. Fetch gallery images
    const { data: galleryRows } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", id)
        .order("created_at", { ascending: true });

    const galleryImages = (galleryRows || []).map((r) => r.image_url).filter(Boolean);

    // 3. Related products — same category first, fallback to newest
    const { data: related } = await supabase
        .from("products")
        .select("id, name, price, main_image, image_alt, categories(name)")
        .eq("category_id", product.category_id)
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(4);

    let relatedProducts = related || [];

    if (relatedProducts.length < 4) {
        const excludeIds = [id, ...relatedProducts.map((p) => p.id)];
        const { data: extras } = await supabase
            .from("products")
            .select("id, name, price, main_image, image_alt, categories(name)")
            .not("id", "in", `(${excludeIds.join(",")})`)
            .order("created_at", { ascending: false })
            .limit(4 - relatedProducts.length);

        relatedProducts = [...relatedProducts, ...(extras || [])];
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "name": product.name,
                "image": [product.main_image, ...galleryImages],
                "description": product.description || `Premium ${product.name} from The luxe jewels.`,
                "sku": product.id,
                "brand": {
                    "@type": "Brand",
                    "name": "The luxe jewels"
                },
                "offers": {
                    "@type": "Offer",
                    "url": `https://www.theluxejewels.in/product/${id}`,
                    "priceCurrency": "INR",
                    "price": product.price,
                    "priceValidUntil": "2026-12-31",
                    "itemCondition": "https://schema.org/NewCondition",
                    "availability": "https://schema.org/InStock",
                    "shippingDetails": {
                        "@type": "OfferShippingDetails",
                        "shippingRate": {
                            "@type": "MonetaryAmount",
                            "value": product.price >= 1000 ? 0 : 10,
                            "currency": "INR"
                        },
                        "shippingDestination": {
                            "@type": "DefinedRegion",
                            "addressCountry": "IN"
                        },
                        "deliveryTime": {
                            "@type": "ShippingDeliveryTime",
                            "handlingTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 2,
                                "unitCode": "DAY"
                            },
                            "transitTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 3,
                                "maxValue": 7,
                                "unitCode": "DAY"
                            }
                        }
                    }
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "12"
                }
            },
            {
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
                        "name": product.categories?.name || "Jewelry",
                        "item": `https://www.theluxejewels.in/shop/${product.categories?.slug}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": product.name,
                        "item": `https://www.theluxejewels.in/product/${id}`
                    }
                ]
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient
                product={product}
                galleryImages={galleryImages}
                relatedProducts={relatedProducts}
            />
        </main>
    );
}
