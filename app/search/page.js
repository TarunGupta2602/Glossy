import SearchClient from "./SearchClient";
import { getBaseUrl } from "@/lib/getBaseUrl";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
    const { q: query } = await searchParams;
    let products = [];

    if (query) {
        try {
            const base = getBaseUrl();
            const res = await fetch(
                `${base}/api/products?q=${encodeURIComponent(query)}`,
                { cache: "no-store" }
            );
            const data = await res.json();
            if (data.success) {
                products = data.products;
            }
        } catch (err) {
            console.error("Search fetch error:", err);
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <SearchClient query={query} products={products} />
        </main>
    );
}
