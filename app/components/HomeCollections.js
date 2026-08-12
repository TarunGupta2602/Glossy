import Image from "next/image";
import Link from "next/link";
import { HOME_CONTAINER, HOME_EDGE_SCROLL } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/**
 * Homepage collections — vertical “More Collections” cards (5 edits).
 * Desktop: 5-column grid. Mobile: horizontal snap carousel.
 */
export default function HomeCollections({ collections = [] }) {
    if (!collections.length) return null;

    const items = collections.slice(0, 5);

    return (
        <section className="py-8 md:py-12 bg-white">
            <div className={HOME_CONTAINER}>
                <div className="flex items-end justify-between gap-4 mb-6 md:mb-10 px-1">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2 md:mb-3">
                            <div className="h-px w-8 bg-[#E91E63]" />
                            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#E91E63] uppercase">
                                Continue exploring
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-playfair font-bold text-gray-900 tracking-tight leading-none">
                            More Collections
                        </h2>
                    </div>

                    <Link
                        href="/collection"
                        className="flex-shrink-0 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-gray-500 hover:text-[#E91E63] transition-colors min-h-11 inline-flex items-center gap-1.5"
                    >
                        View all
                        <span aria-hidden>→</span>
                    </Link>
                </div>

                {/* Mobile: snap carousel · Desktop: 5 equal cards */}
                <div className={`flex md:grid md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory ${HOME_EDGE_SCROLL} pb-1`}>
                    {items.map((item, index) => {
                        const title = item.name || item.label;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group relative shrink-0 w-[42vw] max-w-[200px] sm:w-[200px] md:w-auto md:max-w-none snap-start aspect-[3/4] overflow-hidden rounded-2xl md:rounded-[1.35rem] bg-[#1a1214] ring-1 ring-black/5 shadow-[0_8px_24px_-12px_rgba(26,18,20,0.35)] block"
                            >
                                <Image
                                    src={item.image || "/logo.png"}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 768px) 42vw, 20vw"
                                    quality={index < 2 ? 75 : 65}
                                    priority={index < 2}
                                    placeholder="blur"
                                    blurDataURL={IMAGE_BLUR_DATA_URL}
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 md:p-5 flex flex-col items-start">
                                    <h3 className="font-playfair text-white text-base sm:text-lg md:text-xl font-semibold tracking-tight leading-snug line-clamp-2">
                                        {title}
                                    </h3>
                                    <span className="mt-2 inline-flex flex-col items-start gap-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                                        Explore
                                        <span className="block h-px w-7 bg-white/70 group-hover:w-12 group-hover:bg-[#E91E63] transition-all duration-500" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
