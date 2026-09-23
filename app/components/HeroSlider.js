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
        accentClass: "text-[#e8d5b5] lg:text-[#b59e7b]",
        eyebrowClass: "text-[#e8d5b5] lg:text-[#b59e7b]",
        body: "Lightweight anti-tarnish jewellery you can live in — from first meetings to late evenings, with pieces ready to gift.",
        image: "/iloveimg-resized/hero2.jpg",
        imageWide: "/iloveimg-resized/hero2.jpg",
        objectMobile: "42% 12%",
        objectDesktop: "46% 0%",
        alt: "The Luxe Jewels anti-tarnish gold plated jewellery",
        primary: { href: "/shop?sort=popular", label: "Shop bestsellers" },
        secondary: { href: "/shop?sort=newest", label: "New arrivals" },
        chip: "Daily wear edit",
        chipEyebrow: "Fresh drop",
        surface: "bg-[#1c1814] lg:bg-[#fdfbf7]",
        button: "#b59e7b",
        isMain: true,
    },
    {
        id: "navratri",
        eyebrow: "Navratri edit",
        title: ["Navratri edit: nine days, ", "everyday sparkle"],
        accentClass: "text-[#e8d5b5] lg:text-[#7a2248]",
        eyebrowClass: "text-[#e8d5b5] lg:text-[#7a2248]",
        body: "Desk to dandiya — lightweight colourful earrings and necklaces under ₹999. Buy 2 Get 1 Free on every order.",
        image: "/festive/navratri-festive-portrait.jpg",
        imageWide: "/festive/navratri-festive-hero.jpg",
        objectMobile: "center 38%",
        objectDesktop: "center 40%",
        alt: "Navratri jewellery from The Luxe Jewels",
        primary: { href: "/festive/navratri", label: "Shop Navratri" },
        secondary: { href: "/festive/diwali", label: "Shop Diwali" },
        chip: "Buy 2 Get 1 Free",
        chipEyebrow: "Festive offer",
        surface: "bg-[#2a1020] lg:bg-[#f8f0f4]",
        button: "#7a2248",
        festival: "navratri",
    },
    {
        id: "diwali",
        eyebrow: "Diwali edit",
        title: ["Diwali edit: light up in ", "anti-tarnish gold"],
        accentClass: "text-[#e8d5b5] lg:text-[#8a5a28]",
        eyebrowClass: "text-[#e8d5b5] lg:text-[#8a5a28]",
        body: "Office to puja — gold-look necklaces and earrings she can wear after the diyas are packed away.",
        image: "/festive/diwali-festive-portrait.jpg",
        imageWide: "/festive/diwali-festive-hero.jpg",
        objectMobile: "center 48%",
        objectDesktop: "center 42%",
        alt: "Diwali jewellery from The Luxe Jewels",
        primary: { href: "/festive/diwali", label: "Shop Diwali" },
        secondary: { href: "/festive/navratri", label: "Shop Navratri" },
        chip: "Buy 2 Get 1 Free",
        chipEyebrow: "Festive offer",
        surface: "bg-[#2a2218] lg:bg-[#f7f1e8]",
        button: "#8a5a28",
        festival: "diwali",
    },
];

const INTERVAL_MS = 5500;
const MANUAL_RESUME_MS = 9000;
const SWIPE_THRESHOLD = 48;

/**
 * Homepage hero carousel: brand header, then Navratri, then Diwali.
 * Auto-advances on its own. Arrows/dots only pause briefly after a tap.
 */
export default function HeroSlider() {
    const [index, setIndex] = useState(0);
    const [hold, setHold] = useState(false);
    const [hover, setHover] = useState(false);
    const resumeTimer = useRef(null);
    const touchStartX = useRef(null);
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
        if (hold || hover) return undefined;
        if (typeof window === "undefined") return undefined;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }
        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % SLIDES.length);
        }, INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [hold, hover]);

    const onTouchStart = (event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
    };

    const onTouchEnd = (event) => {
        if (touchStartX.current == null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        goToManual(delta > 0 ? index - 1 : index + 1);
    };

    return (
        <section
            className={`relative overflow-hidden ${slide.surface}`}
            aria-roledescription="carousel"
            aria-label="The Luxe Jewels"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="absolute inset-0 lg:hidden" aria-hidden="true">
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
                        className={`object-cover transition-opacity duration-700 ${
                            i === index ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ objectPosition: item.objectMobile }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-black/20" />
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[50%] xl:w-[52%]">
                <div className="relative h-full overflow-hidden rounded-l-[2rem]">
                    {SLIDES.map((item, i) => (
                        <Image
                            key={item.id}
                            src={item.imageWide}
                            alt={i === index ? item.alt : ""}
                            fill
                            priority={i === 0}
                            sizes="(min-width: 1280px) 52vw, 50vw"
                            quality={90}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className={`object-cover transition-opacity duration-700 ${
                                i === index ? "opacity-100 ken-burns" : "opacity-0"
                            }`}
                            style={{ objectPosition: item.objectDesktop }}
                        />
                    ))}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/10 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                        <div className="rounded-2xl bg-white/92 backdrop-blur-sm px-4 py-3 shadow-sm">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8a847c]">
                                {slide.chipEyebrow}
                            </p>
                            <p className="text-[13px] font-semibold text-[#2a2724] leading-tight mt-0.5">
                                {slide.chip}
                            </p>
                        </div>
                        <Link
                            href={slide.primary.href}
                            className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: slide.button }}
                            aria-label={slide.primary.label}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
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
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-10 lg:px-10 xl:px-12 min-h-[72svh] lg:min-h-[620px] xl:min-h-[700px] flex items-end lg:items-center py-7 lg:py-14 xl:py-16">
                <div className="w-full lg:max-w-[44%] xl:max-w-[40%]">
                    <div className="text-left" aria-live="polite">
                        <div key={slide.id} className="hero-copy-in">
                            <p
                                className={`text-[11px] font-medium tracking-[0.22em] uppercase mb-4 lg:mb-5 ${slide.eyebrowClass}`}
                            >
                                {slide.eyebrow}
                            </p>

                            <Heading className="font-playfair text-[1.95rem] sm:text-[2.4rem] md:text-[2.75rem] lg:text-[3.05rem] xl:text-[3.25rem] font-medium tracking-tight leading-[1.14] mb-3 lg:mb-5 text-white lg:text-[#2a2724] max-w-[16ch] lg:max-w-[20ch]">
                                {slide.title[0]}
                                <em className={`italic font-normal ${slide.accentClass}`}>
                                    {slide.title[1]}
                                </em>
                            </Heading>

                            <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed mb-6 lg:mb-8 max-w-[34ch] lg:max-w-[38ch] text-white/82 lg:text-[#6b6560]">
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
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 bg-white text-[#2a2724] hover:bg-[#E91E63] hover:text-white lg:bg-[#2a2724] lg:text-white lg:hover:bg-[#E91E63]"
                                >
                                    {slide.primary.label}
                                    <span aria-hidden>→</span>
                                </Link>
                                <Link
                                    href={slide.secondary.href}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 lg:border-[#2a2724]/20 lg:bg-transparent lg:backdrop-blur-none lg:text-[#2a2724] lg:hover:border-[#2a2724] lg:hover:bg-transparent"
                                >
                                    {slide.secondary.label}
                                </Link>
                            </div>
                        </div>

                        <p className="mt-6 lg:mt-7 text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 lg:text-[#a39e97]">
                            Buy 2 get 1 free
                        </p>

                        <div className="mt-6 lg:mt-8 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => goToManual(index - 1)}
                                className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2724]/15 text-[#2a2724] hover:border-[#2a2724] transition-colors"
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
                                        className={`relative h-1.5 overflow-hidden rounded-full transition-all ${
                                            i === index
                                                ? "w-9 bg-white/35 lg:bg-[#2a2724]/20"
                                                : "w-2 bg-white/45 lg:bg-[#2a2724]/25 hover:bg-white/70 lg:hover:bg-[#2a2724]/45"
                                        }`}
                                    >
                                        {i === index ? (
                                            <span
                                                key={`${item.id}-${hold || hover ? "hold" : "play"}`}
                                                className={`absolute inset-y-0 left-0 w-full rounded-full bg-white lg:bg-[#2a2724] ${
                                                    hold || hover ? "" : "hero-progress-bar"
                                                }`}
                                                style={hold || hover ? { transform: "scaleX(1)" } : undefined}
                                                aria-hidden
                                            />
                                        ) : null}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => goToManual(index + 1)}
                                className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2724]/15 text-[#2a2724] hover:border-[#2a2724] transition-colors"
                                aria-label="Next slide"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
