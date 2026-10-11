"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HOME_CONTAINER, HOME_SECTION_Y, HOME_SURFACE_MIST, HOME_SURFACE_EDGE } from "@/lib/siteLayout";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";
import { INSTAGRAM_FALLBACK_IMAGES } from "@/lib/instagram";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

function reelEmbedSrc(permalink) {
    const base = (permalink || "").replace(/\/?$/, "/");
    return `${base}embed`;
}

function ReelCard({ reel, poster, index }) {
    const [active, setActive] = useState(false);
    const permalink =
        reel.permalink || `https://www.instagram.com/reel/${reel.id}/`;
    const thumb = reel.thumbnailUrl || poster;

    return (
        <article className="min-w-0 w-full">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl md:rounded-[1.35rem] bg-[#efeae4] shadow-[0_8px_30px_rgba(42,39,36,0.06)]">
                {active ? (
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
                        onClick={() => setActive(true)}
                        className="absolute inset-0 group text-left"
                        aria-label="Play Instagram reel"
                    >
                        <Image
                            src={thumb}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 48vw, (max-width: 1280px) 33vw, 16vw"
                            quality={60}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                        <span
                            className="absolute inset-0 m-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/90 text-[#2a2724] shadow-sm transition-transform duration-300 group-hover:scale-105"
                            aria-hidden="true"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </span>
                    </button>
                )}
            </div>
        </article>
    );
}

/**
 * Instagram Reels row — posters first; embeds load only on tap (much lighter).
 */
export default function HomeInstagramReels({ reels = [] }) {
    if (!reels.length) return null;

    const visible = reels.slice(0, 6);

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
                    </div>
                    <Link
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8a847c] hover:text-[#E91E63] transition-colors"
                    >
                        Follow us →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                    {visible.map((reel, index) => (
                        <ReelCard
                            key={reel.id}
                            reel={reel}
                            index={index}
                            poster={
                                INSTAGRAM_FALLBACK_IMAGES[
                                    index % INSTAGRAM_FALLBACK_IMAGES.length
                                ]
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
