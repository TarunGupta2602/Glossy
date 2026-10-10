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
        image: "/hero/hero-a-poster.jpg",
        video: "/hero/hero-a.mp4",
        alt: "Silver jewellery arranged on a soft studio surface",
        banner: true,
        primary: { href: "/shop", label: "Shop" },
        chip: "Daily wear edit",
        chipEyebrow: "Fresh drop",
        surface: "md:bg-[#f7f1e8]",
        frame: "bg-[#ead9c4]",
        button: "#b59e7b",
        isMain: true,
    },
    {
        id: "diwali",
        eyebrow: "Diwali edit",
        title: ["Diwali edit: light up in ", "anti-tarnish gold"],
        accentClass: "text-[#8a5a28]",
        eyebrowClass: "text-[#8a5a28]",
        body: "Office to puja — gold-look necklaces and earrings she can wear after the diyas are packed away.",
        image: "/hero/hero-b-poster.jpg",
        video: "/hero/hero-b.mp4",
        alt: "Hands wearing gold rings in soft outdoor light",
        banner: true,
        primary: { href: "/festive/diwali", label: "Shop Diwali" },
        secondary: { href: "/gifts/under-499", label: "Gifts under ₹499" },
        chip: "Buy 2 Get 1 Free",
        chipEyebrow: "Festive offer",
        surface: "md:bg-[#f7f1e8]",
        frame: "bg-[#ead9c4]",
        button: "#8a5a28",
        festival: "diwali",
    },
];

const INTERVAL_MS = 6500;
const MANUAL_RESUME_MS = 9000;

function useHeroVideoOk() {
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const decide = () => {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const saveData = Boolean(connection?.saveData);
            const slowNet = /2g/i.test(connection?.effectiveType || "");
            // Mobile + desktop: play compressed hero videos unless data-saver / slow net / reduced motion.
            setOk(!reduceMotion && !saveData && !slowNet);
        };

        decide();
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        connection?.addEventListener?.("change", decide);
        return () => connection?.removeEventListener?.("change", decide);
    }, []);

    return ok;
}

/**
 * Homepage hero carousel: brand header, then Diwali.
 * Auto-advances on its own. Arrows/dots only pause briefly after a tap.
 */
export default function HeroSlider() {
    // Diwali-led season: keep brand slide first, festive second.
    const slides = SLIDES;
    const [index, setIndex] = useState(0);
    const [hold, setHold] = useState(false);
    const [armedVideos, setArmedVideos] = useState({});
    const [readyVideos, setReadyVideos] = useState({});
    const resumeTimer = useRef(null);
    const videoRefs = useRef({});
    const videoOk = useHeroVideoOk();
    const slide = slides[index] || slides[0];
    const Heading = index === 0 ? "h1" : "p";

    useEffect(() => {
        if (!videoOk || !slide.video) return;
        setArmedVideos((prev) => (prev[slide.id] ? prev : { ...prev, [slide.id]: true }));
    }, [slide.id, slide.video, videoOk]);

    const goTo = useCallback((next) => {
        setIndex(((next % slides.length) + slides.length) % slides.length);
    }, [slides.length]);

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
            setIndex((current) => (current + 1) % slides.length);
        }, INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [hold, slides.length]);

    useEffect(() => {
        Object.entries(videoRefs.current).forEach(([id, el]) => {
            if (!el) return;
            if (id === slide.id && videoOk) {
                const play = el.play();
                if (play?.catch) play.catch(() => {});
            } else {
                el.pause();
                try {
                    el.currentTime = 0;
                } catch {
                    /* ignore seek race */
                }
            }
        });
    }, [slide.id, videoOk]);

    return (
        <section
            className={`relative overflow-hidden ${slide.banner ? "bg-[#ebe2d6]" : slide.surface}`}
            aria-roledescription="carousel"
            aria-label="The Luxe Jewels"
        >
            {slide.banner ? (
                <div className="absolute inset-0">
                    {slides.filter((item) => item.banner).map((item) => {
                        const active = item.id === slide.id;
                        const mounted = Boolean(item.video && videoOk && armedVideos[item.id]);
                        const videoVisible = Boolean(active && readyVideos[item.id]);

                        return (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-700 ${
                                    active ? "opacity-100" : "opacity-0"
                                }`}
                                aria-hidden={!active}
                            >
                                <Image
                                    src={item.image}
                                    alt=""
                                    fill
                                    priority={item.id === "main"}
                                    sizes="100vw"
                                    quality={78}
                                    placeholder="blur"
                                    blurDataURL={IMAGE_BLUR_DATA_URL}
                                    className={`object-cover brightness-[0.9] contrast-[1.08] saturate-[1.05] ${
                                        item.video
                                            ? "object-[55%_35%] md:object-[68%_35%]"
                                            : "object-[70%_30%] md:object-[70%_28%]"
                                    }`}
                                />
                                {mounted ? (
                                    <video
                                        ref={(el) => {
                                            if (el) videoRefs.current[item.id] = el;
                                            else delete videoRefs.current[item.id];
                                        }}
                                        className={`absolute inset-0 h-full w-full object-cover brightness-[0.9] contrast-[1.08] saturate-[1.05] transition-opacity duration-700 ${
                                            item.id === "main"
                                                ? "object-[55%_35%] md:object-[68%_35%]"
                                                : "object-[55%_40%] md:object-[60%_35%]"
                                        } ${videoVisible ? "opacity-100" : "opacity-0"}`}
                                        muted
                                        playsInline
                                        loop
                                        preload="metadata"
                                        poster={item.image}
                                        onCanPlay={() =>
                                            setReadyVideos((prev) =>
                                                prev[item.id] ? prev : { ...prev, [item.id]: true }
                                            )
                                        }
                                    >
                                        <source src={item.video} type="video/mp4" />
                                    </video>
                                ) : null}
                            </div>
                        );
                    })}
                    <div className="pointer-events-none absolute inset-0 bg-[#8a5a28]/[0.07]" />
                    <div className="pointer-events-none absolute inset-0 md:hidden bg-gradient-to-b from-[#ebe2d6]/25 via-[#ebe2d6]/70 to-[#ebe2d6]" />
                    <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-r from-[#ebe2d6] from-[0%] via-[#ebe2d6]/75 via-[36%] to-transparent to-[62%]" />
                    <div className="pointer-events-none absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_at_78%_42%,transparent_15%,rgba(42,39,36,0.22)_100%)]" />
                </div>
            ) : (
                <div className="absolute inset-0 md:hidden" aria-hidden="true">
                    <Image
                        src={slides[0].image}
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

            <div className={`relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex py-6 md:py-8 lg:py-10 ${
                slide.banner
                    ? "min-h-[78svh] items-end md:min-h-[420px] lg:min-h-[460px] xl:min-h-[500px] md:items-center"
                    : "min-h-[88svh] items-end md:min-h-0 md:items-center"
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
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2724]/15 text-[#2a2724] hover:border-[#2a2724] transition-colors"
                                aria-label="Previous slide"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                                    <path d="M19 12H5m7 7-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                                {slides.map((item, i) => (
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
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2724]/15 text-[#2a2724] hover:border-[#2a2724] transition-colors"
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
                            {slides.map((item, i) => (
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
