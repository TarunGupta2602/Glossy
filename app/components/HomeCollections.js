"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HOME_CONTAINER, HOME_SURFACE_IVORY, HOME_SURFACE_EDGE } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

const AUTOPLAY_MS = 3200;
const RESUME_AFTER_MS = 6000;

function wrapOffset(index, active, count) {
    const offset = index - active;
    return ((offset + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
}

/** Large Palmonas-style coverflow — big clear center image, tilted sides. */
export default function HomeCollections({ collections = [] }) {
    const items = collections.slice(0, 5);
    const count = items.length;
    const [active, setActive] = useState(0);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [stepPx, setStepPx] = useState(260);
    const resumeTimer = useRef(null);
    const holdAutoplay = useRef(false);

    useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const syncMotion = () => setReduceMotion(motion.matches);
        const syncStep = () => {
            const w = window.innerWidth;
            if (w < 640) setStepPx(190);
            else if (w < 1024) setStepPx(280);
            else if (w < 1280) setStepPx(340);
            else setStepPx(380);
        };
        syncMotion();
        syncStep();
        motion.addEventListener("change", syncMotion);
        window.addEventListener("resize", syncStep);
        return () => {
            motion.removeEventListener("change", syncMotion);
            window.removeEventListener("resize", syncStep);
            if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        };
    }, []);

    const go = useCallback(
        (dir) => {
            if (!count) return;
            setActive((i) => (i + dir + count) % count);
        },
        [count]
    );

    const pauseBriefly = useCallback(() => {
        holdAutoplay.current = true;
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        resumeTimer.current = window.setTimeout(() => {
            holdAutoplay.current = false;
        }, RESUME_AFTER_MS);
    }, []);

    useEffect(() => {
        if (!count || reduceMotion) return undefined;
        const id = window.setInterval(() => {
            if (holdAutoplay.current) return;
            if (typeof document !== "undefined" && document.hidden) return;
            go(1);
        }, AUTOPLAY_MS);
        return () => window.clearInterval(id);
    }, [count, reduceMotion, go]);

    if (!count) return null;

    const current = items[active];
    const currentTitle = current.label || current.name;

    return (
        <section
            className={`${HOME_SURFACE_IVORY} ${HOME_SURFACE_EDGE} py-7 md:py-9 lg:py-11 overflow-x-hidden`}
        >
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-4 md:mb-5">
                    <p
                        className="text-[11px] font-medium tracking-[0.22em] uppercase mb-2"
                        style={{ color: "#b89a6a" }}
                    >
                        Explore
                    </p>
                    <h2 className="font-playfair text-[1.85rem] sm:text-4xl font-medium text-[#2a2724] tracking-tight">
                        Shop by{" "}
                        <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                            edit
                        </em>
                    </h2>
                </div>
            </div>

            <div className="relative w-full max-w-[1400px] mx-auto px-1 sm:px-4">
                <button
                    type="button"
                    onClick={() => {
                        pauseBriefly();
                        go(-1);
                    }}
                    className="absolute left-2 sm:left-4 md:left-8 top-1/2 z-50 -translate-y-1/2 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/95 text-[#2a2724] border border-[#efeae4] hover:border-[#b89a6a] hover:text-[#8a5a28] transition-colors shadow-[0_8px_24px_-12px_rgba(42,39,36,0.45)]"
                    aria-label="Previous edit"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        pauseBriefly();
                        go(1);
                    }}
                    className="absolute right-2 sm:right-4 md:right-8 top-1/2 z-50 -translate-y-1/2 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/95 text-[#2a2724] border border-[#efeae4] hover:border-[#b89a6a] hover:text-[#8a5a28] transition-colors shadow-[0_8px_24px_-12px_rgba(42,39,36,0.45)]"
                    aria-label="Next edit"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>

                <div
                    className="relative mx-auto h-[390px] sm:h-[480px] md:h-[560px] lg:h-[620px]"
                    style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
                    aria-roledescription="carousel"
                    aria-label="Shop by edit"
                >
                    {items.map((item, index) => {
                        const title = item.label || item.name;
                        const wrapped = wrapOffset(index, active, count);
                        const abs = Math.abs(wrapped);
                        const isActive = wrapped === 0;
                        const scale = isActive ? 1 : abs === 1 ? 0.9 : 0.78;
                        const opacity = isActive ? 1 : abs === 1 ? 0.88 : 0.4;
                        const rotate = wrapped * -18;
                        const z = 60 - abs * 12;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                tabIndex={isActive ? 0 : -1}
                                aria-hidden={!isActive}
                                aria-current={isActive ? "true" : undefined}
                                onClick={(e) => {
                                    if (!isActive) {
                                        e.preventDefault();
                                        pauseBriefly();
                                        setActive(index);
                                    }
                                }}
                                className="absolute left-1/2 top-0 w-[min(78vw,320px)] sm:w-[360px] md:w-[400px] lg:w-[440px] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                                style={{
                                    transform: `translate3d(calc(-50% + ${wrapped * stepPx}px), 0, 0) rotateY(${rotate}deg) scale(${scale})`,
                                    opacity,
                                    zIndex: z,
                                    pointerEvents: abs > 1 ? "none" : "auto",
                                }}
                            >
                                <div
                                    className={`relative aspect-[3/4] overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] bg-[#efeae4] ${
                                        isActive
                                            ? "shadow-[0_28px_60px_-28px_rgba(42,39,36,0.55)] ring-1 ring-black/[0.04]"
                                            : "shadow-[0_16px_36px_-28px_rgba(42,39,36,0.4)]"
                                    }`}
                                >
                                    <Image
                                        src={item.image || "/logo.png"}
                                        alt={title}
                                        fill
                                        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 400px, 440px"
                                        quality={isActive ? 85 : 70}
                                        placeholder="blur"
                                        blurDataURL={IMAGE_BLUR_DATA_URL}
                                        className="object-cover object-center"
                                        priority={index === 0 || isActive}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-6 pt-12">
                                        <span className="font-sans text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.2em] text-white drop-shadow-sm">
                                            {title}
                                        </span>
                                        <span className="mt-2.5 h-px w-12 bg-white/90" aria-hidden />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-5 md:mt-6 flex flex-col items-center gap-3">
                    <Link
                        href={current.href}
                        className="inline-flex min-h-10 items-center text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2a2724] hover:text-[#E91E63] transition-colors"
                    >
                        Shop {currentTitle.toLowerCase()} →
                    </Link>
                    <div className="flex items-center gap-2">
                        {items.map((item, index) => (
                            <button
                                key={item.href}
                                type="button"
                                onClick={() => {
                                    pauseBriefly();
                                    setActive(index);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === active
                                        ? "w-6 bg-[#b89a6a]"
                                        : "w-1.5 bg-[#e0d8ce] hover:bg-[#cbb89a]"
                                }`}
                                aria-label={`Show ${item.label || item.name}`}
                            />
                        ))}
                        <Link
                            href="/collection"
                            className="ml-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a847c] hover:text-[#E91E63] transition-colors"
                        >
                            View all
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
