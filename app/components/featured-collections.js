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

        return a.name.localeCompare(b.name);
    });

    return (
        <section className="py-20 md:py-32 px-6 md:px-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-24 gap-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-[#E91E63]" />
                            <span className="text-[10px] md:text-[11px] font-black tracking-[0.4em] text-[#E91E63] uppercase">
                                PROPRIETARY CURATION
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-8xl font-playfair font-bold text-gray-900 tracking-tight leading-[0.9] mb-8">
                            Luxe House <br />
                            <span className="text-gray-300 italic">Collections</span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
                            A curated dialogue between tradition and modernity. Explore narratives woven into fine anti-tarnish jewelry.
                        </p>
                    </div>
                    <Link
                        href="/collection"
                        className="group flex items-center gap-4 text-[11px] font-black tracking-[0.3em] uppercase text-gray-900 transition-all self-start md:self-auto"
                    >
                        <span className="relative pb-2">
                            All Collections
                            <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#E91E63] transition-all group-hover:w-full"></span>
                        </span>
                        <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-16">
                    {sortedCategories?.map((category, index) => {

                        const gridClass = index === 0
                            ? "lg:col-span-8 aspect-[4/5] md:aspect-[16/9]"
                            : index === 1
                                ? "lg:col-span-4 aspect-[4/5] lg:aspect-auto"
                                : "md:col-span-6 lg:col-span-4 aspect-[4/5]";

                        return (
                            <Link
                                key={category.id}
                                href={`/shop/${category.slug}`}
                                className={`group relative block overflow-hidden rounded-[2rem] md:rounded-[3rem] transition-all duration-1000 ${gridClass} bg-gray-50 border border-gray-100/50`}
                            >
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={category.image_url || "/placeholder.jpg"}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-all duration-[2s] ease-out group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay - Adaptive for readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 md:opacity-40 group-hover:opacity-80 transition-opacity duration-700" />
                                </div>

                                {/* Content Overlay */}
                                <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-between">
                                    {/* Top Row: Indexing */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-black text-white/60 tracking-[0.4em] uppercase drop-shadow-sm">
                                                Edition 2024
                                            </span>
                                            <span className="text-2xl md:text-3xl font-playfair italic text-white/20 group-hover:text-[#E91E63]/80 transition-colors duration-500">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Info */}
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                        <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-tight mb-4 drop-shadow-lg">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm md:text-base text-white/70 font-medium max-w-xs mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 hidden md:block">
                                            {category.description || 'Defining the contemporary jewelry landscape with intentional design.'}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">
                                                Explore
                                            </span>
                                            <div className="h-[1px] w-12 bg-white/30 group-hover:w-20 group-hover:bg-[#E91E63] transition-all duration-700 rounded-full" />
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

