import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

// Force dynamic rendering to ensure fresh data on every request (SSR)
export const dynamic = "force-dynamic";

export default async function CollectionDetails({ params }) {
    const { slug } = await params;



    // 1. Get category info from API
    const catRes = await fetch(`/api/categories`, { cache: 'no-store' });
    const { categories } = await catRes.json();
    const category = categories?.find(c => c.slug === slug);

    if (!category) {
        return <div className="text-center py-20">Collection not found</div>;
    }

    // 2. Get products from API
    const prodRes = await fetch(`/api/products?slug=${slug}`, { cache: 'no-store' });
    const { products } = await prodRes.json();

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold mb-10 text-center">
                    {category.name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


                    {products?.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="group block"
                        >
                            <div>
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                                    <Image
                                        src={product.main_image || "/placeholder.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* Info */}
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:underline">
                                        {product.name}
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <p className="mt-2 font-bold text-gray-900">
                                        ₹{product.price}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}