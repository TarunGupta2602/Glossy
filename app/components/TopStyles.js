"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
    HOME_CONTAINER,
    HOME_SECTION_Y,
    HOME_SECTION_HEADER_GAP,
    HOME_SURFACE_EDGE,
} from "@/lib/siteLayout";
import ProductCard from "./ProductCard";
import { reviewCardProps } from "@/lib/reviewDisplay";

export default function TopStyles({ tabs = [], reviewCounts = {}, className = "" }) {
    const safeTabs = tabs.filter((tab) => tab?.id && Array.isArray(tab.products));
    const [activeId, setActiveId] = useState(safeTabs[0]?.id || "all");
    const [isPending, startTransition] = useTransition();
    const [animKey, setAnimKey] = useState(0);
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const activeTab = useMemo(
        () => safeTabs.find((tab) => tab.id === activeId) || safeTabs[0],
        [safeTabs, activeId]
    );

    const products = activeTab?.products || [];
    const productCount = products.length;

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return undefined;
        el.scrollTo({ left: 0 });
        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [activeId, animKey, productCount, updateScrollState]);

    if (!safeTabs.length || !activeTab) return null;

    const selectTab = (id) => {
        if (id === activeId) return;
        startTransition(() => {
            setActiveId(id);
            setAnimKey((k) => k + 1);
        });
    };

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.85;
        el.scrollTo({
            left: direction === "left" ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section
            className={`${className || HOME_SECTION_Y} bg-[#fdfbf7] ${HOME_SURFACE_EDGE} overflow-hidden`}
        >
            <div className={HOME_CONTAINER}>
                <div
                    className={`flex items-end justify-between gap-4 ${HOME_SECTION_HEADER_GAP} px-1`}
                >
                    <div className="text-left min-w-0">
                        <p
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: "#b89a6a" }}
                        >
                            Browse
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-playfair font-medium text-[#2a2724] tracking-tight">
                            Top{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                styles
                            </em>
                        </h2>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-800 hover:border-gray-400 transition-colors disabled:opacity-25 disabled:pointer-events-none"
                            aria-label="Previous styles"
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
                            aria-label="Next styles"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mb-6 md:mb-8 overflow-x-auto no-scrollbar">
                    <div
                        className="flex items-center justify-start gap-2 w-max pb-0.5"
                        role="tablist"
                        aria-label="Shop by style"
                    >
                        {safeTabs.map((tab) => {
                            const isActive = tab.id === activeTab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => selectTab(tab.id)}
                                    className={`shrink-0 px-4 sm:px-5 py-2 min-h-10 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-full border transition-all duration-300 ease-out active:scale-95 ${
                                        isActive
                                            ? "bg-[#2a2724] text-white border-[#2a2724]"
                                            : "bg-transparent text-[#6b6560] border-[#e0d8ce] hover:border-[#b89a6a] hover:text-[#2a2724]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {products.length > 0 ? (
                    <>
                        <div
                            key={`${activeTab.id}-${animKey}`}
                            ref={scrollRef}
                            className={`flex items-stretch gap-3 sm:gap-5 md:gap-6 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar scroll-smooth transition-opacity duration-200 ${
                                isPending ? "opacity-55" : "opacity-100"
                            }`}
                        >
                            {products.slice(0, 10).map((product, index) => (
                                <div
                                    key={product.id}
                                    className="product-scroll-rise shrink-0 w-[44vw] max-w-[220px] sm:w-[230px] sm:max-w-none md:w-[calc((100%-4.5rem)/4)] md:min-w-[200px] md:max-w-[260px] snap-start"
                                    style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
                                >
                                    <ProductCard
                                        product={product}
                                        {...reviewCardProps(reviewCounts, product.id)}
                                        priority={index < 1}
                                        sizes="(max-width: 768px) 44vw, 25vw"
                                    />
                                </div>
                            ))}
                        </div>

                        {activeTab.href ? (
                            <div className="mt-8 md:mt-10 text-center">
                                <Link
                                    href={activeTab.href}
                                    className="inline-flex items-center gap-2 min-h-11 text-[11px] font-semibold tracking-[0.16em] uppercase text-gray-900 hover:text-[#E91E63] transition-colors"
                                >
                                    View all {activeTab.label === "All" ? "styles" : activeTab.label}
                                    <span aria-hidden>→</span>
                                </Link>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <p className="text-center text-sm text-gray-500 py-10">
                        No products in this collection yet.
                    </p>
                )}
            </div>
        </section>
    );
}
