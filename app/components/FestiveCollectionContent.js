import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import CollectionHero from "./CollectionHero";
import ProductCard from "./ProductCard";
import { reviewCardProps } from "@/lib/reviewCounts";
import { NAVRATRI_COLOURS } from "@/lib/festivalSeason";

export default function FestiveCollectionContent({
    collection,
    breadcrumbs,
    products = [],
    sections = [],
    reviewCounts = {},
    intentLinks = [],
}) {
    const theme = collection.theme || {};
    const accent = theme.accent || "#c4a574";
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
                alt={collection.title}
                title={collection.title}
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
                        className="mb-6 md:mb-8 rounded-2xl px-5 py-4 sm:px-6 sm:py-5"
                        style={{ backgroundColor: theme.offerBg || "#f7f1e8" }}
                    >
                        <p
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5"
                            style={{ color: accent }}
                        >
                            Festive offer
                        </p>
                        <p
                            className="text-[15px] sm:text-[16px] font-medium leading-snug"
                            style={{ color: theme.offerText || "#3d342c" }}
                        >
                            {collection.offerLine}
                        </p>
                    </div>

                    <div className="mb-8 md:mb-10 max-w-2xl">
                        <h2 className="font-playfair text-[1.45rem] sm:text-[1.7rem] font-semibold text-[#2a2724] tracking-tight mb-2">
                            {collection.whyTitle}
                        </h2>
                        <p className="text-[14px] text-[#6b6560] leading-relaxed">
                            {collection.whyBody}
                        </p>
                    </div>

                    <div className="mb-8 md:mb-10 grid sm:grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-[#efeae4] bg-white px-4 py-3.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: accent }}>
                                Festive packaging
                            </p>
                            <p className="text-[13px] text-[#5c5752] leading-relaxed">
                                Complimentary gift wrap on every order — ready to give, no extra step.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#efeae4] bg-white px-4 py-3.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: accent }}>
                                Ships pan-India
                            </p>
                            <p className="text-[13px] text-[#5c5752] leading-relaxed">
                                Prepaid orders over ₹1000 ship free. 10-day returns if unused.
                            </p>
                        </div>
                    </div>

                    {collection.showColourEdit ? (
                        <div className="mb-10 md:mb-12">
                            <p
                                className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
                                style={{ color: accent }}
                            >
                                Navratri colours edit
                            </p>
                            <p className="text-[13px] text-[#6b6560] mb-4 max-w-xl">
                                Nine days, nine colours — match lightweight studs and drops to the day, without costume jewellery.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {NAVRATRI_COLOURS.map((colour) => (
                                    <span
                                        key={colour.day}
                                        className="inline-flex items-center gap-2 rounded-full border border-[#efeae4] bg-white pl-1.5 pr-3 py-1 text-[11px] text-[#5c5752]"
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

                    {intentLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
                            {intentLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex min-h-9 items-center rounded-full border border-[#efeae4] bg-white px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {products.length > 0 ? (
                        sections.length > 0 ? (
                            <div className="space-y-12 md:space-y-14">
                                {sections.map((section, sectionIndex) => (
                                    <div key={section.id}>
                                        <p
                                            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
                                            style={{ color: accent }}
                                        >
                                            {section.title}
                                        </p>
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
                </div>
            </div>
        </>
    );
}
