import Link from "next/link";
import Image from "next/image";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export default async function FeaturedCollections() {
    const supabase = getServiceClient();
    // Fetch categories from Supabase
    const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error || !categories) {
        console.error("Error fetching featured collections:", error);
        return null;
    }

    // Apply custom sorting: Sparkle Jewelry Duo (Second to last), Uniqueness (Last)
    const sortedCategories = [...categories].sort((a, b) => {
        const aSlug = a.slug?.toLowerCase();
        const bSlug = b.slug?.toLowerCase();

        const order = {
            'the-necklace-edit': -1,
            'sparkle-jewelry-duo': 1,
            'uniqueness': 2
        };

        const aOrder = order[aSlug] || 0;
        const bOrder = order[bSlug] || 0;

        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        }

        // Default alphabetical sort for others
        return a.name.localeCompare(b.name);
    });

    return (
    <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-white via-[#f8eaf3] to-[#f3f8fa]">
            <div className="max-w-7xl mx-auto">
                {/* Clean Restored Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-8 bg-[#E91E63]" />
                            <span className="text-[11px] font-black tracking-[0.3em] text-[#E91E63] uppercase">
                                PROPRIETARY CURATION
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-6">
                            Luxe House <br />
                            <span className="text-gray-200">Collections</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium max-w-lg leading-relaxed">
                            Discover our most coveted pieces, meticulously arranged into themed narratives that define the modern aesthetic.
                        </p>
                    </div>
                    <Link
                        href="/collection"
                        className="group flex items-center gap-3 text-[11px] font-black tracking-[0.2em] uppercase text-gray-900 border-b-2 border-gray-100 pb-2 hover:border-[#E91E63] transition-all"
                    >
                        View All Collections
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Enhanced Artistic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    {sortedCategories?.map((category, index) => {
                        const nameLower = category.name.toLowerCase();
                        const isEarrings = nameLower.includes("earring");
                        const isNecklaces = nameLower.includes("necklace");
                        const isBracelets = nameLower.includes("bracelet");
                        const isRings = nameLower.includes("ring");

                        const displayTitle = isEarrings ? "Statement Pieces" :
                            isNecklaces ? "The Necklace Edit" :
                                isBracelets ? "Artisan Cuffs" :
                                    isRings ? "Signature Rings" :
                                        category.name;

                        // Grid Logic: 1st is large, 2nd & 3rd are medium, onwards are standard
                        const gridClass = index === 0
                            ? "md:col-span-8 md:aspect-[16/9]"
                            : index === 1 || index === 2
                                ? "md:col-span-4 md:aspect-[4/5]"
                                : "md:col-span-6 lg:col-span-4 aspect-[16/11]";

                        return (
                            <Link
                                key={category.id}
                                href={`/shop/${category.slug}`}
                                className={`group relative block overflow-hidden rounded-[2.5rem] border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-700 ${gridClass} bg-white/30 backdrop-blur-[6px] hover:bg-white/60`}
                                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
                            >
                                {/* Floating Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="inline-block px-4 py-1 rounded-full bg-white/80 text-[#E91E63] text-xs font-bold shadow-md backdrop-blur-sm border border-[#E91E63]/10">
                                        {displayTitle}
                                    </span>
                                </div>
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={category.image_url || "/placeholder.jpg"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:blur-[1.5px]"
                                    />
                                    {/* Glassmorphism Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#e91e63]/60 via-white/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 group-hover:to-black/80 transition-all duration-700" />
                                </div>

                                {/* Content Layer */}
                                <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-end">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-2">
                                            <span className="w-10 h-[2px] bg-[#E91E63]/70 group-hover:w-16 group-hover:bg-[#E91E63] transition-all duration-500 rounded-full" />
                                            <span className="text-[11px] font-black text-white/80 tracking-[0.2em] uppercase drop-shadow">
                                                Col. 0{index + 1}
                                            </span>
                                        </div>
                                        <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 backdrop-blur-md bg-[#E91E63]/80 shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14m-7-7 7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-3 drop-shadow-xl">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/80 text-xs md:text-sm font-medium max-w-xs mb-2 drop-shadow">
                                            {category.description || 'Explore our curated selection.'}
                                        </p>
                                        <div className="flex items-center gap-3 overflow-hidden mt-2">
                                            <span className="text-white/90 text-[11px] font-black tracking-[0.3em] uppercase">
                                                Discover Selection
                                            </span>
                                            <div className="h-[2px] w-0 bg-[#E91E63] group-hover:w-16 transition-all duration-700 delay-100 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
