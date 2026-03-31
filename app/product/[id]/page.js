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
        .select("name, description, main_image, categories(name)")
        .eq("id", id)
        .single();

    if (!product) return { title: "Product Not Found" };

    return {
        title: product.name,
        description: product.description || `Shop ${product.name} at The luxe jewels. Fine jewelry, designed to last.`,
        alternates: {
            canonical: `/product/${id}`,
        },
        openGraph: {
            title: product.name,
            description: product.description,
            url: `https://www.theluxejewels.in/product/${id}`,
            siteName: "The luxe jewels",
            images: product.main_image ? [{ url: product.main_image }] : [{ url: "/logo.png" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
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
        .select("id, name, price, main_image, categories(name)")
        .eq("category_id", product.category_id)
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(4);

    let relatedProducts = related || [];

    if (relatedProducts.length < 4) {
        const excludeIds = [id, ...relatedProducts.map((p) => p.id)];
        const { data: extras } = await supabase
            .from("products")
            .select("id, name, price, main_image, categories(name)")
            .not("id", "in", `(${excludeIds.join(",")})`)
            .order("created_at", { ascending: false })
            .limit(4 - relatedProducts.length);

        relatedProducts = [...relatedProducts, ...(extras || [])];
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": [product.main_image, ...galleryImages],
        "description": product.description,
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
            "availability": "https://schema.org/InStock"
        }
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
