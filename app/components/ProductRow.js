"use client";

import { HOME_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useRef } from "react";

export default function ProductRow({
    title,
    products,
    viewAllLink,
    reviewCounts = {},
    eyebrow = "Collection",
    accent = "pink",
}) {
    const scrollRef = useRef(null);

    if (!products || products.length === 0) return null;

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const isWarm = accent === "warm";

    return (
        <section
            className={`py-8 md:py-14 overflow-hidden transition-all duration-700 ${
                isWarm ? "bg-[#fdf9f7] border-y border-[#f8e5d9]/60" : "bg-white"
            }`}
        >
            <div className={HOME_CONTAINER}>
                <div className="flex items-end justify-between mb-5 md:mb-10 gap-3">
                    <div className="flex flex-col gap-1.5 md:gap-3 min-w-0">
                        <div className="flex items-center gap-3">
                            <div className={`h-px w-8 ${isWarm ? "bg-amber-400" : "bg-[#E91E63]"}`} />
                            <span
                                className={`text-[10px] font-black tracking-wider uppercase ${
                                    isWarm ? "text-amber-600" : "text-[#E91E63]"
                                }`}
                            >
                                {eyebrow}
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-5xl font-playfair font-bold text-gray-900 tracking-tight leading-none">
                            {title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 md:gap-8 flex-shrink-0">
                        {viewAllLink && (
                            <Link
                                href={viewAllLink}
                                className="text-[10px] sm:text-[11px] font-black tracking-wide uppercase text-gray-600 hover:text-[#E91E63] transition-colors"
                            >
                                View all
                            </Link>
                        )}

                        <div className="hidden sm:flex gap-2 md:gap-4">
                            <button
                                type="button"
                                onClick={() => scroll("left")}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group shadow-sm bg-white"
                                aria-label="Previous"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-[18px] md:h-[18px] transform group-hover:-translate-x-0.5 transition-transform" aria-hidden="true">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => scroll("right")}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group shadow-sm bg-white"
                                aria-label="Next"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-[18px] md:h-[18px] transform group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex items-stretch gap-3 sm:gap-4 md:gap-10 overflow-x-auto pb-4 md:pb-10 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="shrink-0 w-[46vw] max-w-[200px] sm:w-[280px] sm:max-w-none md:w-[340px] snap-start"
                        >
                            <ProductCard
                                product={product}
                                reviewCount={reviewCounts[product.id] || 0}
                                priority={index < 2}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
