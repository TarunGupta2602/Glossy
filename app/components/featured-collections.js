"use client";

import { HOME_CONTAINER } from "@/lib/siteLayout";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function FeaturedCollections({ categories }) {
    const [currentIdx, setCurrentIdx] = useState(0);

    const sortedCategories = [...categories].sort((a, b) => {
        const aSlug = a.slug?.toLowerCase();
        const bSlug = b.slug?.toLowerCase();

        const order = {
            'the-necklace-edit': -1,
            'sparkle-jewellery-duo': 1,
            'uniqueness': 2
        };

        const aOrder = order[aSlug] || 0;
        const bOrder = order[bSlug] || 0;

        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        }

        return a.name.localeCompare(b.name);
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx((prevIdx) => (prevIdx + 1) % sortedCategories.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sortedCategories.length]);

    const goToSlide = (idx) => {
        setCurrentIdx(idx);
    };

    const nextSlide = () => {
        setCurrentIdx((prevIdx) => (prevIdx + 1) % sortedCategories.length);
    };

    const prevSlide = () => {
        setCurrentIdx((prevIdx) => (prevIdx - 1 + sortedCategories.length) % sortedCategories.length);
    };

    if (!sortedCategories || sortedCategories.length === 0) {
        return (
            <section className="py-20 md:py-32 bg-white overflow-hidden">
                <div className={HOME_CONTAINER}>
                    <div className="text-center text-gray-500">
                        No collections available at the moment.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <div className={HOME_CONTAINER}>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-4 md:gap-6">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="h-[1px] w-8 md:w-12 bg-[#E91E63]" />
                            <span className="text-[10px] md:text-[11px] font-black tracking-wider text-[#E91E63] uppercase">
                                PROPRIETARY CURATION
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-gray-900 tracking-tight leading-[0.95] mb-3 md:mb-6">
                            Luxe House <br />
                            <span className="text-gray-300 italic">Collections</span>
                        </h2>
                        <p className="text-sm md:text-base text-gray-500 font-medium max-w-xl leading-relaxed">
                            A curated dialogue between tradition and modernity. Explore narratives woven into fine anti-tarnish jewellery.
                        </p>
                    </div>
                    <Link
                        href="/collection"
                        className="group flex items-center gap-4 text-[11px] font-black tracking-wide uppercase text-gray-900 transition-all self-start md:self-auto"
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

                <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9]">
                    {sortedCategories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/shop/${category.slug}`}
                            className={`absolute inset-0 block overflow-hidden rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] transition-all duration-1000 ${index === currentIdx ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={category.image_url || category.image || "/logo.png"}
                                    alt={category.name}
                                    fill
                                    sizes="100vw"
                                    className="object-cover transition-all duration-[2s] ease-out"
                                    priority={index === 0}
                                    quality={75}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    onError={(e) => {
                                        e.target.src = "/logo.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/30 sm:to-transparent" />
                            </div>

                            <div className="relative z-10 h-full p-5 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-end sm:justify-center pb-14 sm:pb-8">
                                <div className="max-w-2xl pr-0 sm:pr-16">
                                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
                                        <span className="text-[9px] md:text-[10px] font-black text-white/60 tracking-[0.3em] md:tracking-[0.4em] uppercase drop-shadow-sm">
                                            Edition 2026
                                        </span>
                                        <span className="text-xl md:text-3xl font-playfair italic text-white/30">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white tracking-tight mb-2 md:mb-4 drop-shadow-lg line-clamp-2">
                                        {category.name}
                                    </h3>

                                    <p className="hidden sm:block text-sm md:text-base text-white/80 font-medium max-w-lg mb-6 leading-relaxed line-clamp-2">
                                        {category.description || 'Defining the contemporary jewellery landscape with intentional design.'}
                                    </p>

                                    <div className="flex items-center gap-3 md:gap-4">
                                        <span className="text-[10px] font-black text-white tracking-[0.25em] md:tracking-[0.3em] uppercase">
                                            Explore Collection
                                        </span>
                                        <div className="h-[1px] w-10 md:w-16 bg-white/30 group-hover:w-24 group-hover:bg-[#E91E63] transition-all duration-700 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6 transform group-hover:-translate-x-1 transition-transform">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
                        {sortedCategories.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${idx === currentIdx ? "w-8 sm:w-12 bg-[#E91E63]" : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/50"}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
