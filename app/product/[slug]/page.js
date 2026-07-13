import { notFound, redirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { fetchProductBySlugOrId } from "@/lib/productQueries";
import {
    BASE_URL,
    formatPageTitle,
    getProductCanonicalUrl,
    getProductPath,
    isUuid,
} from "@/lib/seo";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export const dynamic = "force-dynamic";

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
    const seoKeywords =
        product.meta_keywords ||
        `${product.name}, ${categoryName}, anti-tarnish jewellery, waterproof jewellery india, the luxe jewels`;
    const canonicalPath = getProductPath(product);

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
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
            siteName: "The luxe jewels",
            images: product.main_image
                ? [{ url: product.main_image, alt: product.image_alt || product.name, width: 1200, height: 630 }]
                : [{ url: "/logo.png", width: 1200, height: 630 }],
            type: "website",
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

    const { data: galleryRows } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", id)
        .order("created_at", { ascending: true });

    const galleryImages = (galleryRows || []).map((r) => r.image_url).filter(Boolean);

    const { data: related } = await supabase
        .from("products")
        .select("id, name, price, main_image, image_alt, slug, categories(name)")
        .eq("category_id", product.category_id)
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(4);

    let relatedProducts = related || [];

    if (relatedProducts.length < 4) {
        const excludeIds = [id, ...relatedProducts.map((p) => p.id)];
        const { data: extras } = await supabase
            .from("products")
            .select("id, name, price, main_image, image_alt, slug, categories(name)")
            .not("id", "in", `(${excludeIds.join(",")})`)
            .order("created_at", { ascending: false })
            .limit(4 - relatedProducts.length);

        relatedProducts = [...relatedProducts, ...(extras || [])];
    }

    const productUrl = getProductCanonicalUrl(product);
    const images = [product.main_image, ...galleryImages].filter(Boolean);

    // Fetch reviews for JSON-LD
    const { data: reviews } = await supabase
        .from("reviews")
        .select("rating, comment, user_name, created_at")
        .eq("product_id", id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(50);

    // Calculate aggregate rating
    const totalReviews = reviews?.length || 0;
    const avgRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // FAQ Schema for common jewellery questions
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Is this jewellery waterproof and tarnish-resistant?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, all our jewellery is designed to be waterproof and anti-tarnish. The 18k gold plating ensures long-lasting shine even with daily wear."
                }
            },
            {
                "@type": "Question",
                name: "What materials are used in this jewellery?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "We use high-quality materials including recycled silver, 18k gold plating, and hypoallergenic metals. All pieces are crafted for sensitive skin."
                }
            },
            {
                "@type": "Question",
                name: "Do you offer free shipping in India?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we offer free shipping across India on all orders. Standard delivery takes 5-7 business days."
                }
            },
            {
                "@type": "Question",
                name: "What is your return policy?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "We offer a 7-day return policy for unused items in original packaging. Contact us at +91-7456096455 for return assistance."
                }
            },
            {
                "@type": "Question",
                name: "How should I care for this jewellery?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "To maintain shine, avoid contact with perfumes, lotions, and harsh chemicals. Clean gently with a soft cloth and store in the provided pouch."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                name: product.name,
                image: images.length ? images : [`${BASE_URL}/logo.png`],
                description:
                    product.meta_description ||
                    product.description ||
                    `Premium ${product.name} from The Luxe Jewels.`,
                sku: product.id,
                mpn: product.slug || product.id,
                brand: { "@type": "Brand", name: "The luxe jewels" },
                category: product.categories?.name,
                ...(totalReviews > 0 && {
                    aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: avgRating.toFixed(1),
                        reviewCount: totalReviews,
                        bestRating: "5",
                        worstRating: "1",
                    },
                    review: reviews?.map((review) => ({
                        "@type": "Review",
                        reviewRating: {
                            "@type": "Rating",
                            ratingValue: review.rating,
                            bestRating: "5",
                            worstRating: "1",
                        },
                        author: {
                            "@type": "Person",
                            name: review.user_name,
                        },
                        reviewBody: review.comment,
                        datePublished: review.created_at,
                    })) || [],
                }),
                offers: {
                    "@type": "Offer",
                    url: productUrl,
                    priceCurrency: "INR",
                    price: product.price,
                    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    itemCondition: "https://schema.org/NewCondition",
                    availability: "https://schema.org/InStock",
                    seller: { "@type": "Organization", name: "The luxe jewels" },
                    shippingDetails: {
                        "@type": "OfferShippingDetails",
                        shippingRate: {
                            "@type": "MonetaryAmount",
                            value: 0,
                            currency: "INR",
                        },
                        shippingDestination: {
                            "@type": "DefinedRegion",
                            addressCountry: "IN",
                        },
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
            faqJsonLd
        ],
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
