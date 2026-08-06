import Link from "next/link";
import Image from "next/image";
import { getCategoryHref } from "@/lib/categoryLanding";

export default function ExploreCollections({ categories }) {
    if (!categories?.length) return null;

    return (
        <section className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-gray-100">
            <div className="flex items-end justify-between gap-4 mb-5 md:mb-6">
                <div>
                    <span className="text-[10px] font-black tracking-[0.18em] text-[#E91E63] uppercase mb-1 block">
                        Continue Exploring
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                        More Collections
                    </h2>
                </div>
                <Link
                    href="/collection"
                    className="text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#E91E63] transition-colors whitespace-nowrap"
                >
                    View all →
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4 md:overflow-visible">
                {categories.slice(0, 4).map((cat) => (
                    <Link
                        key={cat.id}
                        href={getCategoryHref(cat)}
                        className="group flex-shrink-0 w-[140px] sm:w-[160px] md:w-auto flex flex-col"
                    >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:border-[#E91E63]/30 transition-colors">
                            <Image
                                src={cat.image_url || "/logo.png"}
                                alt={cat.name}
                                fill
                                sizes="(max-width: 768px) 140px, 200px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <p className="mt-2 text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E91E63] transition-colors line-clamp-2 leading-snug">
                            {cat.name}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
