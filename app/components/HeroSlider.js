import Image from "next/image";
import Link from "next/link";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

const HERO_IMAGE = "/iloveimg-resized/hero2.jpg";
const HERO_ALT = "The Luxe Jewels anti-tarnish gold plated jewellery";

/**
 * Mobile: full-bleed photo with copy overlaid.
 * Desktop: cream split layout with portrait image.
 */
export default function HeroSlider() {
    return (
        <section
            className="relative md:bg-[#fdfbf7] overflow-hidden"
            aria-label="The Luxe Jewels"
        >
            {/* Mobile background only */}
            <div className="absolute inset-0 md:hidden" aria-hidden="true">
                <Image
                    src={HERO_IMAGE}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    quality={90}
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover object-[center_20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/78" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 sm:px-10 md:px-14 lg:px-16 min-h-[88svh] md:min-h-0 flex items-end md:items-center py-10 md:py-16 lg:py-20">
                <div className="grid w-full md:grid-cols-[1fr_1.05fr] gap-10 lg:gap-12 items-center">
                    {/* Copy */}
                    <div className="text-left pb-2 md:pb-0">
                        <p className="text-[11px] font-medium tracking-[0.22em] uppercase mb-3 md:mb-5 text-[#e8d5b5] md:text-[#b59e7b]">
                            Anti-tarnish · Waterproof · Made for India
                        </p>

                        <h1 className="font-playfair text-[2.45rem] sm:text-[2.75rem] md:text-[3.15rem] lg:text-[3.4rem] font-medium tracking-tight leading-[1.08] mb-3 md:mb-5 text-white md:text-[#2a2724] max-w-[18ch] md:max-w-none">
                            Shine that stays with you —{" "}
                            <em className="italic font-normal text-[#e8d5b5] md:text-[#b59e7b]">
                                every day
                            </em>
                        </h1>

                        <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed mb-7 md:mb-9 max-w-[34ch] md:max-w-[400px] text-white/80 md:text-[#6b6560]">
                            Lightweight anti-tarnish jewellery you can live in — from first meetings
                            to late evenings
                            <span className="hidden md:inline">, with pieces ready to gift</span>.
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/shop?sort=popular"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 bg-white text-[#2a2724] hover:bg-[#E91E63] hover:text-white md:bg-[#2a2724] md:text-white md:hover:bg-[#E91E63]"
                            >
                                Shop bestsellers
                                <span aria-hidden>→</span>
                            </Link>
                            <Link
                                href="/gifts/under-999"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 md:border-[#2a2724]/25 md:bg-transparent md:backdrop-blur-none md:text-[#2a2724] md:hover:border-[#2a2724] md:hover:bg-transparent"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="hidden md:block"
                                    aria-hidden="true"
                                >
                                    <rect x="3" y="8" width="18" height="13" rx="1" />
                                    <path d="M12 8V3" />
                                    <path d="M8.5 3h7" />
                                    <path d="M12 8v13" />
                                </svg>
                                Shop gifts
                            </Link>
                        </div>

                        <p className="mt-6 md:hidden text-[10px] font-medium tracking-[0.2em] uppercase text-white/55">
                            Buy 2 get 1 free
                        </p>
                    </div>

                    {/* Desktop portrait image */}
                    <div className="hidden md:flex flex-col items-stretch">
                        <div className="relative w-full aspect-[3/4] min-h-[560px] lg:min-h-[620px] max-h-[660px] overflow-hidden rounded-[2.5rem] bg-[#efeae4]">
                            <Image
                                src={HERO_IMAGE}
                                alt={HERO_ALT}
                                fill
                                priority
                                sizes="600px"
                                quality={90}
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                className="object-cover object-center"
                            />

                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                                <div className="rounded-2xl bg-white/90 backdrop-blur-sm px-3.5 py-2.5 shadow-sm">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8a847c]">
                                        Fresh drop
                                    </p>
                                    <p className="text-[13px] font-semibold text-[#2a2724] leading-tight mt-0.5">
                                        Daily wear edit
                                    </p>
                                </div>
                                <Link
                                    href="/shop?sort=newest"
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#b59e7b" }}
                                    aria-label="Shop new arrivals"
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
