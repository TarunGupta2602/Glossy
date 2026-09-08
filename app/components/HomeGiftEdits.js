import Image from "next/image";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/** Gift section — separate from hero, its own message. */
export default function HomeGiftEdits() {
    return (
        <section className="bg-white py-10 md:py-14 border-t border-gray-100">
            <div className={HOME_CONTAINER}>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                    <div className="relative w-full max-w-[400px] mx-auto md:mx-0 h-[280px] sm:h-[320px] md:h-[360px] overflow-hidden rounded-[1.75rem] bg-[#f6f4f1]">
                        <Image
                            src="/iloveimg-resized/hero4.png"
                            alt="Gift-ready anti-tarnish jewellery"
                            fill
                            sizes="400px"
                            quality={85}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-cover object-[center_25%]"
                        />
                    </div>

                    <div className="max-w-md mx-auto md:mx-0 text-center md:text-left">
                        <p
                            className="text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase mb-4"
                            style={{ color: "#b89a6a" }}
                        >
                            For her
                        </p>
                        <h2 className="font-playfair text-[1.85rem] sm:text-[2.35rem] md:text-[2.65rem] font-semibold text-gray-900 tracking-tight leading-[1.12] mb-4">
                            Gifts she&apos;ll{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                actually
                            </em>{" "}
                            wear
                        </h2>
                        <p className="text-[14px] sm:text-[15px] text-gray-500 leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
                            Thoughtful anti-tarnish pieces for everyday wear and effortless gifting.
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <Link
                                href="/gifts/under-999"
                                className="inline-flex h-11 items-center rounded-full bg-[#1a1214] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#E91E63] transition-colors duration-300"
                            >
                                Gifts under ₹999
                            </Link>
                            <Link
                                href="/gifts/under-499"
                                className="inline-flex h-11 items-center rounded-full border border-gray-300 px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-900 hover:border-gray-900 transition-colors"
                            >
                                Under ₹499
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
