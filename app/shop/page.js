import ShopClient from "../components/ShopClient";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Shop All | GLOSSY.",
    description: "Explore our latest curation of hand-crafted fine jewelry.",
};

async function getShopData() {
    const base = getBaseUrl();

    const [catRes, prodRes] = await Promise.all([
        fetch(`${base}/api/categories`, { cache: "no-store" }),
        fetch(`${base}/api/products`, { cache: "no-store" }),
    ]);

    const { categories } = await catRes.json();
    const { products } = await prodRes.json();

    return {
        categories: categories || [],
        products: products || [],
    };
}

export default async function ShopPage() {
    const { categories, products } = await getShopData();

    return (
        <main className="min-h-screen bg-white">
            <section className="pt-5 pb-5 px-6 md:px-12 text-center max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-light text-gray-950 tracking-tighter mb-8">
                    New Arrivals
                </h1>
                <p className="text-base md:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                    Explore our latest curation of hand-crafted fine jewelry, from signature necklaces to
                    sculptural rings designed for the modern individual.
                </p>
            </section>

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
