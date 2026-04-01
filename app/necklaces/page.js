import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Premium Anti-Tarnish Necklaces | The luxe jewels",
    description: "Discover our ethical and elegant anti-tarnish necklaces. Waterproof, 18k gold plated chains and pendants for everyday luxury in India.",
    alternates: {
        canonical: "/necklaces",
    },
    openGraph: {
        title: "Anti-Tarnish Necklaces | The luxe jewels",
        description: "Luminous accents for every style. Handcrafted waterproof fine necklaces.",
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
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Anti-Tarnish Necklaces" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Anti-Tarnish Necklaces</h1>
                    <p className="text-gray-500 max-w-xl mx-auto italic font-medium">Timeless chains. Sustainable luxury. Designed to never fade.</p>
                </div>
                {!products || products.length === 0 ? (
                    <p className="text-center text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link key={product.id} href={`/product/${product.id}`} className="group block">
                                <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-50 group-hover:shadow-md transition-all">
                                    <Image src={product.main_image || "/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-700" />
                                </div>
                                <div className="mt-5">
                                    <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                                    <p className="text-[#E91E63] font-black mt-1 text-sm">₹{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* SEO Footnote - Visually Hidden */}
            <div className="sr-only">
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Elegant Anti-Tarnish Necklaces for Modern Styling</h2>
                <p>
                    Shop our exclusive curation of **anti-tarnish necklaces** at The luxe jewels.
                    From delicate 18k gold plated chains meant for layering to bold statement pendants, each design is realized with a focus on sustainable luxury.
                    Our jewelry is designed in India and crafted to be **waterproof and sweat-proof**, ensuring your shine lasts a lifetime.
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Sustainable Luxury Fine Jewelry India</h2>
                <p>
                    At <Link href="/" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels</Link>, we believe in beauty that lasts.
                    Explore our <Link href="/shop" className="text-gray-900 transition-colors font-semibold">fine jewelry collections</Link> and find pieces that
                    resonate with your personal style. Pair your necklace with our <Link href="/earrings" className="text-gray-900 transition-colors font-semibold">premium earrings</Link>
                    for a complete, sophisticated look.
                </p>
            </div>
        </section>
    );
}