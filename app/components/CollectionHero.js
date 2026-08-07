import Image from "next/image";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import Breadcrumbs from "./Breadcrumbs";

export default function CollectionHero({
    imageUrl,
    alt,
    title,
    description,
    count,
    showingCount,
    breadcrumbs,
}) {
    const pieceLabel =
        count > 0
            ? `${showingCount ?? count} piece${(showingCount ?? count) === 1 ? "" : "s"}`
            : null;

    if (!imageUrl) {
        return (
            <div className="border-b border-gray-100 bg-gradient-to-br from-[#FFF5F8] via-white to-white">
                <div className={`${SITE_CONTAINER} py-6 md:py-8`}>
                    {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-4" />}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-10 bg-[#E91E63]" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#E91E63] uppercase">
                            Collection
                        </span>
                    </div>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl leading-relaxed">
                            {description}
                        </p>
                    )}
                    {pieceLabel && (
                        <span className="inline-block mt-4 px-3 py-1 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-600 tracking-wide">
                            {pieceLabel}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="relative w-full aspect-[4/5] min-h-[320px] sm:aspect-[16/10] sm:min-h-0 md:aspect-[21/9] max-h-[480px] overflow-hidden bg-gray-900">
                <Image
                    src={imageUrl}
                    alt={alt || title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-black/10" />
                <div className="absolute inset-0 hidden sm:block bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                <div className="absolute inset-0 flex flex-col">
                    {breadcrumbs && (
                        <div className={`${SITE_CONTAINER} w-full pt-4 md:pt-5`}>
                            <Breadcrumbs items={breadcrumbs} variant="light" />
                        </div>
                    )}

                    <div className="flex-1 flex items-end md:items-center">
                        <div className={`${SITE_CONTAINER} w-full pb-7 sm:pb-8 md:pb-0 md:py-10`}>
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-3 mb-2 md:mb-4">
                                    <div className="h-px w-8 md:w-10 bg-[#FF80AB]" />
                                    <span className="text-[10px] font-black tracking-[0.25em] text-[#FF80AB] uppercase">
                                        Collection
                                    </span>
                                </div>
                                <h1
                                    className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.05] drop-shadow-lg"
                                    style={{ fontFamily: "var(--font-playfair)" }}
                                >
                                    {title}
                                </h1>
                                {description && (
                                    <p className="hidden sm:block text-sm md:text-base text-white/75 mt-3 max-w-lg leading-relaxed line-clamp-2 md:line-clamp-3">
                                        {description}
                                    </p>
                                )}
                                {pieceLabel && (
                                    <span className="inline-block mt-3 md:mt-5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[11px] font-semibold text-white/90 tracking-wide">
                                        {pieceLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {description && (
                <div className={`${SITE_CONTAINER} sm:hidden py-4 border-b border-gray-100`}>
                    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
            )}
        </>
    );
}
