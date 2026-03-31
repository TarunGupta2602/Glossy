import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Necklaces",
    description: "Discover our ethical and elegant necklaces from The luxe jewels. From minimal chains to statement pendants, find your next favorite piece.",
    alternates: {
        canonical: "/necklaces",
    },
    openGraph: {
        title: "Necklaces | The luxe jewels",
        description: "Luminous accents for every style. Handcrafted fine necklaces.",
        url: "https://www.theluxejewels.in/necklaces",
        siteName: "The luxe jewels",
        images: [{ url: "/logo.png" }],
        type: "website",
    },
};

export default async function NecklacesPage() {
    const supabase = getServiceClient();
    const slug = "the-necklace-edit";

    const { data: category } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", slug)
        .single();

    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", category?.id)
        .order("created_at", { ascending: false });

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Necklaces" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Necklaces</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">Luminous accents for every style. Find the perfect gold, silver, or layered necklace curation.</p>
                </div>
                {!products || products.length === 0 ? (
                    <p className="text-center text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group block">
                                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                                    <Image src={product.main_image || "/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-105 transition" />
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                    {product.description && (
                                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
                                    )}
                                    <p className="text-gray-900 font-bold mt-2">₹{product.price}</p>
                                </div>

                            </Link>
                        ))}
                    </div>
                )}
            </div>


        </section>
    );
}