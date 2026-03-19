import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { id } = await params;
    try {
        const base = getBaseUrl();
        const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" });
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
    } catch {
        return { title: "Product | GLOSSY." };
    }
}

export default async function ProductPage({ params }) {
    const { id } = await params;
    const base = getBaseUrl();

    const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" });
    const { product, galleryImages, relatedProducts, error } = await res.json();

    if (error || !product) notFound();

    return (
        <main className="min-h-screen bg-white">
            <ProductDetailClient
                product={product}
                galleryImages={galleryImages || []}
                relatedProducts={relatedProducts || []}
            />
        </main>
    );
}
