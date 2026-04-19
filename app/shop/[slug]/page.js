import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import ProductCard from "../../components/ProductCard";

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
        description: category.description || `Explore our ${category.name} collection. Shop waterproof, 18k gold plated jewelry at The luxe jewels India.`,
        alternates: {
            canonical: `/shop/${slug}`,
        },
        keywords: [
            `${category.name} jewelry`,
            `anti tarnish ${category.name}`,
            `waterproof ${category.name} india`,
            `18k gold plated ${category.name}`,
            "The luxe jewels collections"
        ],
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
            title: `${category.name} | Custom Jewelry Selection`,
            description: category.description,
            images: category.image_url ? [category.image_url] : ["/logo.png"],
        },
    };
}

export default async function CollectionDetails({ params }) {
    const { slug } = await params;

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

    // 2. Get products by category_id
    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", category.id)
        .order("created_at", { ascending: false });

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center">{category.name}</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}