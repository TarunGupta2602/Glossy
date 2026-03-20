import SearchClient from "./SearchClient";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export const dynamic = "force-dynamic";

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
            products = data;
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
