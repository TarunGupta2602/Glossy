import Link from "next/link";
import Image from "next/image";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export default async function FeaturedCollections() {
    const supabase = getServiceClient();
    // Fetch categories from Supabase
    const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .limit(4);

    if (error || !categories) {
        console.error("Error fetching featured collections:", error);
        return null;
    }

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
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

                {/* Ultra-Clean 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {categories?.map((category) => {
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

                        return (
                            <Link
                                key={category.id}
                                href={`/shop/${category.slug}`}
                                className="group relative block overflow-hidden rounded-[2rem]"
                            >
                                <div className="relative aspect-[16/11] overflow-hidden">
                                    <Image
                                        src={category.image_url || "/placeholder.jpg"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                                    {/* Minimalist Info */}
                                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                                            {displayTitle}
                                        </h3>
                                        <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <span>Explore Selection</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
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
