import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Premium Anti-Tarnish Earrings | 18k Gold Plated",
    description: "Shop the best anti-tarnish earrings in India. Our collection features waterproof, hypoallergenic 18k gold plated studs, hoops, and statement drops for daily wear.",
    alternates: {
        canonical: "/earrings",
    },
    keywords: [
        "anti tarnish earrings india",
        "gold plated earrings online",
        "waterproof earrings for daily wear",
        "hypoallergenic earrings for sensitive skin",
        "18k gold earrings india",
        "minimalist earrings brand",
        "buy luxury earrings online india"
    ],
    openGraph: {
        title: "Anti-Tarnish Earrings | Waterproof & Hypoallergenic | The luxe jewels",
        description: "Ethical and elegant waterproof earrings handcrafted for the modern individual. Tarnish-free 18k gold plating.",
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
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Anti-Tarnish Earrings" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Anti-Tarnish Earrings</h1>
                    <p className="text-gray-500 max-w-xl mx-auto italic font-medium">Waterproof. Everyday-proof. Crafted for the modern individual.</p>
                </div>
                {!products || products.length === 0 ? (
                    <p className="text-center text-gray-500 font-medium py-12">Coming Soon.</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* SEO Footnote - Visually Hidden */}
            <div className="sr-only">
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Premium Anti-Tarnish Earrings for Women</h2>
                <p>
                    Explore our premium collection of **anti-tarnish earrings**, ranging from everyday minimalist studs to statement-making drops.
                    Each piece at <Link href="/" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels</Link> is crafted with intentional design,
                    using fine materials like recycled silver and high-quality 18k gold plating. Our jewelry is designed to be **waterproof and sweat-proof**,
                    making it perfect for daily wear in India.
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Craftsmanship and Sustainable Quality</h2>
                <p>
                    We pride ourselves on delivering <Link href="/shop" className="text-gray-900 transition-colors font-semibold">luxury fine jewelry</Link> that doesn&apos;t compromise on ethical standards.
                    Whether you&apos;re looking for classic hoops or modern sculptural earrings, our jewelry is created to elevate your look
                    while remaining timeless. Browse our <Link href="/necklaces" className="text-gray-900 transition-colors font-semibold">fine necklaces</Link> collection too to complete your signature look.
                </p>
            </div>
        </section>
    );
}