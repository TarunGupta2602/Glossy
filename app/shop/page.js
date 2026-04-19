import ShopClient from "../components/ShopClient";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Shop All Fine Jewelry | Buy Anti-Tarnish & Waterproof Jewelry",
    description: "Explore our full collection of premium anti-tarnish, waterproof, and handcrafted jewelry at The luxe jewels. From ethical earrings to gold plated necklaces, find everyday luxury.",
    alternates: {
        canonical: "/shop",
    },
    keywords: [
        "shop jewelry online india",
        "buy anti tarnish jewelry",
        "waterproof jewelry shop",
        "18k gold plated accessories",
        "luxury fine jewelry India",
        "minimalist jewelry collection",
        "hypoallergenic jewelry store"
    ],
    openGraph: {
        title: "Shop All Fine Jewelry | Premium & Sustainable | The luxe jewels",
        description: "Handcrafted ethical fine jewelry. Modern designs, sustainable luxury, and waterproof durability.",
        url: "https://www.theluxejewels.in/shop",
        siteName: "The luxe jewels",
        images: [{ url: "/logo.png" }],
        type: "website",
    },
};

export default async function ShopPage() {
    const supabase = getServiceClient();

    const [{ data: categories }, { data: products }] = await Promise.all([
        supabase.from("categories").select("*").order("name", { ascending: true }),
        supabase.from("products").select("*, categories(name, id, slug)").order("created_at", { ascending: false }),
    ]);

    return (
        <main className="min-h-screen bg-white">
            <section className="pt-10 px-6 md:px-12 max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Shop All Collections" }]} />
            </section>

            <section className="pt-5 pb-5 px-6 md:px-12 text-center max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-light text-gray-950 tracking-tighter mb-8">
                    Featured Collection
                </h1>
                <p className="text-base md:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                    Explore our latest curation of anti-tarnish jewelry and hand-crafted fine jewelry.

                </p>
            </section>

            <section className="pb-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <ShopClient
                        initialProducts={products || []}
                        categories={categories || []}
                    />
                </div>
            </section>

            {/* SEO Footnote - Visually Hidden */}
            <section className="sr-only">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm leading-relaxed text-gray-500">
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Premium Anti-Tarnish & Fine Jewelry</h2>
                        <p>
                            Welcome to the <Link href="/shop" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels shop</Link>.
                            We offer a meticulously curated selection of anti-tarnish, waterproof, and everyday wear jewelry blends traditional craftsmanship with modern design.
                            Our pieces are made for jewelry lovers in India who value ethical luxury.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Explore Collections</h3>
                        <ul className="space-y-4">
                            <li><Link href="/earrings" className="hover:text-[#E91E63] transition-colors font-semibold">18k Gold Plated Earrings</Link></li>
                            <li><Link href="/necklaces" className="hover:text-[#E91E63] transition-colors font-semibold">Daily Wear Fine Necklaces</Link></li>
                            <li><Link href="/shop" className="hover:text-[#E91E63] transition-colors font-semibold">New Jewelry Arrivals India</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6">About Our Ethics</h3>
                        <p>
                            At <Link href="/" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels</Link>, every piece in our collection is a testament to our commitment to sustainability.
                            We believe that <Link href="/our-story" className="text-gray-900 transition-colors font-semibold">our story</Link>
                            is defined by the care we put into every design. Shop India&apos;s best **anti-tarnish jewelry** online now.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
