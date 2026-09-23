import Image from "next/image";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import { PROMO_LABEL } from "@/lib/promo";
import FestivalCountdown from "./FestivalCountdown";

const CARDS = [
    {
        href: "/festive/diwali",
        title: "Diwali jewellery",
        hint: "Office to puja",
        image: "/festive/diwali-festive-hero.jpg",
        alt: "Gold Diwali necklace and earrings on ivory silk",
        accent: "#e8d5b5",
    },
    {
        href: "/festive/navratri",
        title: "Navratri jewellery",
        hint: "Desk to dandiya",
        image: "/festive/navratri-festive-hero.jpg",
        alt: "Colourful Navratri earrings and pendant on wine silk",
        accent: "#f3c6d6",
    },
];

/** Festive occasion strip — two distinct edits, one offer. */
export default function HomeGiftEdits() {
    return (
        <section className="bg-[#fdfbf7] py-10 md:py-14 border-t border-[#efeae4]">
            <div className={HOME_CONTAINER}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
                    <div>
                        <p
                            className="text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase mb-2"
                            style={{ color: "#b89a6a" }}
                        >
                            This festive season
                        </p>
                        <h2 className="font-playfair text-[1.85rem] sm:text-[2.2rem] font-semibold text-[#2a2724] tracking-tight leading-[1.12]">
                            Two festivals.{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                One offer.
                            </em>
                        </h2>
                    </div>
                    <div className="max-w-sm">
                        <p className="text-[13px] sm:text-[14px] text-[#6b6560]">
                            {PROMO_LABEL} this festive season — pick the edit that matches the night.
                        </p>
                        <FestivalCountdown className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a5a28]" />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                    {CARDS.map((card) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group relative overflow-hidden rounded-[1.5rem] bg-[#f6f4f1] min-h-[240px] sm:min-h-[280px] md:min-h-[340px]"
                        >
                            <Image
                                src={card.image}
                                alt={card.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                quality={85}
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                                <p
                                    className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5"
                                    style={{ color: card.accent }}
                                >
                                    {card.hint}
                                </p>
                                <p className="font-playfair text-[1.55rem] md:text-[1.85rem] text-white font-medium leading-tight">
                                    {card.title}
                                </p>
                                <span className="inline-flex mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                                    Shop the edit →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#6b6560]">
                    <span>Need a smaller gift?</span>
                    <Link href="/gifts/under-499" className="font-semibold text-[#2a2724] hover:text-[#E91E63]">
                        Gifts under ₹499
                    </Link>
                </div>
            </div>
        </section>
    );
}
