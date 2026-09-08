import Image from "next/image";
import Link from "next/link";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/**
 * The Luxe Jewels hero — original brand copy, taller section, larger image.
 */
export default function HeroSlider() {
    return (
        <section className="bg-[#fdfbf7]" aria-label="The Luxe Jewels">
            <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 md:px-14 lg:px-16 py-12 sm:py-14 md:py-16 lg:py-20">
                <div className="grid md:grid-cols-[1fr_1.05fr] gap-8 md:gap-10 lg:gap-12 items-center">
                    {/* Left — copy */}
                    <div className="order-2 md:order-1 text-center md:text-left">
                        <p
                            className="text-[11px] font-medium tracking-[0.22em] uppercase mb-4 md:mb-5"
                            style={{ color: "#b59e7b" }}
                        >
                            Anti-tarnish · Waterproof · Made for India
                        </p>

                        <h1 className="font-playfair text-[2.35rem] sm:text-[2.75rem] md:text-[3.15rem] lg:text-[3.4rem] font-medium text-[#2a2724] tracking-tight leading-[1.1] mb-4 md:mb-5">
                            Shine that stays with you —{" "}
                            <em className="italic font-normal" style={{ color: "#b59e7b" }}>
                                every day
                            </em>
                        </h1>

                        <p className="text-[15px] sm:text-[16px] text-[#6b6560] leading-relaxed mb-8 md:mb-9 max-w-[400px] mx-auto md:mx-0">
                            Lightweight anti-tarnish jewellery you can live in — from first meetings to late evenings, with pieces ready to gift.
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <Link
                                href="/shop?sort=popular"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2a2724] px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#E91E63] transition-colors duration-300"
                            >
                                Shop bestsellers
                                <span aria-hidden>→</span>
                            </Link>
                            <Link
                                href="/gifts/under-999"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#2a2724]/25 bg-transparent px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2a2724] hover:border-[#2a2724] transition-colors"
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
                    </div>

                    {/* Right — larger image */}
                    <div className="order-1 md:order-2 flex flex-col items-center md:items-stretch">
                        <div className="relative w-full max-w-[480px] md:max-w-none mx-auto aspect-[3/4] min-h-[420px] sm:min-h-[500px] md:min-h-[560px] lg:min-h-[620px] md:max-h-[660px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#efeae4]">
                            <Image
                                src="/iloveimg-resized/hero2.jpg"
                                alt="The Luxe Jewels anti-tarnish gold plated jewellery"
                                fill
                                priority
                                sizes="(max-width: 768px) 480px, 600px"
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
