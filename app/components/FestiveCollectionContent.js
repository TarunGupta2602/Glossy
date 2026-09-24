import Image from "next/image";
import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import CollectionHero from "./CollectionHero";
import ProductCard from "./ProductCard";
import FestivalCountdown from "./FestivalCountdown";
import { reviewCardProps } from "@/lib/reviewCounts";
import { NAVRATRI_COLOURS } from "@/lib/festivalSeason";

export default function FestiveCollectionContent({
    collection,
    breadcrumbs,
    products = [],
    sections = [],
    reviewCounts = {},
}) {
    const theme = collection.theme || {};
    const accent = theme.accent || "#c4a574";
    const moments = collection.moments || [];
    const gridClass =
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9";

    const renderGrid = (list, priorityCount = 0) => (
        <div className={gridClass}>
            {list.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    {...reviewCardProps(reviewCounts, product.id)}
                    hideCategory
                    priority={index < priorityCount}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            ))}
        </div>
    );

    return (
        <>
            <CollectionHero
                imageUrl={collection.heroImage}
                alt={collection.headline || collection.title}
                title={collection.headline || collection.title}
                description={collection.intro}
                count={products.length}
                showingCount={products.length}
                breadcrumbs={breadcrumbs}
                eyebrow={collection.eyebrow}
                accent={accent}
            />

            <div className={`bg-gradient-to-b ${theme.surface || "from-[#FAFAFA] to-white"}`}>
                <div className={`${SITE_CONTAINER} py-8 md:py-12`}>
                    <div
                        className="mb-8 md:mb-10 overflow-hidden rounded-[1.5rem] px-5 py-5 sm:px-7 sm:py-6"
                        style={{ backgroundColor: theme.offerBg || "#f7f1e8" }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            <div>
                                <p
                                    className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5"
                                    style={{ color: accent }}
                                >
                                    Festive offer
                                </p>
                                <p
                                    className="text-[16px] sm:text-[18px] font-medium leading-snug max-w-xl"
                                    style={{ color: theme.offerText || "#3d342c" }}
                                >
                                    {collection.offerLine}
                                </p>
                            </div>
                            <FestivalCountdown
                                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                                style={{ color: accent }}
                            />
                        </div>
                        <div className="mt-5 grid sm:grid-cols-3 gap-3">
                            {[
                                {
                                    title: "Gift wrap included",
                                    body: "Complimentary festive wrap on every order — ready to give.",
                                },
                                {
                                    title: "Ships pan-India",
                                    body: "Prepaid orders over ₹1000 ship free. 10-day unused returns.",
                                },
                                {
                                    title: "Wear after the festival",
                                    body: "Anti-tarnish and waterproof — not a one-night costume piece.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl bg-white/70 border border-white/80 px-4 py-3.5"
                                >
                                    <p
                                        className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-1"
                                        style={{ color: accent }}
                                    >
                                        {item.title}
                                    </p>
                                    <p className="text-[13px] leading-relaxed" style={{ color: theme.offerText || "#5c5752" }}>
                                        {item.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {moments.length > 0 ? (
                        <div className="mb-10 md:mb-12">
                            <div className="mb-5 max-w-2xl">
                                <h2 className="font-playfair text-[1.45rem] sm:text-[1.7rem] font-semibold text-[#2a2724] tracking-tight mb-2">
                                    {collection.whyTitle}
                                </h2>
                                <p className="text-[14px] text-[#6b6560] leading-relaxed">
                                    {collection.whyBody}
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
                                {moments.map((moment) => (
                                    <figure
                                        key={moment.title}
                                        className="overflow-hidden rounded-[1.35rem] bg-white border border-[#efeae4]"
                                    >
                                        <div className="relative aspect-[5/4] overflow-hidden bg-[#f6f4f1]">
                                            <Image
                                                src={moment.image}
                                                alt={moment.alt || moment.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 33vw"
                                                quality={80}
                                                placeholder="blur"
                                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                                className="object-cover"
                                            />
                                        </div>
                                        <figcaption className="px-4 py-3.5">
                                            <p
                                                className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-1"
                                                style={{ color: accent }}
                                            >
                                                {moment.title}
                                            </p>
                                            <p className="text-[13px] text-[#5c5752] leading-relaxed">
                                                {moment.blurb}
                                            </p>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 md:mb-10 max-w-2xl">
                            <h2 className="font-playfair text-[1.45rem] sm:text-[1.7rem] font-semibold text-[#2a2724] tracking-tight mb-2">
                                {collection.whyTitle}
                            </h2>
                            <p className="text-[14px] text-[#6b6560] leading-relaxed">
                                {collection.whyBody}
                            </p>
                        </div>
                    )}

                    {collection.showColourEdit ? (
                        <div className="mb-10 md:mb-12 rounded-[1.35rem] border border-[#efeae4] bg-white px-5 py-5 sm:px-6">
                            <p
                                className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2"
                                style={{ color: accent }}
                            >
                                Navratri colours edit
                            </p>
                            <p className="text-[13px] text-[#6b6560] mb-4 max-w-xl">
                                Nine days, nine colours — match lightweight studs and drops to the day,
                                without costume jewellery.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {NAVRATRI_COLOURS.map((colour) => (
                                    <span
                                        key={colour.day}
                                        className="inline-flex items-center gap-2 rounded-full border border-[#efeae4] bg-[#fdfbf7] pl-1.5 pr-3 py-1 text-[11px] text-[#5c5752]"
                                    >
                                        <span
                                            className="h-4 w-4 rounded-full ring-1 ring-black/10"
                                            style={{ backgroundColor: colour.hex }}
                                            aria-hidden
                                        />
                                        Day {colour.day} · {colour.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {products.length > 0 ? (
                        sections.length > 0 ? (
                            <div className="space-y-12 md:space-y-14">
                                {sections.map((section, sectionIndex) => (
                                    <div key={section.id}>
                                        <div className="mb-4 md:mb-5 max-w-xl">
                                            <p
                                                className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5"
                                                style={{ color: accent }}
                                            >
                                                {section.title}
                                            </p>
                                            {section.blurb ? (
                                                <p className="text-[14px] text-[#6b6560] leading-relaxed">
                                                    {section.blurb}
                                                </p>
                                            ) : null}
                                        </div>
                                        {renderGrid(section.products, sectionIndex === 0 ? 1 : 0)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            renderGrid(products, 1)
                        )
                    ) : (
                        <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl bg-white">
                            <p className="text-gray-700 font-semibold mb-1">This edit is being curated</p>
                            <Link
                                href="/shop"
                                className="inline-flex mt-4 text-[#E91E63] font-bold text-xs uppercase tracking-widest hover:underline"
                            >
                                Browse all jewellery →
                            </Link>
                        </div>
                    )}

                    <div className="mt-12 md:mt-16 rounded-[1.5rem] border border-[#efeae4] bg-white px-5 py-6 sm:px-7 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p
                                className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-1.5"
                                style={{ color: accent }}
                            >
                                Smaller budget
                            </p>
                            <p className="font-playfair text-[1.35rem] font-semibold text-[#2a2724] tracking-tight">
                                Everyday gifts under ₹499
                            </p>
                            <p className="text-[13px] text-[#6b6560] mt-1 max-w-md">
                                Studs and dainty pieces for office gifting, birthdays, and last-minute festive boxes.
                            </p>
                        </div>
                        <Link
                            href="/gifts/under-499"
                            className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:opacity-90"
                            style={{ backgroundColor: accent }}
                        >
                            Shop under ₹499 →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
