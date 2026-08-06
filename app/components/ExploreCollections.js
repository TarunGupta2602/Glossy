import Link from "next/link";
import Image from "next/image";
import { getCategoryHref } from "@/lib/categoryLanding";

export default function ExploreCollections({ categories }) {
    if (!categories?.length) return null;

    return (
        <section className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-gray-200/80">
            <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-[#E91E63]" />
                        <span className="text-[10px] font-black tracking-[0.18em] text-[#E91E63] uppercase">
                            Continue Exploring
                        </span>
                    </div>
                    <h2
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        More Collections
                    </h2>
                </div>
                <Link
                    href="/collection"
                    className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#E91E63] transition-colors whitespace-nowrap"
                >
                    View all
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-0.5 transition-transform">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible">
                {categories.slice(0, 4).map((cat) => (
                    <Link
                        key={cat.id}
                        href={getCategoryHref(cat)}
                        className="group flex-shrink-0 w-[200px] sm:w-[220px] md:w-auto"
                    >
                        <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:border-[#E91E63]/30 transition-all duration-300 group-hover:shadow-lg">
                            <Image
                                src={cat.image_url || "/logo.png"}
                                alt={cat.name}
                                fill
                                sizes="(max-width: 768px) 200px, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-4">
                                <p
                                    className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2 drop-shadow-md group-hover:text-[#FF80AB] transition-colors"
                                    style={{ fontFamily: "var(--font-playfair)" }}
                                >
                                    {cat.name}
                                </p>
                                <span className="inline-flex items-center gap-2 mt-2 text-[10px] font-bold text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">
                                    Explore
                                    <span className="h-px w-6 bg-white/40 group-hover:w-10 group-hover:bg-[#E91E63] transition-all duration-300" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
