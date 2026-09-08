"use client";

import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";

function reelEmbedSrc(permalink) {
    const base = (permalink || "").replace(/\/?$/, "/");
    return `${base}embed`;
}

/**
 * Instagram Reels row — embedded players from @theluxejewels.in_
 */
export default function HomeInstagramReels({ reels = [] }) {
    if (!reels.length) return null;

    return (
        <section
            className="bg-[#fdfbf7] py-14 md:py-20 border-t border-[#efeae4]"
            aria-label="Instagram reels"
        >
            <div className={HOME_CONTAINER}>
                <div className="flex items-end justify-between gap-4 mb-8 md:mb-12">
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
                            Styling moments, new drops, and everyday shine — straight from our reels.
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
                    {reels.map((reel) => {
                        const permalink =
                            reel.permalink ||
                            `https://www.instagram.com/reel/${reel.id}/`;

                        return (
                            <article
                                key={reel.id}
                                className="shrink-0 w-[min(72vw,280px)] sm:w-[260px] md:w-[270px] snap-start"
                            >
                                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-[#efeae4] shadow-[0_8px_30px_rgba(42,39,36,0.06)]">
                                    <iframe
                                        src={reelEmbedSrc(permalink)}
                                        title={`The Luxe Jewels Instagram reel ${reel.id}`}
                                        className="absolute inset-0 h-full w-full border-0"
                                        loading="lazy"
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        allowFullScreen
                                        referrerPolicy="strict-origin-when-cross-origin"
                                    />
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
                    })}
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
