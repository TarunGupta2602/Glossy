"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HOME_CONTAINER, HOME_SURFACE_MIST, HOME_SURFACE_EDGE } from "@/lib/siteLayout";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";
import { INSTAGRAM_FALLBACK_IMAGES } from "@/lib/instagram";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

const AUTOPLAY_MS = 3200;
const RESUME_AFTER_MS = 6000;

function wrapOffset(index, active, count) {
    const offset = index - active;
    return ((offset + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
}

function reelEmbedSrc(permalink) {
    const base = (permalink || "").replace(/\/?$/, "/");
    return `${base}embed`;
}

/**
 * Instagram reels — large Shop-by-edit style coverflow (big cards, tight overlap).
 */
export default function HomeInstagramReels({ reels = [] }) {
    const items = reels.slice(0, 6);
    const count = items.length;
    const [active, setActive] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [stepPx, setStepPx] = useState(250);
    const resumeTimer = useRef(null);
    const holdAutoplay = useRef(false);
    const touchStartX = useRef(null);

    useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const syncMotion = () => setReduceMotion(motion.matches);
        const syncStep = () => {
            const w = window.innerWidth;
            // Step slightly under card width → overlap like Shop by edit (no empty gaps).
            if (w < 640) setStepPx(155);
            else if (w < 1024) setStepPx(220);
            else if (w < 1280) setStepPx(255);
            else setStepPx(275);
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
            setPlaying(false);
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
        if (!count || reduceMotion || playing) return undefined;
        const id = window.setInterval(() => {
            if (holdAutoplay.current) return;
            if (typeof document !== "undefined" && document.hidden) return;
            go(1);
        }, AUTOPLAY_MS);
        return () => window.clearInterval(id);
    }, [count, reduceMotion, playing, go]);

    if (!count) return null;

    const current = items[active];
    const currentPermalink =
        current.permalink || `https://www.instagram.com/reel/${current.id}/`;

    return (
        <section
            className={`${HOME_SURFACE_MIST} ${HOME_SURFACE_EDGE} py-7 md:py-9 lg:py-11 overflow-x-hidden`}
            aria-label="Instagram reels"
        >
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-3 md:mb-4">
                    <p
                        className="text-[11px] font-medium tracking-[0.22em] uppercase mb-2"
                        style={{ color: "#b89a6a" }}
                    >
                        {INSTAGRAM_HANDLE}
                    </p>
                    <h2 className="font-playfair text-[1.85rem] sm:text-4xl font-medium text-[#2a2724] tracking-tight">
                        On{" "}
                        <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                            Instagram
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
                    aria-label="Previous reel"
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
                    aria-label="Next reel"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>

                <div
                    className="relative mx-auto h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] touch-pan-y"
                    style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
                    aria-roledescription="carousel"
                    aria-label="Instagram reels"
                    onTouchStart={(e) => {
                        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
                    }}
                    onTouchEnd={(e) => {
                        const start = touchStartX.current;
                        const end = e.changedTouches[0]?.clientX;
                        touchStartX.current = null;
                        if (start == null || end == null) return;
                        const delta = end - start;
                        if (Math.abs(delta) < 40) return;
                        pauseBriefly();
                        go(delta < 0 ? 1 : -1);
                    }}
                >
                    {items.map((reel, index) => {
                        const permalink =
                            reel.permalink || `https://www.instagram.com/reel/${reel.id}/`;
                        const poster =
                            reel.thumbnailUrl ||
                            INSTAGRAM_FALLBACK_IMAGES[index % INSTAGRAM_FALLBACK_IMAGES.length];
                        const caption = (reel.caption || "").trim();
                        const wrapped = wrapOffset(index, active, count);
                        const abs = Math.abs(wrapped);
                        const isActive = wrapped === 0;
                        const scale = isActive ? 1 : abs === 1 ? 0.9 : 0.78;
                        const opacity = abs > 2 ? 0 : isActive ? 1 : abs === 1 ? 0.92 : 0.42;
                        const rotate = wrapped * -14;
                        const z = 60 - abs * 12;
                        const showEmbed = isActive && playing;

                        return (
                            <div
                                key={reel.id}
                                tabIndex={isActive ? 0 : -1}
                                aria-hidden={!isActive}
                                aria-current={isActive ? "true" : undefined}
                                className="absolute left-1/2 top-0 w-[min(68vw,240px)] sm:w-[270px] md:w-[300px] lg:w-[320px] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                                style={{
                                    transform: `translate3d(calc(-50% + ${wrapped * stepPx}px), 0, 0) rotateY(${rotate}deg) scale(${scale})`,
                                    opacity,
                                    zIndex: z,
                                    pointerEvents: abs > 1 ? "none" : "auto",
                                }}
                            >
                                <div
                                    className={`relative aspect-[9/16] overflow-hidden rounded-[1.15rem] md:rounded-[1.35rem] bg-[#efeae4] ${
                                        isActive
                                            ? "shadow-[0_24px_48px_-24px_rgba(42,39,36,0.5)] ring-1 ring-black/[0.04]"
                                            : "shadow-[0_14px_32px_-26px_rgba(42,39,36,0.38)]"
                                    }`}
                                >
                                    {showEmbed ? (
                                        <iframe
                                            src={reelEmbedSrc(permalink)}
                                            title={`The Luxe Jewels Instagram reel ${reel.id}`}
                                            className="absolute inset-0 h-full w-full border-0"
                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                            allowFullScreen
                                            referrerPolicy="strict-origin-when-cross-origin"
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            className="absolute inset-0 group text-left"
                                            aria-label={
                                                isActive
                                                    ? "Play Instagram reel"
                                                    : `Show reel ${index + 1}`
                                            }
                                            onClick={() => {
                                                if (!isActive) {
                                                    pauseBriefly();
                                                    setPlaying(false);
                                                    setActive(index);
                                                    return;
                                                }
                                                pauseBriefly();
                                                setPlaying(true);
                                            }}
                                        >
                                            <Image
                                                src={poster}
                                                alt={caption || `Instagram reel ${index + 1}`}
                                                fill
                                                sizes="(max-width: 640px) 68vw, (max-width: 1024px) 300px, 320px"
                                                quality={isActive ? 85 : 68}
                                                placeholder="blur"
                                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                                className={`object-cover object-center transition-transform duration-700 ease-out ${
                                                    isActive ? "scale-105" : "scale-100"
                                                }`}
                                                priority={index === 0 || isActive}
                                            />
                                            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                            {isActive ? (
                                                <span
                                                    className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[#2a2724] shadow-[0_10px_28px_-12px_rgba(42,39,36,0.55)] transition-transform duration-300 group-hover:scale-105"
                                                    aria-hidden
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </span>
                                            ) : null}

                                            <span className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-5 pt-12">
                                                <span className="font-sans text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white drop-shadow-sm text-center line-clamp-2">
                                                    {caption || "Reel"}
                                                </span>
                                                <span
                                                    className={`mt-2.5 h-px bg-gradient-to-r from-transparent via-[#f0e2c4] to-transparent transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                                        isActive ? "w-14 opacity-100" : "w-0 opacity-0"
                                                    }`}
                                                    aria-hidden
                                                />
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 md:mt-6 flex flex-col items-center gap-3">
                    <a
                        href={currentPermalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2a2724] hover:text-[#E91E63] transition-colors"
                    >
                        {playing ? "Open on Instagram →" : "Watch this reel →"}
                    </a>
                    <div className="flex items-center gap-2">
                        {items.map((reel, index) => (
                            <button
                                key={reel.id}
                                type="button"
                                onClick={() => {
                                    pauseBriefly();
                                    setPlaying(false);
                                    setActive(index);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === active
                                        ? "w-6 bg-[#b89a6a]"
                                        : "w-1.5 bg-[#e0d8ce] hover:bg-[#cbb89a]"
                                }`}
                                aria-label={`Show reel ${index + 1}`}
                            />
                        ))}
                        <Link
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a847c] hover:text-[#E91E63] transition-colors"
                        >
                            Follow us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
