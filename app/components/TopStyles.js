"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import ProductCard from "./ProductCard";

export default function TopStyles({ tabs = [], reviewCounts = {} }) {
    const safeTabs = tabs.filter((tab) => tab?.id && Array.isArray(tab.products));
    const [activeId, setActiveId] = useState(safeTabs[0]?.id || "all");
    const [isPending, startTransition] = useTransition();
    const [showAllMobile, setShowAllMobile] = useState(false);

    const activeTab = useMemo(
        () => safeTabs.find((tab) => tab.id === activeId) || safeTabs[0],
        [safeTabs, activeId]
    );

    if (!safeTabs.length || !activeTab) return null;

    const products = activeTab.products || [];
    const mobileLimit = showAllMobile ? 8 : 4;

    const selectTab = (id) => {
        startTransition(() => {
            setActiveId(id);
            setShowAllMobile(false);
        });
    };

    return (
        <section className="py-14 md:py-20 bg-white">
            <div className={HOME_CONTAINER}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-12 px-1">
                    <div className="text-left">
                        <p
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: "#b59e7b" }}
                        >
                            Browse
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-playfair font-medium text-[#2a2724] tracking-tight">
                            Top{" "}
                            <em className="italic font-normal" style={{ color: "#b59e7b" }}>
                                styles
                            </em>
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full border border-[#e8e0d6] bg-[#f7f2ea] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2a2724] hover:border-[#b59e7b] transition-colors"
                    >
                        Explore shop
                        <span aria-hidden>→</span>
                    </Link>
                </div>

                <div className="mb-8 md:mb-10 overflow-x-auto no-scrollbar">
                    <div className="flex md:flex-wrap items-center justify-start gap-2 sm:gap-2.5 w-max md:w-auto">
                        {safeTabs.map((tab) => {
                            const isActive = tab.id === activeTab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => selectTab(tab.id)}
                                    className={`shrink-0 px-4 sm:px-5 py-2.5 min-h-10 text-[11px] font-semibold tracking-[0.1em] uppercase rounded-full border transition-all duration-200 active:scale-95 ${
                                        isActive
                                            ? "bg-[#2a2724] text-white border-[#2a2724]"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                    }`}
                                    aria-pressed={isActive}
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
                            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 transition-opacity duration-200 ${
                                isPending ? "opacity-50" : "opacity-100"
                            }`}
                        >
                            {products.slice(0, 8).map((product, index) => (
                                <div
                                    key={product.id}
                                    className={index >= mobileLimit ? "hidden md:block" : undefined}
                                >
                                    <ProductCard
                                        product={product}
                                        reviewCount={reviewCounts[product.id] || 0}
                                        priority={index < 2}
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
                                    className="min-h-11 px-5 text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-800 border border-gray-300 rounded-full"
                                >
                                    Show more
                                </button>
                            </div>
                        )}

                        {activeTab.href && (
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
