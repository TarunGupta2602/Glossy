"use client";

import { useState } from "react";

export default function ShopSidebar({
    categories,
    selectedCategories,
    onCategoryChange,
    priceRange,
    onPriceChange,
    sortBy,
    onSortChange,
    totalProducts,
}) {
    const MAX_PRICE = 5000;

    const handleMinChange = (e) => {
        const val = Math.min(parseInt(e.target.value), priceRange[1] - 100);
        onPriceChange([val, priceRange[1]]);
    };

    const handleMaxChange = (e) => {
        const val = Math.max(parseInt(e.target.value), priceRange[0] + 100);
        onPriceChange([priceRange[0], val]);
    };

    const minPercent = (priceRange[0] / MAX_PRICE) * 100;
    const maxPercent = (priceRange[1] / MAX_PRICE) * 100;

    return (
        <aside className="space-y-10">
            {/* Sort & Count Section (Moved from top bar) */}
            <div className="pb-6 border-b border-gray-100">
                <div className="mb-4">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                        Sort By
                    </span>
                    <div className="relative mt-3">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full text-[13px] font-medium text-gray-700 border border-gray-100 rounded-xl px-4 py-2.5 bg-gray-50/50 hover:bg-white hover:border-[#E91E63] focus:outline-none focus:border-[#E91E63] transition-all cursor-pointer appearance-none pr-10"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">Name A–Z</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                        Density
                    </span>
                    <span className="text-[11px] font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-full">
                        {totalProducts} Items
                    </span>
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h3 className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-5">
                    Category
                </h3>
                <div className="space-y-3">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => onCategoryChange("all")}
                    >
                        <div
                            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-200
                                ${selectedCategories.length === 0
                                    ? "bg-[#E91E63] border-[#E91E63]"
                                    : "border-gray-200 group-hover:border-[#E91E63] bg-white"
                                }`}
                        >
                            {selectedCategories.length === 0 && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span
                            className={`text-[13px] transition-colors leading-none ${selectedCategories.length === 0
                                ? "text-gray-900 font-semibold"
                                : "text-gray-400 group-hover:text-gray-700"
                                }`}
                        >
                            All Jewelry
                        </span>
                    </div>

                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => onCategoryChange(category.id)}
                        >
                            <div
                                className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-all duration-200
                                    ${selectedCategories.includes(category.id)
                                        ? "bg-[#E91E63] border-[#E91E63]"
                                        : "border-gray-200 group-hover:border-[#E91E63] bg-white"
                                    }`}
                            >
                                {selectedCategories.includes(category.id) && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span
                                className={`text-[13px] transition-colors leading-none ${selectedCategories.includes(category.id)
                                    ? "text-gray-900 font-semibold"
                                    : "text-gray-400 group-hover:text-gray-700"
                                    }`}
                            >
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Price Range Filter */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                        Price Range
                    </h3>
                </div>

                {/* Price Labels */}
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-center">
                        <span className="text-[11px] text-gray-400 block leading-none mb-0.5">MIN</span>
                        <span className="text-[13px] font-semibold text-gray-800">₹{priceRange[0].toLocaleString()}</span>
                    </div>
                    <div className="h-px w-4 bg-gray-200" />
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-center">
                        <span className="text-[11px] text-gray-400 block leading-none mb-0.5">MAX</span>
                        <span className="text-[13px] font-semibold text-gray-800">₹{priceRange[1].toLocaleString()}</span>
                    </div>
                </div>

                {/* Dual Range Slider */}
                <div className="relative h-5 flex items-center mt-2">
                    {/* Track background */}
                    <div className="absolute w-full h-1 bg-gray-100 rounded-full" />

                    {/* Active track */}
                    <div
                        className="absolute h-1 bg-[#E91E63] rounded-full"
                        style={{
                            left: `${minPercent}%`,
                            width: `${maxPercent - minPercent}%`,
                        }}
                    />

                    {/* Min thumb */}
                    <input
                        type="range"
                        min="0"
                        max={MAX_PRICE}
                        step="100"
                        value={priceRange[0]}
                        onChange={handleMinChange}
                        className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-20"
                        style={{ pointerEvents: "auto" }}
                    />

                    {/* Max thumb */}
                    <input
                        type="range"
                        min="0"
                        max={MAX_PRICE}
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => {
                            const val = Math.max(parseInt(e.target.value), priceRange[0] + 100);
                            onPriceChange([priceRange[0], val]);
                        }}
                        className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-30"
                        style={{ pointerEvents: "auto" }}
                    />
                </div>

                {/* Range endpoints */}
                <div className="flex justify-between mt-3">
                    <span className="text-[10px] text-gray-300">₹0</span>
                    <span className="text-[10px] text-gray-300">₹5,000</span>
                </div>
            </div>



            <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #E91E63;
                    box-shadow: 0 1px 6px rgba(233,30,99,0.25);
                    cursor: pointer;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 2px 10px rgba(233,30,99,0.4);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #E91E63;
                    box-shadow: 0 1px 6px rgba(233,30,99,0.25);
                    cursor: pointer;
                }
            `}</style>
        </aside>
    );
}
