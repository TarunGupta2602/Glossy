import SearchClient from "./SearchClient";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { calculateDiscount } from "@/lib/discountUtils";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Search Results | The luxe jewels",
    description: "Search for anti-tarnish, waterproof, and premium jewelry across The luxe jewels collections.",
    robots: {
        index: false,
        follow: true,
    },
};

export default async function SearchPage({ searchParams }) {
    const { q: query } = await searchParams;
    let products = [];

    if (query) {
        const supabase = getServiceClient();

        const { data, error } = await supabase
            .from("products")
            .select("*, categories(name, id, slug)")
            .ilike("name", `%${query}%`)
            .order("created_at", { ascending: false });

        if (!error && data) {
            // Calculate discounts server-side for each product
            products = data.map(product => ({
                ...product,
                calculated_discount: product.original_price
                    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                    : calculateDiscount(product.id)
            }));
        } else if (error) {
            console.error("Search error:", error);
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <SearchClient query={query} products={products} />
        </main>
    );
}
