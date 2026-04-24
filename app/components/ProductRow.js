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
        <section className={`py-10 md:py-16 px-6 md:px-12 overflow-hidden transition-colors duration-500 ${isBestSeller ? 'bg-[#FFF8E1]/30 border-y border-amber-100' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <div className="flex flex-col gap-3">
                        <span className={`text-[11px] font-black tracking-[0.3em] uppercase ${isBestSeller ? 'text-amber-600' : 'text-[#E91E63]'}`}>
                            {isBestSeller ? 'TRUE TRENDS' : 'COLLECTION'}
                        </span>
                        <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${isBestSeller ? 'text-gray-900 flex items-center gap-3' : 'text-gray-900'}`}>
                            {title}
                            {isBestSeller && <span className="hidden md:block w-12 h-[2px] bg-amber-400 mt-2"></span>}
                        </h2>
                    </div>

                    <div className="flex items-center gap-8">
                        {!isBestSeller && (
                            <Link
                                href={viewAllLink}
                                className="group relative text-[12px] font-black tracking-[0.2em] uppercase transition-all pb-1 text-gray-400 hover:text-[#E91E63]"
                            >
                                VIEW ALL
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E91E63] transition-all group-hover:w-full"></span>
                            </Link>
                        )}

                        <div className="hidden md:flex gap-3">
                            <button
                                onClick={() => scroll('left')}
                                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex items-stretch gap-6 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="shrink-0 w-[260px] md:w-[300px] snap-start"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
