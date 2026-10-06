"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { reviewCardProps } from "@/lib/reviewDisplay";
import ShopSidebar from "./ShopSidebar";
import { PAGE_SIZE } from "@/lib/shopQueries";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOverlayOpen } from "../context/OverlayContext";

function buildShopUrl({ page = 1, sort = "newest", categories = [], min = 0, max = 5000 }) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (sort !== "newest") params.set("sort", sort);
    if (categories.length) params.set("category", categories.join(","));
    if (min > 0) params.set("min", String(min));
    if (max < 5000) params.set("max", String(max));
    return `/shop?${params.toString()}`;
}

export default function ShopClient({
    products,
    categories,
    totalCount,
    totalPages,
    currentPage,
    sortBy,
    selectedCategories,
    priceRange,
    reviewCounts = {},
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [minPrice, maxPrice] = priceRange;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useBodyScrollLock(isSidebarOpen);
    useOverlayOpen(isSidebarOpen);

    useEffect(() => {
        if (!isSidebarOpen) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") setIsSidebarOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isSidebarOpen]);

    const navigate = (updates) => {
        const href = buildShopUrl({
            page: updates.page ?? 1,
            sort: updates.sort ?? sortBy,
            categories: updates.categories ?? selectedCategories,
            min: updates.min ?? minPrice,
            max: updates.max ?? maxPrice,
        });
        startTransition(() => {
            router.push(href);
        });
    };

    const hasActiveFilters =
        selectedCategories.length > 0 || minPrice > 0 || maxPrice < 5000 || sortBy !== "newest";

    const sortOptions = [
        { value: "popular", label: "Best Sellers" },
        { value: "newest", label: "Newest" },
        { value: "price-asc", label: "Price ↑" },
        { value: "price-desc", label: "Price ↓" },
        { value: "name", label: "A–Z" },
    ];

    const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const showingTo = Math.min(currentPage * PAGE_SIZE, totalCount);

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 relative">
            <div className="md:hidden sticky top-12 sm:top-14 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-white/95 backdrop-blur border-b border-gray-100 mb-4 flex items-center gap-2">
                <p className="text-[12px] font-semibold text-gray-900 shrink-0 tabular-nums">
                    {totalCount} {totalCount === 1 ? "piece" : "pieces"}
                </p>
                <label className="relative min-w-0 flex-1">
                    <select
                        value={sortBy}
                        onChange={(e) => navigate({ sort: e.target.value, page: 1 })}
                        aria-label="Sort products"
                        className="h-10 w-full appearance-none rounded-full bg-[#f4f2f0] pl-3 pr-8 text-[12px] font-semibold text-[#2a2724]"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8a847c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </label>
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="relative h-10 shrink-0 rounded-full bg-[#2a2724] px-4 text-[12px] font-semibold text-white active:scale-95"
                >
                    Filter
                    {hasActiveFilters && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E91E63]" aria-hidden />
                    )}
                </button>
            </div>

            <div className={`fixed inset-0 z-[100] md:relative md:inset-auto md:z-30 md:block ${isSidebarOpen ? "block" : "hidden md:block"}`}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)} />
                <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-xs bg-white p-6 sm:p-8 overflow-y-auto overscroll-contain pb-[calc(2rem+env(safe-area-inset-bottom,0px))] md:relative md:w-56 md:p-0 md:pb-0 md:bg-transparent md:overflow-visible transition-transform duration-300 ease-out md:sticky md:top-32 md:h-fit ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                    <div className="flex items-center justify-between mb-6 md:hidden">
                        <h2 className="text-lg font-bold">Filters</h2>
                        <div className="flex items-center gap-1">
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.push("/shop?page=1");
                                        setIsSidebarOpen(false);
                                    }}
                                    className="text-[11px] font-bold text-[#E91E63] px-2 min-h-11"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(false)}
                                className="w-11 h-11 flex items-center justify-center -mr-2 text-gray-500"
                                aria-label="Close filters"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <ShopSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={(id) => {
                            const next =
                                id === "all"
                                    ? []
                                    : selectedCategories.includes(String(id))
                                      ? selectedCategories.filter((c) => c !== String(id))
                                      : [...selectedCategories, String(id)];
                            navigate({ categories: next, page: 1 });
                        }}
                        priceRange={priceRange}
                        onPriceChange={(val) => navigate({ min: val[0], max: val[1], page: 1 })}
                        sortBy={sortBy}
                        onSortChange={(val) => navigate({ sort: val, page: 1 })}
                        totalProducts={totalCount}
                    />

                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="w-full bg-[#E91E63] text-white py-4 min-h-12 rounded-xl font-bold mt-10 md:hidden"
                    >
                        Show {totalCount} Results
                    </button>
                </div>
            </div>

            <div className={`flex-1 min-w-0 relative pb-4 md:pb-0 transition-[opacity,transform] duration-300 ${isPending ? "opacity-55 translate-y-0.5" : "opacity-100 translate-y-0"}`}>
                {isPending && (
                    <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none">
                        <span className="mt-2 rounded-full bg-white border border-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E91E63] shadow-sm">
                            Updating…
                        </span>
                    </div>
                )}

                {(selectedCategories.length > 0 || minPrice > 0 || maxPrice < 5000) && (
                    <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-5">
                        {selectedCategories.map((id) => {
                            const cat = categories.find((c) => String(c.id) === String(id));
                            if (!cat) return null;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() =>
                                        navigate({
                                            categories: selectedCategories.filter((c) => c !== String(id)),
                                            page: 1,
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 min-h-9 rounded-full bg-[#fdf2f6] border border-[#E91E63]/20 px-3 text-[11px] font-semibold text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition-colors"
                                >
                                    {cat.name}
                                    <span aria-hidden>×</span>
                                </button>
                            );
                        })}
                        {(minPrice > 0 || maxPrice < 5000) && (
                            <button
                                type="button"
                                onClick={() => navigate({ min: 0, max: 5000, page: 1 })}
                                className="inline-flex items-center gap-1.5 min-h-9 rounded-full bg-gray-100 border border-gray-200 px-3 text-[11px] font-semibold text-gray-700 hover:border-gray-400 transition-colors"
                            >
                                ₹{minPrice}–₹{maxPrice}
                                <span aria-hidden>×</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => router.push("/shop?page=1")}
                            className="text-[11px] font-semibold text-gray-500 underline underline-offset-2 min-h-9 px-1"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                <div className="hidden md:flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <p className="text-[13px] text-gray-600">
                            {totalCount > 0 ? (
                                <>Showing <span className="text-gray-900 font-semibold">{showingFrom}–{showingTo}</span> of <span className="text-gray-900 font-semibold">{totalCount}</span> products</>
                            ) : (
                                <>No products found</>
                            )}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={() => router.push("/shop?page=1")}
                                className="text-[11px] text-[#E91E63] font-semibold tracking-wide hover:underline underline-offset-2"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-10">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    {...reviewCardProps(reviewCounts, product.id)}
                                    priority={index < 1}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12 md:mt-20 flex items-center justify-center gap-2 flex-wrap">
                                <Link
                                    href={buildShopUrl({ page: Math.max(1, currentPage - 1), sort: sortBy, categories: selectedCategories, min: minPrice, max: maxPrice })}
                                    className={`min-w-11 min-h-11 flex items-center justify-center rounded-lg border border-gray-100 transition-colors ${currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:border-[#E91E63] text-gray-600 hover:text-[#E91E63]"}`}
                                    aria-disabled={currentPage === 1}
                                >
                                    ‹
                                </Link>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                    if (totalPages > 7 && pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 2) {
                                        if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="text-gray-300 px-1">…</span>;
                                        return null;
                                    }
                                    return (
                                        <Link
                                            key={pageNum}
                                            href={buildShopUrl({ page: pageNum, sort: sortBy, categories: selectedCategories, min: minPrice, max: maxPrice })}
                                            className={`min-w-11 min-h-11 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-all ${currentPage === pageNum ? "bg-[#E91E63] text-white shadow-md" : "text-gray-500 border border-gray-100 hover:border-[#E91E63] hover:text-[#E91E63]"}`}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}

                                <Link
                                    href={buildShopUrl({ page: Math.min(totalPages, currentPage + 1), sort: sortBy, categories: selectedCategories, min: minPrice, max: maxPrice })}
                                    className={`min-w-11 min-h-11 flex items-center justify-center rounded-lg border border-gray-100 transition-colors ${currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:border-[#E91E63] text-gray-600 hover:text-[#E91E63]"}`}
                                    aria-disabled={currentPage === totalPages}
                                >
                                    ›
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16 md:py-24 px-6 border border-dashed border-gray-200 rounded-3xl">
                        <p className="text-gray-500 font-medium text-[14px]">No products match your selection.</p>
                        <Link href="/shop?page=1" className="mt-4 inline-block text-[#E91E63] font-bold text-[13px] underline underline-offset-4 min-h-11 leading-[2.75rem]">
                            Clear all filters
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
