"use client";

import { useState } from "react";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import Image from "next/image";
import { getCategoryHref } from "@/lib/categoryLanding";
import { getProductPath } from "@/lib/seo";

export default function FeaturedCollections({
    categories = [],
    featuredProducts = [],
    fallbackImage = "/iloveimg-resized/hero3.png",
}) {
    const sorted = [...categories].sort((a, b) => {
        const order = {
            "the-necklace-edit": -1,
            "sparkle-jewelry-duo": 1,
            "sparkle-jewellery-duo": 1,
            uniqueness: 2,
            "uniqueness-rings": 2,
        };
        const aOrder = order[a.slug?.toLowerCase()] ?? 0;
        const bOrder = order[b.slug?.toLowerCase()] ?? 0;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return (a.name || "").localeCompare(b.name || "");
    });

    const featured = sorted[0];
    const initialImage = featured?.image_url || featured?.image || fallbackImage;
    const [bannerSrc, setBannerSrc] = useState(initialImage);

    if (!featured) {
        return null;
    }

    const href = getCategoryHref(featured);
    const products = (featuredProducts || []).slice(0, 3);

    return (
        <section className="py-8 md:py-16 bg-white overflow-hidden">
            <div className={HOME_CONTAINER}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 items-stretch">
                    {/* Copy first on mobile so the section isn't just a tall image */}
                    <div className="flex flex-col justify-center order-1 lg:order-2">
                        <div className="flex items-center gap-3 mb-2.5 md:mb-3">
                            <div className="h-px w-8 bg-[#E91E63]" />
                            <span className="text-[10px] font-black tracking-wider text-[#E91E63] uppercase">
                                Featured collection
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-bold text-gray-900 tracking-tight leading-[0.95] mb-2.5 md:mb-3">
                            {featured.name}
                        </h2>

                        <p className="text-sm md:text-base text-gray-500 font-medium max-w-md leading-relaxed mb-4 md:mb-6">
                            {featured.description ||
                                "A curated edit of anti-tarnish jewellery designed for everyday luxury."}
                        </p>

                        <Link
                            href={href}
                            className="inline-flex self-start items-center gap-2 mb-5 md:mb-8 min-h-11 text-[11px] font-black tracking-[0.18em] uppercase text-gray-900"
                        >
                            Shop the edit
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </Link>

                        {products.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={getProductPath(product)}
                                        className="group block"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-[#f7f4f2] mb-1.5 sm:mb-2">
                                            <Image
                                                src={product.main_image || "/logo.png"}
                                                alt={product.image_alt || product.name}
                                                fill
                                                sizes="(max-width: 1024px) 30vw, 12vw"
                                                quality={70}
                                                className="object-cover transition-transform duration-500 group-active:scale-105 sm:group-hover:scale-105"
                                            />
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                                            {product.name}
                                        </p>
                                        {product.price != null && (
                                            <p className="text-[10px] sm:text-[11px] text-gray-600 mt-0.5">
                                                ₹
                                                {Number(product.price).toLocaleString(undefined, {
                                                    maximumFractionDigits: 0,
                                                })}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href={href}
                        className="group relative block order-2 lg:order-1 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[480px] overflow-hidden bg-[#1a1214]"
                    >
                        <Image
                            src={bannerSrc}
                            alt={featured.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-[1.2s] ease-out group-active:scale-105 sm:group-hover:scale-105"
                            priority
                            quality={80}
                            onError={() => {
                                if (bannerSrc !== fallbackImage) setBannerSrc(fallbackImage);
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-7">
                            <span className="inline-flex items-center gap-3 text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase text-white">
                                Explore collection
                                <span className="h-px w-8 sm:w-10 bg-white/50 group-hover:w-16 group-hover:bg-[#E91E63] transition-all duration-500" />
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
