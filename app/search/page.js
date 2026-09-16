import SearchClient from "./SearchClient";
import { redirect } from "next/navigation";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { searchProducts } from "@/lib/shopQueries";
import { getReviewCounts } from "@/lib/reviewCounts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const query = params?.q?.trim();

    if (query) {
        return {
            title: `Search: ${query}`,
            description: `Search results for "${query}" at The Luxe Jewels.`,
            robots: { index: false, follow: true },
            alternates: { canonical: "/search" },
        };
    }

    return {
        title: "Search Jewellery",
        description: "Search anti-tarnish jewellery across The Luxe Jewels collections.",
        robots: { index: false, follow: true },
        alternates: { canonical: "/search" },
    };
}

export default async function SearchPage({ searchParams }) {
    const params = await searchParams;
    const query = params?.q;
    const page = parseInt(params?.page || "1", 10);

    if (isNaN(page) || page < 1) {
        redirect(query ? `/search?q=${encodeURIComponent(query)}&page=1` : "/search");
    }

    let products = [];
    let totalCount = 0;
    let totalPages = 0;
    let currentPage = 1;

    if (query) {
        const result = await searchProducts(query, { page });
        products = result.products.map(withCalculatedDiscount);
        totalCount = result.totalCount;
        totalPages = result.totalPages;
        currentPage = result.page;

        if (page > totalPages && totalCount > 0) {
            redirect(`/search?q=${encodeURIComponent(query)}&page=${totalPages}`);
        }
    }

    const reviewCounts = await getReviewCounts(products.map((p) => p.id));

    return (
        <main className="min-h-screen bg-white">
            <SearchClient
                query={query}
                products={products}
                reviewCounts={reviewCounts}
                totalCount={totalCount}
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </main>
    );
}
