import Image from "next/image";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import { BRAND_NAME, SERVICE_AREA_LABEL } from "@/lib/constants";

/** Editorial Our Story teaser — framed image + calm typography. */
export default function HomeStoryTeaser() {
    return (
        <section className="bg-[#fdfbf7] py-16 md:py-24 lg:py-28">
            <div className={HOME_CONTAINER}>
                <div className="grid md:grid-cols-2 gap-12 md:gap-14 lg:gap-20 items-center">
                    {/* Image — framed portrait */}
                    <div className="order-1">
                        <div className="relative mx-auto max-w-[420px] md:max-w-none md:mx-0">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#efeae4]">
                                <Image
                                    src="/iloveimg-resized/hero4.png"
                                    alt="The Luxe Jewels anti-tarnish jewellery"
                                    fill
                                    sizes="(max-width: 768px) 90vw, 42vw"
                                    quality={80}
                                    placeholder="blur"
                                    blurDataURL={IMAGE_BLUR_DATA_URL}
                                    className="object-cover object-center"
                                />
                            </div>

                            {/* Gold corner accents */}
                            <span
                                className="pointer-events-none absolute -top-3 -left-3 h-14 w-14 border-t border-l md:h-16 md:w-16 md:-top-4 md:-left-4"
                                style={{ borderColor: "#b89a6a" }}
                                aria-hidden="true"
                            />
                            <span
                                className="pointer-events-none absolute -bottom-3 -right-3 h-14 w-14 border-b border-r md:h-16 md:w-16 md:-bottom-4 md:-right-4"
                                style={{ borderColor: "#b89a6a" }}
                                aria-hidden="true"
                            />
                        </div>

                        <p
                            className="mt-7 md:mt-8 text-center text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase"
                            style={{ color: "#a89880" }}
                        >
                            — Anti-tarnish · Everyday wear
                        </p>
                    </div>

                    {/* Copy */}
                    <div className="order-2 max-w-lg md:pl-2 lg:pl-4">
                        <p
                            className="text-[11px] font-medium tracking-[0.22em] uppercase mb-4 md:mb-5"
                            style={{ color: "#b89a6a" }}
                        >
                            Our story
                        </p>

                        <h2 className="font-playfair text-[2rem] sm:text-[2.5rem] md:text-[2.85rem] lg:text-[3.15rem] font-medium text-[#2a2724] tracking-tight leading-[1.12] mb-5 md:mb-6">
                            Where everyday becomes{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                luxe
                            </em>
                        </h2>

                        <div
                            className="h-px w-12 mb-6 md:mb-7"
                            style={{ backgroundColor: "#b89a6a" }}
                            aria-hidden="true"
                        />

                        <p className="text-[15px] sm:text-[16px] font-medium text-[#3d3935] leading-relaxed mb-4">
                            Shine that stays with you — jewellery made for real days, not just special ones.
                        </p>

                        <p className="text-[14px] sm:text-[15px] text-[#6b6560] leading-relaxed mb-3">
                            The Luxe Jewels crafts lightweight anti-tarnish, waterproof pieces you can live
                            in — from first meetings to late evenings.
                        </p>

                        <p className="text-[13px] text-[#8a847c] leading-relaxed mb-8 md:mb-10">
                            {SERVICE_AREA_LABEL}.
                        </p>

                        <div className="mb-9 md:mb-11">
                            <p className="font-playfair text-xl md:text-2xl italic text-[#2a2724] tracking-tight">
                                {BRAND_NAME}
                            </p>
                            <p className="mt-1.5 text-[9px] font-medium tracking-[0.28em] uppercase text-[#a89880]">
                                Made for India
                            </p>
                        </div>

                        <Link
                            href="/our-story"
                            className="group inline-flex items-center gap-3.5 min-h-12 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2a2724] hover:text-[#E91E63] transition-colors"
                        >
                            Discover our story
                            <span
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors group-hover:border-[#E91E63]"
                                style={{ borderColor: "#c4b5a0" }}
                                aria-hidden="true"
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
                                >
                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
