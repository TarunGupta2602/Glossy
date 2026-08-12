"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { HOME_CONTAINER, HOME_EDGE_SCROLL } from "@/lib/siteLayout";
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
        <section className="py-8 md:py-14 bg-white border-t border-gray-100">
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-5 md:mb-8 px-2">
                    <h2 className="text-xs sm:text-base md:text-lg font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-gray-900">
                        The Luxe Jewels Top Styles
                    </h2>
                </div>

                <div className={`${HOME_EDGE_SCROLL} mb-6 md:mb-10 overflow-x-auto no-scrollbar md:overflow-visible`}>
                    <div className="flex md:flex-wrap items-center justify-start md:justify-center gap-2 sm:gap-3 w-max md:w-auto mx-auto">
                        {safeTabs.map((tab) => {
                            const isActive = tab.id === activeTab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => selectTab(tab.id)}
                                    className={`shrink-0 px-3.5 sm:px-5 py-2.5 min-h-10 text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase border transition-all duration-200 active:scale-95 ${
                                        isActive
                                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                            : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
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
                            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-7 transition-opacity duration-200 ${
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
                            <div className="mt-5 text-center md:hidden">
                                <button
                                    type="button"
                                    onClick={() => setShowAllMobile(true)}
                                    className="min-h-11 px-5 text-[11px] font-black tracking-[0.16em] uppercase text-[#E91E63] border border-[#E91E63]/30 rounded-full active:scale-95"
                                >
                                    Show more styles
                                </button>
                            </div>
                        )}

                        {activeTab.href && (
                            <div className="mt-7 md:mt-10 text-center">
                                <Link
                                    href={activeTab.href}
                                    className="inline-flex items-center justify-center gap-2 min-h-11 text-[11px] font-black tracking-[0.18em] uppercase text-gray-900 hover:text-[#E91E63] transition-colors"
                                >
                                    View all {activeTab.label === "All" ? "styles" : activeTab.label}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12h14m-7-7 7 7-7 7" />
                                    </svg>
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
