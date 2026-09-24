"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import FestivalCountdown from "./FestivalCountdown";

const SLIDES = [
    {
        id: "main",
        eyebrow: "Anti-tarnish · Waterproof · Made for India",
        title: ["Shine that stays with you — ", "every day"],
        accentClass: "text-[#e8d5b5] md:text-[#b59e7b]",
        eyebrowClass: "text-[#e8d5b5] md:text-[#b59e7b]",
        body: "Lightweight anti-tarnish jewellery you can live in — from first meetings to late evenings, with pieces ready to gift.",
        image: "/iloveimg-resized/hero2.jpg",
        alt: "The Luxe Jewels anti-tarnish gold plated jewellery",
        primary: { href: "/shop?sort=popular", label: "Shop bestsellers" },
        secondary: { href: "/shop?sort=newest", label: "New arrivals" },
        chip: "Daily wear edit",
        chipEyebrow: "Fresh drop",
        surface: "md:bg-[#fdfbf7]",
        frame: "bg-[#efeae4]",
        button: "#b59e7b",
        isMain: true,
    },
    {
        id: "navratri",
        eyebrow: "Navratri edit",
        title: ["Navratri edit: nine days, ", "everyday sparkle"],
        accentClass: "text-[#e8d5b5] md:text-[#7a2248]",
        eyebrowClass: "text-[#e8d5b5] md:text-[#7a2248]",
        body: "Desk to dandiya — lightweight colourful earrings and necklaces under ₹999. Buy 2 Get 1 Free on every order.",
        image: "/festive/navratri-festive-portrait.jpg",
        alt: "Navratri jewellery from The Luxe Jewels",
        primary: { href: "/festive/navratri", label: "Shop Navratri" },
        secondary: { href: "/festive/diwali", label: "Shop Diwali" },
        chip: "Buy 2 Get 1 Free",
        chipEyebrow: "Festive offer",
        surface: "md:bg-[#f8f0f4]",
        frame: "bg-[#ead4de]",
        button: "#7a2248",
        festival: "navratri",
    },
    {
        id: "diwali",
        eyebrow: "Diwali edit",
        title: ["Diwali edit: light up in ", "anti-tarnish gold"],
        accentClass: "text-[#e8d5b5] md:text-[#8a5a28]",
        eyebrowClass: "text-[#e8d5b5] md:text-[#8a5a28]",
        body: "Office to puja — gold-look necklaces and earrings she can wear after the diyas are packed away.",
        image: "/festive/diwali-festive-portrait.jpg",
        alt: "Diwali jewellery from The Luxe Jewels",
        primary: { href: "/festive/diwali", label: "Shop Diwali" },
        secondary: { href: "/festive/navratri", label: "Shop Navratri" },
        chip: "Buy 2 Get 1 Free",
        chipEyebrow: "Festive offer",
        surface: "md:bg-[#f7f1e8]",
        frame: "bg-[#ead9c4]",
        button: "#8a5a28",
        festival: "diwali",
    },
];

const INTERVAL_MS = 5500;
const MANUAL_RESUME_MS = 9000;

/**
 * Homepage hero carousel: brand header, then Navratri, then Diwali.
 * Auto-advances on its own. Arrows/dots only pause briefly after a tap.
 */
export default function HeroSlider() {
    const [index, setIndex] = useState(0);
    const [hold, setHold] = useState(false);
    const resumeTimer = useRef(null);
    const slide = SLIDES[index];
    const Heading = slide.isMain ? "h1" : "p";

    const goTo = useCallback((next) => {
        setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
    }, []);

    const goToManual = useCallback(
        (next) => {
            goTo(next);
            setHold(true);
            if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
            resumeTimer.current = window.setTimeout(() => setHold(false), MANUAL_RESUME_MS);
        },
        [goTo]
    );

    useEffect(() => {
        return () => {
            if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        };
    }, []);

    useEffect(() => {
        if (hold) return undefined;
        if (typeof window === "undefined") return undefined;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }
        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % SLIDES.length);
        }, INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [hold]);

    return (
        <section
            className={`relative overflow-hidden ${slide.surface}`}
            aria-roledescription="carousel"
            aria-label="The Luxe Jewels"
        >
            <div className="absolute inset-0 md:hidden" aria-hidden="true">
                {SLIDES.map((item, i) => (
                    <Image
                        key={item.id}
                        src={item.image}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        quality={90}
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className={`object-cover object-[center_20%] transition-opacity duration-700 ${
                            i === index ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 min-h-[88svh] md:min-h-0 flex items-end md:items-center py-10 md:py-12 lg:py-14">
                <div className="grid w-full md:grid-cols-[1.05fr_0.95fr] lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-14 items-center">
                    <div className="text-left pb-2 md:pb-0" aria-live="polite">
                        <div key={slide.id} className="hero-copy-in">
                            <p
                                className={`text-[11px] font-medium tracking-[0.22em] uppercase mb-3 md:mb-4 ${slide.eyebrowClass}`}
                            >
                                {slide.eyebrow}
                            </p>

                            <Heading className={`font-playfair text-[2.35rem] sm:text-[2.7rem] md:text-[3.05rem] lg:text-[3.25rem] font-medium tracking-tight leading-[1.08] mb-3 md:mb-5 text-white md:text-[#2a2724] max-w-[18ch] ${slide.isMain ? "md:max-w-none" : "md:max-w-[16ch]"}`}>
                                {slide.title[0]}
                                <em className={`italic font-normal ${slide.accentClass}`}>
                                    {slide.title[1]}
                                </em>
                            </Heading>

                            <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-relaxed mb-6 md:mb-7 max-w-[34ch] md:max-w-[38ch] lg:max-w-[440px] text-white/80 md:text-[#6b6560]">
                                {slide.body}
                            </p>

                            {slide.festival ? (
                                <FestivalCountdown
                                    slug={slide.festival}
                                    className={`mb-6 text-[12px] font-semibold uppercase tracking-[0.16em] ${slide.eyebrowClass}`}
                                />
                            ) : null}

                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={slide.primary.href}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 bg-white text-[#2a2724] hover:bg-[#E91E63] hover:text-white md:bg-[#2a2724] md:text-white md:hover:bg-[#E91E63]"
                                >
                                    {slide.primary.label}
                                    <span aria-hidden>→</span>
                                </Link>
                                <Link
                                    href={slide.secondary.href}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 md:border-[#2a2724]/25 md:bg-transparent md:backdrop-blur-none md:text-[#2a2724] md:hover:border-[#2a2724] md:hover:bg-transparent"
                                >
                                    {slide.secondary.label}
                                </Link>
                            </div>
                        </div>

                        <p className="mt-6 md:hidden text-[10px] font-medium tracking-[0.2em] uppercase text-white/55">
                            Buy 2 get 1 free
                        </p>

                        <div className="mt-7 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => goToManual(index - 1)}
                                className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2724]/15 text-[#2a2724] hover:border-[#2a2724] transition-colors"
                                aria-label="Previous slide"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                                    <path d="M19 12H5m7 7-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                                {SLIDES.map((item, i) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={i === index}
                                        aria-label={`${item.eyebrow}`}
                                        onClick={() => goToManual(i)}
                                        className={`relative h-2 overflow-hidden rounded-full transition-all ${
                                            i === index
                                                ? "w-8 bg-white/35 md:bg-[#2a2724]/20"
                                                : "w-2 bg-white/45 md:bg-[#2a2724]/25 hover:bg-white/70 md:hover:bg-[#2a2724]/45"
                                        }`}
                                    >
                                        {i === index ? (
                                            <span
                                                key={`${item.id}-${hold ? "hold" : "play"}`}
                                                className={`absolute inset-y-0 left-0 w-full rounded-full bg-white md:bg-[#2a2724] ${
                                                    hold ? "" : "hero-progress-bar"
                                                }`}
                                                style={hold ? { transform: "scaleX(1)" } : undefined}
                                                aria-hidden
                                            />
                                        ) : null}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => goToManual(index + 1)}
                                className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2724]/15 text-[#2a2724] hover:border-[#2a2724] transition-colors"
                                aria-label="Next slide"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-end">
                        <div
                            className={`relative w-full max-w-[460px] lg:max-w-[500px] aspect-[3/4] overflow-hidden rounded-[2rem] ${slide.frame}`}
                        >
                            {SLIDES.map((item, i) => (
                                <Image
                                    key={item.id}
                                    src={item.image}
                                    alt={i === index ? item.alt : ""}
                                    fill
                                    priority={i === 0}
                                    sizes="(min-width: 1024px) 500px, 460px"
                                    quality={90}
                                    placeholder="blur"
                                    blurDataURL={IMAGE_BLUR_DATA_URL}
                                    className={`object-cover transition-opacity duration-700 ${
                                        item.id === "main" ? "object-[46%_12%]" : "object-center"
                                    } ${i === index ? "opacity-100" : "opacity-0"}`}
                                />
                            ))}

                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 z-10">
                                <div className="rounded-2xl bg-white/90 backdrop-blur-sm px-3.5 py-2.5 shadow-sm">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8a847c]">
                                        {slide.chipEyebrow}
                                    </p>
                                    <p className="text-[13px] font-semibold text-[#2a2724] leading-tight mt-0.5">
                                        {slide.chip}
                                    </p>
                                </div>
                                <Link
                                    href={slide.primary.href}
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: slide.button }}
                                    aria-label={slide.primary.label}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12h14m-7-7 7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <p className="mt-3 text-right text-[10px] font-medium tracking-[0.2em] uppercase text-[#a39e97]">
                            Buy 2 get 1 free
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
