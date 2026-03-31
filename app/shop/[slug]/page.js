import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const supabase = getServiceClient();

    const { data: category } = await supabase
        .from("categories")
        .select("name, description, image_url")
        .eq("slug", slug)
        .single();

    if (!category) return { title: "Collection Not Found" };

    return {
        title: category.name,
        description: category.description || `Explore our ${category.name} collection at The luxe jewels.`,
        alternates: {
            canonical: `/shop/${slug}`,
        },
        openGraph: {
            title: `${category.name} | The luxe jewels`,
            description: category.description || `Explore our ${category.name} collection.`,
            url: `https://www.theluxejewels.in/shop/${slug}`,
            siteName: "The luxe jewels",
            images: category.image_url ? [{ url: category.image_url }] : [{ url: "/logo.png" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${category.name} | The luxe jewels`,
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products?.map((product) => (
                        <Link key={product.id} href={`/product/${product.id}`} className="group block">
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                                <Image src={product.main_image || "/placeholder.jpg"} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:underline">{product.name}</h3>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                                <p className="mt-2 font-bold text-gray-900">₹{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}