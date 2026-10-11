"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    HOME_CONTAINER,
    HOME_EDGE_SCROLL,
    HOME_SURFACE_IVORY,
    HOME_SURFACE_EDGE,
} from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/** Editorial shop-by-edit strip — large portrait cards, snap scroll, no 3D tilt. */
export default function HomeCollections({ collections = [] }) {
    const items = collections.slice(0, 5);
    const scrollerRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const syncArrows = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        setCanPrev(el.scrollLeft > 8);
        setCanNext(max > 8 && el.scrollLeft < max - 8);
    }, []);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return undefined;
        syncArrows();
        el.addEventListener("scroll", syncArrows, { passive: true });
        window.addEventListener("resize", syncArrows);
        return () => {
            el.removeEventListener("scroll", syncArrows);
            window.removeEventListener("resize", syncArrows);
        };
    }, [syncArrows, items.length]);

    const scrollByCard = (dir) => {
        const el = scrollerRef.current;
        if (!el) return;
        const card = el.querySelector("[data-edit-card]");
        const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.7;
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    if (!items.length) return null;

    return (
        <section
            className={`${HOME_SURFACE_IVORY} ${HOME_SURFACE_EDGE} py-10 md:py-14`}
            aria-label="Shop by edit"
        >
            <div className={HOME_CONTAINER}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
                    <div>
                        <p
                            className="text-[11px] font-medium tracking-[0.22em] uppercase mb-2"
                            style={{ color: "#b89a6a" }}
                        >
                            Explore
                        </p>
                        <h2 className="font-playfair text-[1.85rem] sm:text-[2.2rem] font-medium text-[#2a2724] tracking-tight leading-[1.12]">
                            Shop by{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                edit
                            </em>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => scrollByCard(-1)}
                                disabled={!canPrev}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#efeae4] bg-white text-[#2a2724] transition-colors hover:border-[#b89a6a] hover:text-[#8a5a28] disabled:opacity-30 disabled:pointer-events-none"
                                aria-label="Previous edits"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollByCard(1)}
                                disabled={!canNext}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#efeae4] bg-white text-[#2a2724] transition-colors hover:border-[#b89a6a] hover:text-[#8a5a28] disabled:opacity-30 disabled:pointer-events-none"
                                aria-label="Next edits"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                        <Link
                            href="/collection"
                            className="inline-flex min-h-10 items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a847c] hover:text-[#E91E63] transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                </div>

                <div className={HOME_EDGE_SCROLL}>
                    <div
                        ref={scrollerRef}
                        className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                    >
                        {items.map((item, index) => {
                            const title = item.label || item.name;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    data-edit-card
                                    className="group relative flex-none w-[72vw] max-w-[280px] sm:w-[240px] sm:max-w-none md:w-[250px] xl:w-auto xl:max-w-none xl:flex-1 snap-start"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.35rem] md:rounded-[1.5rem] bg-[#efeae4]">
                                        <Image
                                            src={item.image || "/logo.png"}
                                            alt={title}
                                            fill
                                            sizes="(max-width: 640px) 72vw, 280px"
                                            quality={index === 0 ? 85 : 78}
                                            placeholder="blur"
                                            blurDataURL={IMAGE_BLUR_DATA_URL}
                                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                            priority={index === 0}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                                            <p className="font-playfair text-[1.35rem] md:text-[1.5rem] text-white font-medium leading-tight tracking-tight">
                                                {title}
                                            </p>
                                            <span className="mt-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 transition-colors group-hover:text-white">
                                                Shop the edit
                                                <span
                                                    className="h-px w-5 bg-white/50 transition-all duration-500 group-hover:w-9 group-hover:bg-[#e8d5b5]"
                                                    aria-hidden
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
