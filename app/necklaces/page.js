import Image from "next/image";
import Link from "next/link";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

export default async function NecklacesPage() {
    const base = getBaseUrl();
    const slug = "the-necklace-edit";

    const catRes = await fetch(`${base}/api/categories`, { cache: "no-store" });
    const { categories } = await catRes.json();
    const category = categories?.find((c) => c.slug === slug);

    if (!category) {
        return <div className="text-center py-20">Collection not found</div>;
    }

    const prodRes = await fetch(`${base}/api/products?slug=${slug}`, { cache: "no-store" });
    const { products } = await prodRes.json();

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Necklaces
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Luminous accents for every style.
                    </p>
                </div>

                {!products || products.length === 0 ? (
                    <p className="text-center text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group block">
                                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                                    <Image
                                        src={product.main_image || "/placeholder.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition"
                                    />
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                    <p className="text-gray-500 text-sm">₹{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}