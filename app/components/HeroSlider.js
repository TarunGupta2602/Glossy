"use client";

import { HOME_CONTAINER } from "@/lib/siteLayout";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

const SLIDES = [
    {
        image: "/iloveimg-resized/hero3.png",
        headline: "Everyday shine that lasts",
        support: "Anti-tarnish, waterproof 18k gold plated jewellery for daily India.",
        primary: { label: "Shop bestsellers", href: "/shop?sort=popular" },
        secondary: { label: "Shop earrings", href: "/earrings" },
    },
    {
        image: "/iloveimg-resized/hero4.png",
        headline: "Statement earrings, all-day comfort",
        support: "Lustrous pieces made to wear — not babysit.",
        primary: { label: "Shop earrings", href: "/earrings" },
        secondary: { label: "Shop all", href: "/shop" },
    },
    {
        image: "/iloveimg-resized/hero5.png",
        headline: "Layered necklaces for every look",
        support: "From everyday chains to evening edits — plus Buy 2 Get 1 Free.",
        primary: { label: "Shop necklaces", href: "/necklaces" },
        secondary: { label: "New arrivals", href: "/shop?sort=newest" },
    },
];

export default function HeroSlider() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const touchStartX = useRef(null);
    const activeSlide = SLIDES[currentIdx];

    useEffect(() => {
        setHydrated(true);
    }, []);

    const visibleIndexes = useMemo(() => {
        const set = new Set([currentIdx]);
        if (hydrated) {
            set.add((currentIdx + 1) % SLIDES.length);
            set.add((currentIdx - 1 + SLIDES.length) % SLIDES.length);
        }
        return set;
    }, [currentIdx, hydrated]);

    const goTo = useCallback((idx) => {
        setCurrentIdx(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
    }, []);

    const next = useCallback(() => goTo(currentIdx + 1), [currentIdx, goTo]);
    const prev = useCallback(() => goTo(currentIdx - 1), [currentIdx, goTo]);

    useEffect(() => {
        if (paused) return undefined;
        const interval = setInterval(() => {
            setCurrentIdx((prevIdx) => (prevIdx + 1) % SLIDES.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [paused]);

    const onTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        setPaused(true);
    };

    const onTouchEnd = (e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        setPaused(false);
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 40) return;
        if (delta < 0) next();
        else prev();
    };

    return (
        <section
            className="relative h-[min(74svh,580px)] sm:h-[72vh] md:h-[88vh] flex items-end md:items-center overflow-hidden bg-[#1a1214]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
            aria-label="Featured jewellery"
        >
            <div className="absolute inset-0 z-0">
                {SLIDES.map((slide, idx) => {
                    if (!visibleIndexes.has(idx)) return null;
                    const isActive = idx === currentIdx;
                    return (
                        <div
                            key={slide.image}
                            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                                isActive ? "opacity-100" : "opacity-0"
                            }`}
                            aria-hidden={!isActive}
                        >
                            <Image
                                src={slide.image}
                                alt={slide.headline}
                                fill
                                priority={idx === 0}
                                sizes="100vw"
                                quality={80}
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                className={`object-cover object-[center_20%] sm:object-[center_22%] md:object-[center_30%] will-change-transform ${
                                    isActive ? "ken-burns" : "scale-100"
                                }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15 md:bg-gradient-to-r md:from-black/55 md:via-black/20 md:to-black/5" />
                        </div>
                    );
                })}
            </div>

            <div
                className={`${HOME_CONTAINER} relative z-10 w-full pb-16 pt-16 sm:pb-20 sm:pt-24 md:pb-0 md:pt-0`}
            >
                <div className="max-w-xl">
                    <p className="font-playfair text-white text-2xl sm:text-3xl md:text-4xl tracking-tight mb-3 sm:mb-5">
                        The Luxe Jewels
                    </p>

                    <h1
                        key={`h-${currentIdx}`}
                        className="hero-copy-in text-[1.65rem] sm:text-4xl md:text-5xl font-playfair font-bold text-white tracking-tight leading-[1.12] mb-3 sm:mb-5"
                    >
                        {activeSlide.headline}
                    </h1>

                    <p
                        key={`p-${currentIdx}`}
                        className="hero-copy-in text-[13px] sm:text-base text-white/85 max-w-md leading-relaxed mb-6 sm:mb-9 line-clamp-2 sm:line-clamp-none"
                    >
                        {activeSlide.support}
                    </p>

                    <div
                        key={`c-${currentIdx}`}
                        className="hero-copy-in flex flex-row flex-wrap items-center gap-3 sm:gap-5"
                    >
                        <Link
                            href={activeSlide.primary.href}
                            className="inline-flex items-center justify-center gap-2 bg-[#E91E63] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] px-5 sm:px-7 py-3.5 sm:py-4 hover:bg-[#c2185b] active:scale-[0.98] transition-all duration-200 min-h-12 rounded-sm shadow-lg shadow-[#E91E63]/25"
                        >
                            {activeSlide.primary.label}
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
                        <Link
                            href={activeSlide.secondary.href}
                            className="inline-flex items-center justify-center text-white/90 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] py-3 border-b border-white/35 hover:border-[#E91E63] hover:text-white transition-colors duration-200 min-h-11"
                        >
                            {activeSlide.secondary.label}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-3 right-3 sm:bottom-10 sm:right-10 z-20 flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={prev}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 active:scale-95 transition-colors"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 active:scale-95 transition-colors"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>

                <div className="flex gap-1.5 sm:gap-3" role="tablist" aria-label="Hero slides">
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            role="tab"
                            aria-selected={idx === currentIdx}
                            onClick={() => goTo(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === currentIdx
                                    ? "w-6 sm:w-8 bg-[#E91E63]"
                                    : "w-1.5 bg-white/35 hover:bg-white/60"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
