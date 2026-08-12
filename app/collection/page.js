import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import Image from "next/image";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import { getCategoryHref } from "@/lib/categoryLanding";

export const revalidate = 3600;

export const metadata = {
    title: "Browse Jewellery by Category | Earrings, Necklaces & More",
    description:
        "Explore The Luxe Jewels by category — curated edits of anti-tarnish earrings, necklaces, bracelets, and rings. Pick a collection, then shop waterproof everyday luxury for India.",
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
        title: "Browse by Category | Jewellery Collections",
        description:
            "Choose a curated jewellery category — earrings, necklaces, bracelets, and more — then shop anti-tarnish pieces made for daily wear.",
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
        .select("id, name, slug, image_url, description")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching collections:", error);
        return null;
    }

    return (
        <section className="pb-12 md:pb-16 bg-white">
            <div className="border-b border-gray-50">
                <div className={`${SITE_CONTAINER} py-2.5 md:py-3`}>
                    <Breadcrumbs items={[{ label: "Collections" }]} />
                </div>
            </div>

            <div className={`${SITE_CONTAINER} pt-6 md:pt-8 pb-2`}>
                <span className="text-[10px] font-black tracking-[0.2em] text-[#E91E63] uppercase mb-2 block">
                    Shop by category
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    Browse jewellery by category
                </h1>
                <p className="text-sm text-gray-500 mt-2 max-w-lg">
                    Start with earrings, necklaces, bracelets, or rings — then explore the full
                    anti-tarnish edit inside each collection.
                </p>
            </div>

            <div className={`${SITE_CONTAINER} pb-4`}>
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
