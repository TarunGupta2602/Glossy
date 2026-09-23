import Link from "next/link";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import { getFestivalHero, isFestivalSeason } from "@/lib/festivalSeason";
import FestivalCountdown from "./FestivalCountdown";

const EVERYDAY_IMAGE = "/iloveimg-resized/hero2.jpg";
const EVERYDAY_ALT = "The Luxe Jewels anti-tarnish gold plated jewellery";

/**
 * Mobile: full-bleed image + copy overlay.
 * Desktop: cream (or festive ivory) split with portrait still.
 * During the festive window the hero swaps copy, image, and CTAs.
 */
export default function HeroSlider() {
    const festive = isFestivalSeason();
    const hero = festive ? getFestivalHero() : null;
    const image = hero?.image || EVERYDAY_IMAGE;
    const alt = hero ? `${hero.lead.name} jewellery from The Luxe Jewels` : EVERYDAY_ALT;

    return (
        <section
            className={`relative overflow-hidden ${
                festive ? "md:bg-[#f7f1e8]" : "md:bg-[#fdfbf7]"
            }`}
            aria-label="The Luxe Jewels"
        >
            <div className="absolute inset-0 md:hidden" aria-hidden="true">
                <Image
                    src={image}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    quality={90}
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover object-[center_20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 sm:px-10 md:px-14 lg:px-16 min-h-[88svh] md:min-h-0 flex items-end md:items-center py-10 md:py-16 lg:py-20">
                <div className="grid w-full md:grid-cols-[1fr_1.05fr] gap-10 lg:gap-12 items-center">
                    <div className="text-left pb-2 md:pb-0">
                        <p
                            className={`text-[11px] font-medium tracking-[0.22em] uppercase mb-3 md:mb-5 ${
                                festive
                                    ? "text-[#e8d5b5] md:text-[#8a5a28]"
                                    : "text-[#e8d5b5] md:text-[#b59e7b]"
                            }`}
                        >
                            {hero?.eyebrow || "Anti-tarnish · Waterproof · Made for India"}
                        </p>

                        {festive ? (
                            <h1 className="font-playfair text-[2.35rem] sm:text-[2.7rem] md:text-[3.05rem] lg:text-[3.3rem] font-medium tracking-tight leading-[1.08] mb-3 md:mb-5 text-white md:text-[#2a2724] max-w-[18ch] md:max-w-[16ch]">
                                {hero.lead.slug === "diwali" ? (
                                    <>
                                        Diwali edit: light up in{" "}
                                        <em className="italic font-normal text-[#e8d5b5] md:text-[#8a5a28]">
                                            anti-tarnish gold
                                        </em>
                                    </>
                                ) : (
                                    <>
                                        Navratri edit: nine days,{" "}
                                        <em className="italic font-normal text-[#e8d5b5] md:text-[#7a2248]">
                                            everyday sparkle
                                        </em>
                                    </>
                                )}
                            </h1>
                        ) : (
                            <h1 className="font-playfair text-[2.45rem] sm:text-[2.75rem] md:text-[3.15rem] lg:text-[3.4rem] font-medium tracking-tight leading-[1.08] mb-3 md:mb-5 text-white md:text-[#2a2724] max-w-[18ch] md:max-w-none">
                                Shine that stays with you —{" "}
                                <em className="italic font-normal text-[#e8d5b5] md:text-[#b59e7b]">
                                    every day
                                </em>
                            </h1>
                        )}

                        <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed mb-6 md:mb-8 max-w-[34ch] md:max-w-[400px] text-white/80 md:text-[#6b6560]">
                            {hero?.body || (
                                <>
                                    Lightweight anti-tarnish jewellery you can live in — from first
                                    meetings to late evenings
                                    <span className="hidden md:inline">, with pieces ready to gift</span>.
                                </>
                            )}
                        </p>

                        {festive ? <FestivalCountdown className="mb-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b5] md:text-[#8a5a28]" /> : null}

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href={hero?.primary.href || "/shop?sort=popular"}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 bg-white text-[#2a2724] hover:bg-[#E91E63] hover:text-white md:bg-[#2a2724] md:text-white md:hover:bg-[#E91E63]"
                            >
                                {hero?.primary.label || "Shop bestsellers"}
                                <span aria-hidden>→</span>
                            </Link>
                            <Link
                                href={hero?.secondary.href || "/festive/diwali"}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 md:border-[#2a2724]/25 md:bg-transparent md:backdrop-blur-none md:text-[#2a2724] md:hover:border-[#2a2724] md:hover:bg-transparent"
                            >
                                {hero?.secondary.label || "Shop Diwali"}
                            </Link>
                        </div>

                        <p className="mt-6 md:hidden text-[10px] font-medium tracking-[0.2em] uppercase text-white/55">
                            Buy 2 get 1 free
                        </p>
                    </div>

                    <div className="hidden md:flex flex-col items-stretch">
                        <div
                            className={`relative w-full aspect-[3/4] min-h-[560px] lg:min-h-[620px] max-h-[660px] overflow-hidden rounded-[2.5rem] ${
                                festive ? "bg-[#ead9c4]" : "bg-[#efeae4]"
                            }`}
                        >
                            <Image
                                src={image}
                                alt={alt}
                                fill
                                priority
                                sizes="600px"
                                quality={90}
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                className="object-cover object-center"
                            />

                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 z-10">
                                <div className="rounded-2xl bg-white/90 backdrop-blur-sm px-3.5 py-2.5 shadow-sm">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8a847c]">
                                        {festive ? "Festive offer" : "Fresh drop"}
                                    </p>
                                    <p className="text-[13px] font-semibold text-[#2a2724] leading-tight mt-0.5">
                                        {festive ? "Buy 2 Get 1 Free" : "Daily wear edit"}
                                    </p>
                                </div>
                                <Link
                                    href={hero?.primary.href || "/shop?sort=newest"}
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: festive ? "#8a5a28" : "#b59e7b" }}
                                    aria-label={hero?.primary.label || "Shop new arrivals"}
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
                </div>
            </div>
        </section>
    );
}
