import Image from "next/image";

export default function CollectionHero({ imageUrl, alt, title, description, count, showingCount }) {
    if (!imageUrl) {
        return (
            <div className="border-b border-gray-100 bg-gradient-to-br from-[#FFF5F8] via-white to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-10">
                    <span className="text-[10px] font-black tracking-[0.2em] text-[#E91E63] uppercase mb-2 block">
                        Collection
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl leading-relaxed">
                            {description}
                        </p>
                    )}
                    {count > 0 && (
                        <p className="text-xs sm:text-sm text-gray-400 mt-3 font-medium">
                            {showingCount ?? count} of {count} piece{count === 1 ? "" : "s"}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-44 sm:h-52 md:h-60 overflow-hidden bg-gray-900">
            <Image
                src={imageUrl}
                alt={alt || title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 pb-5 md:pb-7">
                    <span className="text-[10px] font-black tracking-[0.2em] text-[#FF80AB] uppercase mb-1.5 block">
                        Collection
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-white tracking-tight leading-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-white/75 mt-1.5 max-w-lg leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}
                    {count > 0 && (
                        <p className="text-[11px] sm:text-xs text-white/50 mt-2 font-medium">
                            {showingCount ?? count} of {count} piece{count === 1 ? "" : "s"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
