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

    return (
        <section className="py-20 px-6 md:px-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-[0.25em] text-[#E91E63] uppercase">
                            COLLECTION
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            {title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href={viewAllLink}
                            className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 hover:text-[#E91E63] transition-colors"
                        >
                            View All
                        </Link>

                        <div className="hidden md:flex gap-2">
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
