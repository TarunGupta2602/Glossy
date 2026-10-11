"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    HOME_CONTAINER,
    HOME_EDGE_SCROLL,
    HOME_SECTION_Y,
    HOME_SURFACE_MIST,
    HOME_SURFACE_EDGE,
} from "@/lib/siteLayout";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";
import { INSTAGRAM_FALLBACK_IMAGES } from "@/lib/instagram";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

function reelEmbedSrc(permalink) {
    const base = (permalink || "").replace(/\/?$/, "/");
    return `${base}embed`;
}

function ReelCard({ reel, poster, index, isPlaying, onPlay }) {
    const permalink =
        reel.permalink || `https://www.instagram.com/reel/${reel.id}/`;
    const thumb = reel.thumbnailUrl || poster;
    const caption = (reel.caption || "").trim();
    const shortCaption =
        caption.length > 48 ? `${caption.slice(0, 48).trim()}…` : caption;

    return (
        <article
            data-reel-card
            className="relative flex-none w-[58vw] max-w-[220px] sm:w-[200px] sm:max-w-none md:w-[220px] lg:w-[236px] snap-start"
        >
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.35rem] md:rounded-[1.5rem] bg-[#efeae4] shadow-[0_12px_36px_-20px_rgba(42,39,36,0.35)] ring-1 ring-black/[0.03]">
                {isPlaying ? (
                    <iframe
                        src={reelEmbedSrc(permalink)}
                        title={`The Luxe Jewels Instagram reel ${reel.id}`}
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => onPlay(index)}
                        className="absolute inset-0 group text-left"
                        aria-label={`Play reel ${index + 1}`}
                    >
                        <Image
                            src={thumb}
                            alt={shortCaption || `Instagram reel ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 58vw, 236px"
                            quality={70}
                            loading={index < 3 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/95 backdrop-blur-[2px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E91E63]" aria-hidden />
                            Reel
                        </span>

                        <span
                            className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[#2a2724] shadow-[0_10px_28px_-12px_rgba(42,39,36,0.55)] transition-transform duration-300 group-hover:scale-105"
                            aria-hidden="true"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </span>

                        {shortCaption ? (
                            <span className="absolute inset-x-0 bottom-0 p-3.5 pt-10">
                                <span className="line-clamp-2 text-[12px] leading-snug text-white/95">
                                    {shortCaption}
                                </span>
                            </span>
                        ) : (
                            <span className="absolute inset-x-0 bottom-0 p-3.5">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                                    Tap to play
                                </span>
                            </span>
                        )}
                    </button>
                )}
            </div>
        </article>
    );
}

/**
 * Instagram Reels rail — larger portrait cards, snap scroll, one embed at a time.
 */
export default function HomeInstagramReels({ reels = [] }) {
    if (!reels.length) return null;

    const visible = reels.slice(0, 9);
    const scrollerRef = useRef(null);
    const [playingIndex, setPlayingIndex] = useState(null);
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
    }, [syncArrows, visible.length]);

    const scrollByCard = (dir) => {
        const el = scrollerRef.current;
        if (!el) return;
        const card = el.querySelector("[data-reel-card]");
        const step = card ? card.getBoundingClientRect().width + 14 : el.clientWidth * 0.65;
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    return (
        <section
            className={`${HOME_SURFACE_MIST} ${HOME_SECTION_Y} ${HOME_SURFACE_EDGE}`}
            aria-label="Instagram reels"
        >
            <div className={HOME_CONTAINER}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
                    <div>
                        <p
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-2"
                            style={{ color: "#b89a6a" }}
                        >
                            {INSTAGRAM_HANDLE}
                        </p>
                        <h2 className="font-playfair text-[1.85rem] sm:text-[2.2rem] font-medium text-[#2a2724] tracking-tight leading-[1.12]">
                            On{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                Instagram
                            </em>
                        </h2>
                        <p className="mt-2 max-w-md text-[13px] sm:text-[14px] text-[#6b6560]">
                            Latest reels — tap any card to play, or open the full feed on Instagram.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => scrollByCard(-1)}
                                disabled={!canPrev}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#efeae4] bg-white text-[#2a2724] transition-colors hover:border-[#b89a6a] hover:text-[#8a5a28] disabled:opacity-30 disabled:pointer-events-none"
                                aria-label="Previous reels"
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
                                aria-label="Next reels"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                        <Link
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 items-center text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8a847c] hover:text-[#E91E63] transition-colors"
                        >
                            Watch all reels →
                        </Link>
                    </div>
                </div>

                <div className={HOME_EDGE_SCROLL}>
                    <div
                        ref={scrollerRef}
                        className="flex gap-3 sm:gap-3.5 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                    >
                        {visible.map((reel, index) => (
                            <ReelCard
                                key={reel.id}
                                reel={reel}
                                index={index}
                                isPlaying={playingIndex === index}
                                onPlay={setPlayingIndex}
                                poster={
                                    INSTAGRAM_FALLBACK_IMAGES[
                                        index % INSTAGRAM_FALLBACK_IMAGES.length
                                    ]
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
