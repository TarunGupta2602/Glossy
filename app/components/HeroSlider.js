"use client";

import { HOME_CONTAINER } from "@/lib/siteLayout";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
    {
        image: "/iloveimg-resized/hero3.png",
        headline: "Anti-tarnish jewellery for everyday India",
        support: "Waterproof, hypoallergenic 18k gold plated pieces made for daily wear.",
        primary: { label: "Shop Earrings", href: "/earrings" },
        secondary: { label: "Shop Necklaces", href: "/necklaces" },
    },
    {
        image: "/iloveimg-resized/hero4.png",
        headline: "Statement earrings that stay lustrous",
        support: "Shop waterproof earrings designed for all-day comfort and shine.",
        primary: { label: "Shop Earrings", href: "/earrings" },
        secondary: { label: "Shop All", href: "/shop" },
    },
    {
        image: "/iloveimg-resized/hero5.png",
        headline: "Layered necklaces for every look",
        support: "From everyday chains to evening edits — built to wear, not babysit.",
        primary: { label: "Shop Necklaces", href: "/necklaces" },
        secondary: { label: "Best Sellers", href: "/shop?sort=popular" },
    },
    {
        image: "/iloveimg-resized/hero2.jpg",
        headline: "New arrivals, ready to gift",
        support: "Fresh drops in anti-tarnish gold — plus Buy 2 Get 1 Free across the store.",
        primary: { label: "Shop New", href: "/shop?sort=newest" },
        secondary: { label: "View Collections", href: "/collection" },
    },
    {
        image: "/iloveimg-resized/hero1.jpg",
        headline: "Everyday luxury, made to last",
        support: "Handcrafted jewellery for daily brilliance — free shipping over ₹1000.",
        primary: { label: "Shop Best Sellers", href: "/shop?sort=popular" },
        secondary: { label: "Explore Collections", href: "/collection" },
    },
];

export default function HeroSlider() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(null);
    const activeSlide = SLIDES[currentIdx];

    const goTo = useCallback((idx) => {
        setCurrentIdx(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
    }, []);

    const next = useCallback(() => goTo(currentIdx + 1), [currentIdx, goTo]);
    const prev = useCallback(() => goTo(currentIdx - 1), [currentIdx, goTo]);

    useEffect(() => {
        if (paused) return undefined;
        const interval = setInterval(() => {
            setCurrentIdx((prevIdx) => (prevIdx + 1) % SLIDES.length);
        }, 6500);
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
            className="relative h-[min(72svh,560px)] sm:h-[70vh] md:h-[88vh] flex items-end md:items-center overflow-hidden bg-[#1a1214]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
            aria-label="Featured jewellery"
        >
            <div className="absolute inset-0 z-0">
                {SLIDES.map((slide, idx) => (
                    <div
                        key={slide.image}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            idx === currentIdx ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden={idx !== currentIdx}
                    >
                        <Image
                            src={slide.image}
                            alt=""
                            fill
                            priority={idx === 0}
                            sizes="100vw"
                            quality={85}
                            className={`object-cover object-[center_20%] sm:object-[center_22%] md:object-[center_30%] transition-transform duration-[9s] ease-out ${
                                idx === currentIdx ? "scale-[1.03]" : "scale-100"
                            }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15 md:bg-gradient-to-r md:from-black/55 md:via-black/20 md:to-black/5" />
                    </div>
                ))}
            </div>

            <div className={`${HOME_CONTAINER} relative z-10 w-full pb-16 pt-16 sm:pb-20 sm:pt-24 md:pb-0 md:pt-0`}>
                <div className="max-w-2xl">
                    <p className="font-playfair text-white text-xl sm:text-3xl md:text-4xl tracking-tight mb-2 sm:mb-5">
                        The Luxe Jewels
                    </p>

                    <h1
                        key={`h-${currentIdx}`}
                        className="text-[1.55rem] sm:text-4xl md:text-5xl lg:text-[3.35rem] font-playfair font-bold text-white tracking-tight leading-[1.1] mb-2.5 sm:mb-5"
                    >
                        {activeSlide.headline}
                    </h1>

                    <p
                        key={`p-${currentIdx}`}
                        className="text-[13px] sm:text-base md:text-lg text-white/85 max-w-lg leading-relaxed mb-5 sm:mb-9 line-clamp-2 sm:line-clamp-none"
                    >
                        {activeSlide.support}
                    </p>

                    <div
                        key={`c-${currentIdx}`}
                        className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-4"
                    >
                        <Link
                            href={activeSlide.primary.href}
                            className="inline-flex items-center justify-center gap-2 bg-[#E91E63] text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.14em] sm:tracking-[0.18em] px-4 sm:px-6 py-3 sm:py-4 hover:bg-[#c2185b] transition-colors duration-300 min-h-11"
                        >
                            {activeSlide.primary.label}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href={activeSlide.secondary.href}
                            className="inline-flex items-center justify-center text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.14em] sm:tracking-[0.18em] px-2 py-3 border-b border-white/40 hover:border-[#E91E63] transition-colors duration-300 min-h-11"
                        >
                            {activeSlide.secondary.label}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-3 right-3 sm:bottom-10 sm:right-10 z-20 flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                    <button
                        type="button"
                        onClick={prev}
                        className="w-10 h-10 rounded-full border border-white/30 bg-black/25 backdrop-blur-sm text-white flex items-center justify-center"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="w-10 h-10 rounded-full border border-white/30 bg-black/25 backdrop-blur-sm text-white flex items-center justify-center"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                idx === currentIdx ? "w-6 sm:w-8 bg-[#E91E63]" : "w-1.5 bg-white/35"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
