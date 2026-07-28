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
import { calculateDiscount } from "@/lib/discountUtils";

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

    // Parallel queries for better performance
    const [galleryRows, related] = await Promise.all([
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
            .limit(3)
    ]);

    const galleryImages = (galleryRows?.data || []).map((r) => r.image_url).filter(Boolean).slice(0, 5);
    let relatedProducts = (related?.data || []).slice(0, 3);

    // Calculate discount for main product
    const productWithDiscount = {
        ...product,
        calculated_discount: product.original_price
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
            : calculateDiscount(product.id)
    };

    // Calculate discounts for related products
    relatedProducts = (relatedProducts || []).map(p => ({
        ...p,
        calculated_discount: p.original_price
            ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
            : calculateDiscount(p.id)
    }));

    const productUrl = getProductCanonicalUrl(product);
    const images = [product.main_image, ...galleryImages].filter(Boolean);

    // Simplified structured data for faster load
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                name: product.name,
                image: images.length ? images : [`${BASE_URL}/logo.png`],
                description: product.meta_description || product.description || `Premium ${product.name} from The Luxe Jewels.`,
                brand: { "@type": "Brand", name: "The luxe jewels" },
                offers: {
                    "@type": "Offer",
                    url: productUrl,
                    priceCurrency: "INR",
                    price: product.price,
                    availability: "https://schema.org/InStock",
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
            />
        </main>
    );
}
