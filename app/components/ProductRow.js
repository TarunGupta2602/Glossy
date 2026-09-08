"use client";

import { HOME_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { PRODUCT_ROW_SIZES } from "@/lib/imageBlur";
import { useRef, useState, useEffect, useCallback } from "react";

export default function ProductRow({
    title,
    titleAccent,
    products,
    viewAllLink,
    reviewCounts = {},
    eyebrow = "Most loved",
}) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const productCount = products?.length || 0;

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return undefined;
        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [productCount, updateScrollState]);

    if (!products || products.length === 0) return null;

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollRef.current.scrollTo({
                left:
                    direction === "left"
                        ? scrollLeft - scrollAmount
                        : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-14 md:py-20 overflow-hidden bg-white">
            <div className={HOME_CONTAINER}>
                <div className="flex items-end justify-between mb-8 md:mb-12 gap-4">
                    <div className="min-w-0 text-left">
                        <p
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: "#b59e7b" }}
                        >
                            {eyebrow}
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-playfair font-medium text-[#2a2724] tracking-tight leading-[1.1]">
                            {title}
                            {titleAccent ? (
                                <>
                                    {" "}
                                    <em className="italic font-normal" style={{ color: "#b59e7b" }}>
                                        {titleAccent}
                                    </em>
                                </>
                            ) : null}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                        {viewAllLink && (
                            <Link
                                href={viewAllLink}
                                className="hidden sm:inline text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 hover:text-[#E91E63] transition-colors"
                            >
                                View more
                            </Link>
                        )}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => scroll("left")}
                                disabled={!canScrollLeft}
                                className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-800 hover:border-gray-400 transition-colors disabled:opacity-25 disabled:pointer-events-none"
                                aria-label="Previous"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => scroll("right")}
                                disabled={!canScrollRight}
                                className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-800 hover:border-gray-400 transition-colors disabled:opacity-25 disabled:pointer-events-none"
                                aria-label="Next"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex items-stretch gap-5 sm:gap-6 md:gap-7 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar scroll-smooth"
                >
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="shrink-0 w-[48vw] max-w-[240px] sm:w-[250px] sm:max-w-none md:w-[270px] snap-start"
                        >
                            <ProductCard
                                product={product}
                                reviewCount={reviewCounts[product.id] || 0}
                                priority={index < 2}
                                sizes={PRODUCT_ROW_SIZES}
                            />
                        </div>
                    ))}
                </div>

                {viewAllLink && (
                    <div className="sm:hidden mt-8 text-center">
                        <Link
                            href={viewAllLink}
                            className="inline-flex min-h-11 items-center text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-700 border-b border-gray-300"
                        >
                            View more
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
