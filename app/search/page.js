import { supabase } from "@/lib/supabaseClient";
import SearchClient from "./SearchClient";

export default async function SearchPage({ searchParams }) {
    const { q: query } = await searchParams;

    let products = [];
    if (query) {
        const { data, error } = await supabase
            .from("products")
            .select(`
                *,
                categories(name)
            `)
            .ilike("name", `%${query}%`)
            .order("created_at", { ascending: false });

        if (!error && data) {
            products = data;
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <SearchClient query={query} products={products} />
        </main>
    );
}
