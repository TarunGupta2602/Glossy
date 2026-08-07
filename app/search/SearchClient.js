"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategoryPagination from "../components/CategoryPagination";
import { PAGE_SIZE } from "@/lib/shopQueries";
import { trackSearch } from "@/lib/gtag";

export default function SearchClient({
    query,
    products = [],
    reviewCounts = {},
    totalCount = 0,
    totalPages = 0,
    currentPage = 1,
}) {
    const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const showingTo = Math.min(currentPage * PAGE_SIZE, totalCount);

    useEffect(() => {
        if (query?.trim()) {
            trackSearch(query.trim(), totalCount);
        }
    }, [query, totalCount]);

    return (
        <div className={`${SITE_CONTAINER} py-8 md:py-12 lg:py-20`}>
            <header className="mb-8 md:mb-12">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 mb-2 break-words">
                    {query ? (
                        <>
                            Search results for{" "}
                            <span className="text-[#E91E63]">&ldquo;{query}&rdquo;</span>
                        </>
                    ) : (
                        "Search results"
                    )}
                </h1>
                <p className="text-sm md:text-base text-gray-500 font-medium">
                    {totalCount === 0
                        ? "We couldn't find any products matching your search."
                        : totalPages > 1
                          ? `Showing ${showingFrom}–${showingTo} of ${totalCount} products`
                          : `Showing ${totalCount} product${totalCount === 1 ? "" : "s"}.`}
                </p>
            </header>

            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                reviewCount={reviewCounts[product.id] || 0}
                            />
                        ))}
                    </div>
                    <CategoryPagination
                        basePath="/search"
                        page={currentPage}
                        totalPages={totalPages}
                        queryParams={{ q: query }}
                    />
                </>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 max-w-sm mb-8">
                        Try searching for earrings, necklaces, or anti-tarnish jewellery.
                    </p>
                    <a
                        href="/shop"
                        className="bg-gray-900 text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                    >
                        Browse All Jewellery
                    </a>
                </div>
            )}
        </div>
    );
}
