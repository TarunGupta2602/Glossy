import { supabase } from "@/lib/supabaseClient";
import ShopClient from "../components/ShopClient";

// Force dynamic rendering to ensure fresh data on every request (SSR)
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Shop All | GLOSSY.",
    description: "Explore our latest curation of hand-crafted fine jewelry.",
};

async function getShopData() {
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Fetch all categories
    const catRes = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
    const { categories, error: catError } = await catRes.json();

    if (catError) console.error("Error fetching categories:", catError);

    // Fetch all products
    const prodRes = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    const { products, error: prodError } = await prodRes.json();

    if (prodError) console.error("Error fetching products:", prodError);

    return {
        categories: categories || [],
        products: products || [],
    };
}

export default async function ShopPage() {
    const { categories, products } = await getShopData();

    return (
        <main className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="pt-5 pb-5 px-6 md:px-12 text-center max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-light text-gray-950 tracking-tighter mb-8">
                    New Arrivals
                </h1>
                <p className="text-base md:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                    Explore our latest curation of hand-crafted fine jewelry, from signature necklaces to
                    sculptural rings designed for the modern individual.
                </p>
            </section>

            {/* Main Content Area */}
            <section className="pb-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <ShopClient
                        initialProducts={products}
                        categories={categories}
                    />
                </div>
            </section>
        </main>
    );
}
