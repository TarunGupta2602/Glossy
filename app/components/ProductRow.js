"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useRef } from "react";

export default function ProductRow({ title, products, viewAllLink }) {
    const scrollRef = useRef(null);

    if (!products || products.length === 0) return null;

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const isBestSeller = title.includes("Best Sellers");

    return (
        <section className={`py-16 md:py-24 px-6 md:px-12 overflow-hidden transition-all duration-700 ${isBestSeller ? 'bg-[#fdf9f7] border-y border-[#f8e5d9]/60' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Refined Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`h-[1px] w-8 ${isBestSeller ? 'bg-amber-400' : 'bg-[#E91E63]'}`} />
                            <span className={`text-[10px] font-black tracking-[0.4em] uppercase ${isBestSeller ? 'text-amber-600' : 'text-[#E91E63]'}`}>
                                {isBestSeller ? 'TRUE TRENDS' : 'COLLECTION'}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-playfair font-bold text-gray-900 tracking-tight leading-none group">
                            {title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-12 self-end md:self-auto">
                        {!isBestSeller && (
                            <Link
                                href={viewAllLink}
                                className="group flex items-center gap-2 text-[11px] font-black tracking-[0.25em] uppercase text-gray-400 hover:text-[#E91E63] transition-all duration-300"
                            >
                                <span className="relative pb-1">
                                    View All
                                    <span className="absolute bottom-0 left-0 w-4 h-[1.5px] bg-[#E91E63] transition-all group-hover:w-full"></span>
                                </span>
                            </Link>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group shadow-sm bg-white"
                                aria-label="Previous"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group shadow-sm bg-white"
                                aria-label="Next"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6 6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex items-stretch gap-6 md:gap-10 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="shrink-0 w-[280px] md:w-[340px] snap-start"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

