import { getServiceClient } from "@/lib/supabaseServiceClient";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";



export async function generateMetadata({ params }) {
    const { id } = await params;
    const supabase = getServiceClient();

    const { data: product } = await supabase
        .from("products")
        .select("name, description, main_image, categories(name)")
        .eq("id", id)
        .single();

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
    const supabase = getServiceClient();

    // 1. Fetch main product with category
    const { data: product, error } = await supabase
        .from("products")
        .select("*, categories(name, id)")
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

    // 3. Related products – same category first, then fallback
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
