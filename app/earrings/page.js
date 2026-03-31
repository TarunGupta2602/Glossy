import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Earrings",
    description: "Shop our exclusive collection of ethical and elegant earrings from The luxe jewels. Find the perfect statement pieces for any occasion.",
    alternates: {
        canonical: "/earrings",
    },
    openGraph: {
        title: "Earrings | The luxe jewels",
        description: "Ethical and elegant earrings handcrafted for the modern individual.",
        url: "https://www.theluxejewels.in/earrings",
        siteName: "The luxe jewels",
        images: [{ url: "/logo.png" }],
        type: "website",
    },
};

export default async function EarringsPage() {
    // ... same logic ...
    const supabase = getServiceClient();
    const slug = "-statement-piecess";

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
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Earrings" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Earrings</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">Crafted to last a lifetime. Discover our curation of gold, silver, and gemstone earrings.</p>
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

            {/* SEO Footnote */}
            <div className="max-w-7xl mx-auto mt-24 pt-24 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-gray-500">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Fine Earrings for Every Occasion</h2>
                        <p>
                            Explore our premium collection of <Link href="/earrings" className="text-gray-900 underline font-medium">earrings</Link>, ranging from everyday minimalist studs to statement-making drops.
                            Each piece at <Link href="/" className="text-gray-900 font-bold">The luxe jewels</Link> is crafted with intentional design,
                            using fine materials like recycled gold and high-quality ethically sourced stones.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Craftsmanship and Quality</h2>
                        <p>
                            We pride ourselves on delivering <Link href="/shop" className="text-gray-900 underline font-medium">luxury jewelry</Link> that doesn't compromise on ethical standards.
                            Whether you're looking for classic hoops or modern sculptural designs, our jewelry is created to elevate your look
                            while remaining timeless and sustainable. Browse our <Link href="/necklaces" className="text-gray-900 underline font-medium">necklaces</Link> too to complete your signature look.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}