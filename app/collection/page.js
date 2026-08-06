import Link from "next/link";
import Image from "next/image";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import { getCategoryHref } from "@/lib/categoryLanding";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Featured Jewellery Collections | Curated Luxury Jewellery India",
    description: "Explore curated fine jewellery collections at The Luxe Jewels, featuring anti-tarnish earrings, necklaces, and statement pieces designed for everyday elegance in India.",
    alternates: {
        canonical: "/collection",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Featured Collections | Curated Fine Jewellery",
        description: "Explore our curated collections of fine jewellery. Handcrafted for elegance.",
        url: "https://www.theluxejewels.in/collection",
        siteName: "The Luxe Jewels",
        images: [{ url: "/logo.png" }],
        type: "website",
    },
};

export default async function FeaturedCollections() {
    const supabase = getServiceClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching collections:", error);
        return null;
    }

    return (
        <section className="pb-12 md:pb-16 bg-white">
            <div className="border-b border-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-2.5 md:py-3">
                    <Breadcrumbs items={[{ label: "Collections" }]} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 md:pt-8 pb-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#E91E63] uppercase mb-2 block">
                    Curation
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Featured Collections
                </h1>
                <p className="text-sm text-gray-500 mt-2 max-w-lg">
                    Handpicked edits of anti-tarnish jewellery — explore by style.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {categories?.map((category) => (
                        <Link
                            key={category.id}
                            href={getCategoryHref(category)}
                            className="group relative aspect-[16/10] overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 block border border-gray-100 hover:border-[#E91E63]/20 hover:shadow-lg transition-all duration-300"
                        >
                            <Image
                                src={category.image_url || "/logo.png"}
                                alt={category.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                            <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                                    {category.name}
                                </h2>
                                {category.description && (
                                    <p className="text-sm text-white/75 mt-1 line-clamp-2 max-w-sm">
                                        {category.description}
                                    </p>
                                )}
                                <span className="inline-flex items-center gap-2 mt-3 text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">
                                    Explore
                                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
