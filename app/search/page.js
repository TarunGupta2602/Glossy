import SearchClient from "./SearchClient";
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
    const { q: query } = await searchParams;



    let products = [];
    if (query) {
        try {
            const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                products = data.products;
            }
        } catch (error) {
            console.error("Search Error:", error);
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <SearchClient query={query} products={products} />
        </main>
    );
}
