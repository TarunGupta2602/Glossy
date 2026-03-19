import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { id } = await params;



    const res = await fetch(`/api/products/${id}`, { cache: 'no-store' });
    const { product } = await res.json();

    if (!product) return { title: "Product Not Found | GLOSSY." };

    return {
        title: `${product.name} | GLOSSY.`,
        description:
            product.description ||
            `Shop ${product.name} at GLOSSY. Fine jewelry, designed to last.`,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.main_image ? [product.main_image] : [],
        },
    };
}

export default async function ProductPage({ params }) {
    const { id } = await params;

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Fetch product details from API
    const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: 'no-store' });
    const { product, galleryImages, relatedProducts, error } = await res.json();

    if (error || !product) notFound();

    return (
        <main className="min-h-screen bg-white">
            <ProductDetailClient
                product={product}
                galleryImages={galleryImages}
                relatedProducts={relatedProducts}
            />
        </main>
    );
}
