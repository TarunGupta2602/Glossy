"use client";

import { useMemo, useState, useTransition } from "react";
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
    const [showAllMobile, setShowAllMobile] = useState(false);
    const [animKey, setAnimKey] = useState(0);

    const activeTab = useMemo(
        () => safeTabs.find((tab) => tab.id === activeId) || safeTabs[0],
        [safeTabs, activeId]
    );

    if (!safeTabs.length || !activeTab) return null;

    const products = activeTab.products || [];
    const mobileLimit = showAllMobile ? 8 : 4;

    const selectTab = (id) => {
        if (id === activeId) return;
        startTransition(() => {
            setActiveId(id);
            setShowAllMobile(false);
            setAnimKey((k) => k + 1);
        });
    };

    return (
        <section
            className={`${className || HOME_SECTION_Y} bg-[#fdfbf7] ${HOME_SURFACE_EDGE}`}
        >
            <div className={HOME_CONTAINER}>
                <div
                    className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 ${HOME_SECTION_HEADER_GAP} px-1`}
                >
                    <div className="text-left">
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
                </div>

                <div className="mb-8 md:mb-9 overflow-x-auto no-scrollbar">
                    <div
                        className="flex md:flex-wrap items-center justify-start gap-2 w-max md:w-auto pb-0.5"
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
                            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:gap-x-6 md:gap-y-12 transition-opacity duration-200 ${
                                isPending ? "opacity-55" : "opacity-100"
                            }`}
                        >
                            {products.slice(0, 8).map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`product-card-in ${
                                        index >= mobileLimit ? "hidden md:block" : ""
                                    }`}
                                    style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}
                                >
                                    <ProductCard
                                        product={product}
                                        {...reviewCardProps(reviewCounts, product.id)}
                                        priority={index < 1}
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                </div>
                            ))}
                        </div>

                        {products.length > 4 && !showAllMobile && (
                            <div className="mt-6 text-center md:hidden">
                                <button
                                    type="button"
                                    onClick={() => setShowAllMobile(true)}
                                    className="min-h-11 px-5 text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-800 border border-gray-300 rounded-full hover:border-[#b89a6a] transition-colors"
                                >
                                    Show more
                                </button>
                            </div>
                        )}

                        {activeTab.href && activeTab.href !== "/shop" && (
                            <div className="mt-8 md:mt-10 text-center">
                                <Link
                                    href={activeTab.href}
                                    className="inline-flex items-center gap-2 min-h-11 text-[11px] font-semibold tracking-[0.16em] uppercase text-gray-900 hover:text-[#E91E63] transition-colors"
                                >
                                    View all {activeTab.label === "All" ? "styles" : activeTab.label}
                                    <span aria-hidden>→</span>
                                </Link>
                            </div>
                        )}
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
