"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import ProductCard from "./ProductCard";

export default function TopStyles({ tabs = [], reviewCounts = {} }) {
    const safeTabs = tabs.filter((tab) => tab?.id && Array.isArray(tab.products));
    const [activeId, setActiveId] = useState(safeTabs[0]?.id || "all");

    const activeTab = useMemo(
        () => safeTabs.find((tab) => tab.id === activeId) || safeTabs[0],
        [safeTabs, activeId]
    );

    if (!safeTabs.length || !activeTab) return null;

    const products = activeTab.products || [];

    return (
        <section className="py-8 md:py-14 bg-white border-t border-gray-100">
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-5 md:mb-8 px-2">
                    <h2 className="text-xs sm:text-base md:text-lg font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-gray-900">
                        The Luxe Jewels Top Styles
                    </h2>
                </div>

                <div className="-mx-4 px-4 mb-6 md:mb-10 overflow-x-auto no-scrollbar md:mx-0 md:px-0 md:overflow-visible">
                    <div className="flex md:flex-wrap items-center justify-start md:justify-center gap-2 sm:gap-3 w-max md:w-auto mx-auto">
                        {safeTabs.map((tab) => {
                            const isActive = tab.id === activeTab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveId(tab.id)}
                                    className={`shrink-0 px-3.5 sm:px-5 py-2.5 min-h-10 text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase border transition-colors duration-200 ${
                                        isActive
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "bg-white text-gray-900 border-gray-900"
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 md:gap-6">
                            {products.slice(0, 8).map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    reviewCount={reviewCounts[product.id] || 0}
                                    priority={index < 2}
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            ))}
                        </div>

                        {activeTab.href && (
                            <div className="mt-7 md:mt-10 text-center">
                                <Link
                                    href={activeTab.href}
                                    className="inline-flex items-center justify-center gap-2 min-h-11 text-[11px] font-black tracking-[0.18em] uppercase text-gray-900"
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
