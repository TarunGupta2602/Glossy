"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HOME_CONTAINER, HOME_SECTION_Y } from "@/lib/siteLayout";
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
        <article className="shrink-0 w-[min(72vw,280px)] sm:w-[260px] md:w-[270px] snap-start">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-[#efeae4] shadow-[0_8px_30px_rgba(42,39,36,0.06)]">
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
                            sizes="280px"
                            quality={60}
                            loading={index < 2 ? "lazy" : "lazy"}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                        <span
                            className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#2a2724] shadow-sm transition-transform duration-300 group-hover:scale-105"
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
            <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-10 items-center text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 hover:text-[#E91E63] transition-colors px-0.5"
            >
                Open on Instagram
            </a>
        </article>
    );
}

/**
 * Instagram Reels row — posters first; embeds load only on tap (much lighter).
 */
export default function HomeInstagramReels({ reels = [] }) {
    if (!reels.length) return null;

    const visible = reels.slice(0, 3);

    return (
        <section
            className={`bg-[#fdfbf7] ${HOME_SECTION_Y} border-t border-[#efeae4]`}
            aria-label="Instagram reels"
        >
            <div className={HOME_CONTAINER}>
                <div className="flex items-end justify-between gap-4 mb-8 md:mb-8 lg:mb-10">
                    <div>
                        <p
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: "#b89a6a" }}
                        >
                            {INSTAGRAM_HANDLE}
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-playfair font-medium text-gray-900 tracking-tight">
                            On{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                Instagram
                            </em>
                        </h2>
                        <p className="mt-3 text-[14px] sm:text-[15px] text-[#6b6560] max-w-md leading-relaxed">
                            Styling moments, new drops, and everyday shine — tap to play a reel.
                        </p>
                    </div>
                    <Link
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 hover:text-[#E91E63] transition-colors min-h-11 items-center"
                    >
                        Follow us
                    </Link>
                </div>

                <div className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1">
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

                <div className="mt-8 md:mt-10 flex justify-center sm:hidden">
                    <Link
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 hover:text-[#E91E63] transition-colors"
                    >
                        Follow {INSTAGRAM_HANDLE}
                    </Link>
                </div>
            </div>
        </section>
    );
}
