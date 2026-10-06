"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import FestivalCountdown from "./FestivalCountdown";

const SLIDES = [
    {
        id: "diwali",
        eyebrow: "Diwali edit",
        title: ["Diwali jewellery, ", "office to puja"],
        accentClass: "text-[#f3e6c8]",
        eyebrowClass: "text-[#f3e6c8]",
        body: "Gold-look necklaces and earrings she can wear after the diyas are packed away. Buy 2 Get 1 Free.",
        image: "/festive/diwali-festive-hero.jpg",
        alt: "Gold Diwali necklace and jhumka earrings on ivory silk",
        banner: true,
        primary: { href: "/festive/diwali", label: "Shop Diwali" },
        secondary: { href: "/festive/navratri", label: "Shop Navratri" },
        festival: "diwali",
        isMain: true,
    },
    {
        id: "navratri",
        eyebrow: "Navratri edit",
        title: ["Navratri jewellery, ", "desk to dandiya"],
        accentClass: "text-[#f3c6d6]",
        eyebrowClass: "text-[#f3c6d6]",
        body: "Colourful anti-tarnish earrings and a pendant for all nine nights. Buy 2 Get 1 Free.",
        image: "/festive/navratri-festive-hero.jpg",
        alt: "Navratri earrings and pendant on wine silk",
        banner: true,
        primary: { href: "/festive/navratri", label: "Shop Navratri" },
        secondary: { href: "/festive/diwali", label: "Shop Diwali" },
        festival: "navratri",
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
            className={`relative aspect-[4/3] w-full max-h-[720px] overflow-hidden md:aspect-video ${slide.banner ? "bg-[#1c1614]" : slide.surface}`}
            aria-roledescription="carousel"
            aria-label="The Luxe Jewels"
        >
            {slide.banner ? (
                <div className="absolute inset-0">
                    {SLIDES.filter((item) => item.banner).map((item) => (
                        <Image
                            key={item.id}
                            src={item.image}
                            alt={item.id === slide.id ? item.alt : ""}
                            fill
                            priority={item.id === "diwali"}
                            sizes="100vw"
                            quality={80}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className={`object-cover object-center transition-opacity duration-700 ${
                                item.id === slide.id ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
            ) : (
                <div className="absolute inset-0 md:hidden" aria-hidden="true">
                    <Image
                        src={SLIDES[0].image}
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        quality={80}
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className="object-cover object-[center_20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80" />
                </div>
            )}

            <div className={`relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-5 pb-4 sm:px-8 md:px-12 md:pb-8 lg:px-16 xl:px-20 ${
                slide.banner ? "" : "min-h-[88svh] md:min-h-0 md:items-center"
            }`}>
                <div className="grid w-full md:grid-cols-[1.05fr_0.95fr] lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-14 items-center">
                    <div className="text-left pb-2 md:pb-0" aria-live="polite">
                        <div key={slide.id} className="hero-copy-in">
                            <p
                                className={`text-[11px] font-medium tracking-[0.22em] uppercase mb-3 md:mb-4 ${slide.eyebrowClass}`}
                            >
                                {slide.eyebrow}
                            </p>

                            <Heading className="mb-1 max-w-[16ch] font-playfair text-[1.55rem] font-medium leading-[1.08] tracking-tight text-white sm:text-[2.15rem] md:mb-4 md:text-[3.15rem] lg:text-[3.4rem]">
                                {slide.title[0]}
                                <em className={`italic font-normal ${slide.accentClass}`}>
                                    {slide.title[1]}
                                </em>
                            </Heading>

                            <p className="mb-4 hidden max-w-[38ch] text-[15px] leading-relaxed text-white/85 md:block md:text-[16px]">
                                {slide.body}
                            </p>

                            {slide.festival ? (
                                <FestivalCountdown
                                    slug={slide.festival}
                                    className={`mb-2 hidden text-[11px] font-semibold uppercase tracking-[0.16em] md:mb-6 md:block ${slide.eyebrowClass}`}
                                />
                            ) : null}

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href={slide.primary.href}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2a2724] transition-colors hover:bg-[#E91E63] hover:text-white sm:px-5 md:h-12 md:px-7 md:text-[11px] md:tracking-[0.14em]"
                                >
                                    {slide.primary.label}
                                    <span aria-hidden>→</span>
                                </Link>
                                <Link
                                    href={slide.secondary.href}
                                    className="hidden h-9 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:inline-flex sm:px-4 md:h-12 md:px-6 md:text-[11px] md:tracking-[0.14em]"
                                >
                                    {slide.secondary.label}
                                </Link>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-3 md:mt-6">
                            <button
                                type="button"
                                onClick={() => goToManual(index - 1)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/15 transition-colors"
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
                                            i === index ? "w-8 bg-white/35" : "w-2 bg-white/45 hover:bg-white/70"
                                        }`}
                                    >
                                        {i === index ? (
                                            <span
                                                key={`${item.id}-${hold ? "hold" : "play"}`}
                                                className={`absolute inset-y-0 left-0 w-full rounded-full bg-white ${
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
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/15 transition-colors"
                                aria-label="Next slide"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {!slide.banner ? (
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
                                    quality={80}
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
                    ) : null}
                </div>
            </div>
        </section>
    );
}
