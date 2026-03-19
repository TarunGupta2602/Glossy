import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
// Force dynamic rendering to ensure fresh data on every request (SSR)
export const dynamic = "force-dynamic";

export default async function FeaturedCollections() {
    // Fetch categories from bb Supabase
    const { data: categories, error } = await supabase
        .from("categories")
        .select("*")


    if (error) {
        console.error("Error fetching featured collections:", error);
        return null;
    }

    return (
        <section className="py-2 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#E91E63] uppercase mb-2 block">
                            CURATION
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            Featured Collections
                        </h2>
                    </div>

                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-white">
                    {categories?.map((category) => {
                        const isEarrings = category.name.toLowerCase().includes("earring");
                        const isNecklaces = category.name.toLowerCase().includes("necklace");

                        const displayTitle = isEarrings ? "Statement Pieces" :
                            isNecklaces ? "The Necklace Edit" :
                                category.name;

                        const displayDesc = isEarrings ? "Crafted to last a lifetime." :
                            isNecklaces ? "Luminous accents for every style." :
                                category.description || `Explore our ${category.name} collection.`;

                        return (
                            <Link
                                key={category.id}
                                href={`/shop/${category.slug}`}
                                className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-gray-100 block shadow-sm border border-gray-50 transition-all hover:shadow-xl"
                            >
                                {/* Background Image */}
                                <Image
                                    src={category.image_url || "/placeholder.jpg"}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>

                                {/* Content */}
                                <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end">
                                    <h3 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                                        {displayTitle}
                                    </h3>
                                    <p className="text-white/90 font-medium mb-8 max-w-xs transition-opacity [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
                                        {displayDesc}
                                    </p>
                                    <div className="px-7 py-3 bg-white text-gray-900 text-[11px] font-black uppercase tracking-widest rounded-xl w-fit shadow-xl transition-transform group-hover:scale-105">
                                        EXPLORE
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
