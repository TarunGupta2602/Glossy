import ShopClient from "../components/ShopClient";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Shop All Fine Jewelry",
    description: "Explore our full collection of handcrafted fine jewelry. From ethical earrings to designer necklaces, find the perfect addition to your collection.",
    alternates: {
        canonical: "/shop",
    },
    openGraph: {
        title: "Shop All Fine Jewelry | The luxe jewels",
        description: "Handcrafted ethical fine jewelry. Modern designs, sustainable luxury.",
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
                <Breadcrumbs items={[{ label: "Shop All" }]} />
            </section>

            <section className="pt-5 pb-5 px-6 md:px-12 text-center max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-light text-gray-950 tracking-tighter mb-8">
                    New Arrivals
                </h1>
                <p className="text-base md:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                    Explore our latest curation of hand-crafted fine jewelry, from signature
                    <Link href="/necklaces" className="text-gray-950 hover:text-[#E91E63] mx-1 transition-colors">necklaces</Link> to
                    <Link href="/earrings" className="text-gray-950 hover:text-[#E91E63] mx-1 transition-colors">sculptural earrings</Link>
                    designed for the modern individual.
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


        </main>
    );
}
