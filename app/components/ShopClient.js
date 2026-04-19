"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import ShopSidebar from "./ShopSidebar";

export default function ShopClient({ initialProducts, categories }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const itemsPerPage = 9;

    const handleCategoryChange = (id) => {
        if (id === "all") {
            setSelectedCategories([]);
        } else {
            setSelectedCategories((prev) =>
                prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
            );
        }
        setCurrentPage(1);
    };

    const filteredProducts = useMemo(() => {
        let result = initialProducts.filter((product) => {
            const matchCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(product.category_id);
            const matchPrice =
                product.price >= priceRange[0] && product.price <= priceRange[1];
            return matchCategory && matchPrice;
        });

        if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
        else if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

        return result;
    }, [initialProducts, selectedCategories, priceRange, sortBy]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000;

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-24 relative">

            {/* Mobile Filter Button - "Smart" Floating Action Button at Bottom */}
            <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[90]">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2.5 bg-gray-950 text-white pl-5 pr-6 py-3.5 rounded-full text-[13px] font-bold tracking-tight shadow-2xl shadow-black/20 active:scale-95 transition-all border border-white/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                    Filter & Sort
                </button>
            </div>

            {/* Top mobile status - minimal */}
            <div className="md:hidden flex items-center justify-between mb-6">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Collection
                </div>
                <div className="text-[11px] font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">
                    {filteredProducts.length} items found
                </div>
            </div>

            {/* Sidebar - Drawer for mobile, Static for desktop */}
            <div className={`
                fixed inset-0 z-[100] md:relative md:inset-auto md:z-30 md:block
                ${isSidebarOpen ? "block" : "hidden md:block"}
            `}>
                {/* Backdrop for mobile */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />

                <div className={`
                    absolute left-0 top-0 bottom-0 w-[85%] max-w-xs bg-white p-8 overflow-y-auto 
                    md:relative md:w-56 md:p-0 md:bg-transparent md:overflow-visible
                    transition-transform duration-300 ease-out
                    md:sticky md:top-32 md:h-fit
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}>
                    <div className="flex items-center justify-between mb-8 md:hidden">
                        <h2 className="text-lg font-bold">Filters</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <ShopSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceChange={(val) => {
                            setPriceRange(val);
                            setCurrentPage(1);
                        }}
                        sortBy={sortBy}
                        onSortChange={(val) => { setSortBy(val); setCurrentPage(1); }}
                        totalProducts={filteredProducts.length}
                    />

                    {/* Show results button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold mt-10 md:hidden"
                    >
                        Show {filteredProducts.length} Results
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 relative">

                {/* Top bar: count + sort - Hide on mobile (now in drawer) */}
                <div className="hidden md:flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <p className="text-[13px] text-gray-400">
                            <span className="text-gray-900 font-semibold">{filteredProducts.length}</span> products
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={() => { setSelectedCategories([]); setPriceRange([0, 5000]); setSortBy("newest"); }}
                                className="text-[11px] text-[#E91E63] font-semibold tracking-wide hover:underline underline-offset-2"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div className="hidden md:block">
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                            className="text-[12px] text-gray-600 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#E91E63] cursor-pointer appearance-none pr-8"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">Name A–Z</option>
                        </select>
                    </div>
                </div>

                {paginatedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex items-center justify-center gap-2">
                                {/* Prev */}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border border-gray-100 transition-colors ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:border-[#E91E63] text-gray-600 hover:text-[#E91E63]"}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1;
                                    if (totalPages > 7 && page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 2) {
                                        if (page === 2 || page === totalPages - 1) {
                                            return <span key={page} className="text-gray-300 px-1">…</span>;
                                        }
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-all ${currentPage === page ? "bg-[#E91E63] text-white shadow-md" : "text-gray-500 border border-gray-100 hover:border-[#E91E63] hover:text-[#E91E63]"}`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Next */}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border border-gray-100 transition-colors ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:border-[#E91E63] text-gray-600 hover:text-[#E91E63]"}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24 px-6 border border-dashed border-gray-200 rounded-3xl">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-[14px]">No products match your selection.</p>
                        <button
                            onClick={() => { setSelectedCategories([]); setPriceRange([0, 5000]); }}
                            className="mt-4 text-[#E91E63] font-bold text-[13px] underline underline-offset-4"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
