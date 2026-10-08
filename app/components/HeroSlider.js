"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import FestivalCountdown from "./FestivalCountdown";

const SLIDES = [
    {
        id: "main",
        eyebrow: "Anti-tarnish · Everyday wear · Made for India",
        title: ["Shine that stays with you — ", "every day"],
        accentClass: "text-[#8a5a28]",
        eyebrowClass: "text-[#8a5a28]",
        body: "Lightweight anti-tarnish jewellery you can live in — from first meetings to late evenings, with pieces ready to gift.",
        image: "/festive/home-hero-banner.jpg",
        alt: "Gold necklace, rings, cuff and hoop earrings from The Luxe Jewels",
        banner: true,
        primary: { href: "/shop", label: "Shop" },
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
        accentClass: "text-[#7a2248]",
        eyebrowClass: "text-[#7a2248]",
        body: "Desk to dandiya — lightweight colourful earrings and necklaces under ₹999. Buy 2 Get 1 Free on every order.",
        image: "/festive/navratri-hero-banner.jpg",
        alt: "Navratri gold jewellery with dandiya sticks",
        banner: true,
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
        accentClass: "text-[#8a5a28]",
        eyebrowClass: "text-[#8a5a28]",
        body: "Office to puja — gold-look necklaces and earrings she can wear after the diyas are packed away.",
        image: "/festive/diwali-hero-banner.jpg",
        alt: "Diwali gold jewellery styled with a diya",
        banner: true,
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
            className={`relative overflow-hidden ${slide.banner ? "bg-[#f7f3ee]" : slide.surface}`}
            aria-roledescription="carousel"
            aria-label="The Luxe Jewels"
        >
            {slide.banner ? (
                <div className="relative h-[30vh] min-h-[150px] max-h-[200px] md:absolute md:inset-0 md:h-auto md:max-h-none md:min-h-0">
                    {SLIDES.filter((item) => item.banner).map((item) => (
                        <Image
                            key={item.id}
                            src={item.image}
                            alt=""
                            fill
                            priority={item.id === "main"}
                            sizes="100vw"
                            quality={80}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className={`object-cover object-[78%_center] md:object-[70%_28%] transition-opacity duration-700 ${
                                item.id === slide.id ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))}
                    <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-r from-[#f7f3ee] from-[8%] via-[#f7f3ee]/80 via-[46%] to-transparent to-[72%]" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#f7f3ee] to-transparent md:hidden" />
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

            <div className={`relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex md:items-center py-5 md:py-8 lg:py-10 ${
                slide.banner ? "min-h-0 items-start md:min-h-[420px] lg:min-h-[460px] xl:min-h-[500px] md:items-center" : "min-h-[88svh] items-end md:min-h-0 md:items-center"
            }`}>
                <div className="grid w-full md:grid-cols-[1.05fr_0.95fr] lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-14 items-center">
                    <div className="text-left pb-2 md:pb-0" aria-live="polite">
                        <div key={slide.id} className="hero-copy-in">
                            <p
                                className={`text-[11px] font-medium tracking-[0.22em] uppercase mb-3 md:mb-4 ${slide.eyebrowClass}`}
                            >
                                {slide.eyebrow}
                            </p>

                            <Heading className={`font-playfair text-[1.85rem] sm:text-[2.35rem] md:text-[3.05rem] lg:text-[3.25rem] font-medium tracking-tight leading-[1.08] mb-2 md:mb-5 max-w-[16ch] ${slide.banner ? "text-[#2a2724]" : "text-white md:text-[#2a2724]"} ${slide.isMain ? "md:max-w-none" : "md:max-w-[16ch]"}`}>
                                {slide.title[0]}
                                <em className={`italic font-normal ${slide.accentClass}`}>
                                    {slide.title[1]}
                                </em>
                            </Heading>

                            <p className={`text-[13px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-relaxed mb-4 md:mb-7 max-w-[34ch] md:max-w-[38ch] lg:max-w-[440px] line-clamp-2 md:line-clamp-none ${slide.banner ? "text-[#6b6560]" : "text-white/80 md:text-[#6b6560]"}`}>
                                {slide.body}
                            </p>

                            {slide.festival ? (
                                <FestivalCountdown
                                    slug={slide.festival}
                                    className={`mb-6 text-[12px] font-semibold uppercase tracking-[0.16em] ${slide.eyebrowClass}`}
                                />
                            ) : null}

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href={slide.primary.href}
                                    className={`inline-flex h-11 md:h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-full px-5 md:px-7 text-[11px] font-semibold uppercase tracking-[0.14em] md:tracking-[0.16em] transition-colors duration-300 hover:bg-[#E91E63] hover:text-white ${slide.banner ? "bg-[#2a2724] text-white" : "bg-white text-[#2a2724] md:bg-[#2a2724] md:text-white"}`}
                                >
                                    {slide.primary.label}
                                    <span aria-hidden>→</span>
                                </Link>
                                {slide.secondary ? (
                                <Link
                                    href={slide.secondary.href}
                                    className={`inline-flex h-11 md:h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-full px-4 md:px-6 text-[11px] font-semibold uppercase tracking-[0.14em] md:tracking-[0.16em] transition-colors md:border-[#2a2724]/25 md:bg-transparent md:backdrop-blur-none md:text-[#2a2724] md:hover:border-[#2a2724] md:hover:bg-transparent ${slide.banner ? "border border-[#2a2724]/25 bg-transparent text-[#2a2724] hover:border-[#2a2724]" : "border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"}`}
                                >
                                    {slide.secondary.label}
                                </Link>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-4 md:mt-7 flex items-center gap-3">
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
                                            slide.banner
                                                ? i === index
                                                    ? "w-8 bg-[#2a2724]/20"
                                                    : "w-2 bg-[#2a2724]/25 hover:bg-[#2a2724]/45"
                                                : i === index
                                                  ? "w-8 bg-white/35 md:bg-[#2a2724]/20"
                                                  : "w-2 bg-white/45 md:bg-[#2a2724]/25 hover:bg-white/70 md:hover:bg-[#2a2724]/45"
                                        }`}
                                    >
                                        {i === index ? (
                                            <span
                                                key={`${item.id}-${hold ? "hold" : "play"}`}
                                                className={`absolute inset-y-0 left-0 w-full rounded-full ${slide.banner ? "bg-[#2a2724]" : "bg-white md:bg-[#2a2724]"} ${
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
                    ) : (
                        <div className="hidden md:block" />
                    )}
                </div>
            </div>
        </section>
    );
}
