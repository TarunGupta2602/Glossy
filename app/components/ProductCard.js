"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductPath } from "@/lib/seo";
import { getProductDiscountInfo } from "@/lib/discountUtils";
import { IMAGE_BLUR_DATA_URL, PRODUCT_CARD_SIZES } from "@/lib/imageBlur";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import QuickLookModal from "./QuickLookModal";

export default function ProductCard({
    product,
    reviewCount = 0,
    hideCategory = false,
    priority = false,
    sizes = PRODUCT_CARD_SIZES,
    showQuickActions = true,
}) {
    const categoryName = product.categories?.name || "Jewellery";
    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";
    const { hasDiscount, originalPrice, discountPercent } = getProductDiscountInfo(product);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const wishlisted = isInWishlist(product.id);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [quickOpen, setQuickOpen] = useState(false);
    const [wishPulse, setWishPulse] = useState(false);
    const href = getProductPath(product);
    const hoverImage = product.hover_image;

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wasIn = wishlisted;
        await toggleWishlist(product);
        setWishPulse(true);
        window.setTimeout(() => setWishPulse(false), 450);
        showToast(wasIn ? "Removed from wishlist" : "Saved to wishlist", {
            href: "/wishlist",
            hrefLabel: "View",
            tone: "pink",
        });
    };

    return (
        <>
            <article className="group flex flex-col h-full">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-[1.35rem] bg-[#f3ebe4] aspect-[4/5] w-full shadow-[0_1px_0_rgba(26,18,20,0.04)] ring-1 ring-black/[0.04]">
                    <Link href={href} className="absolute inset-0 z-0 block" aria-label={product.name}>
                        <Image
                            src={product.main_image || "/logo.png"}
                            alt={product.image_alt || product.name}
                            fill
                            sizes={sizes}
                            quality={priority ? 75 : 60}
                            priority={priority}
                            loading={priority ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            onLoad={() => setImgLoaded(true)}
                            className={`object-cover transition-[transform,opacity] duration-[700ms] ease-out will-change-transform md:group-hover:scale-[1.03] ${
                                imgLoaded ? "opacity-100" : "opacity-0"
                            } ${hoverImage ? "md:group-hover:opacity-0" : ""}`}
                        />
                        {hoverImage && (
                            <Image
                                src={hoverImage}
                                alt=""
                                fill
                                sizes={sizes}
                                quality={60}
                                loading="lazy"
                                aria-hidden
                                className="object-cover opacity-0 transition-opacity duration-500 md:group-hover:opacity-100"
                            />
                        )}
                    </Link>

                    <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none max-w-[70%]">
                        {product.is_bestseller && (
                            <span className="px-2.5 py-1 rounded-full bg-[#1a1214]/88 text-white text-[9px] font-semibold uppercase tracking-[0.1em] backdrop-blur-sm">
                                Bestseller
                            </span>
                        )}
                        {product.is_new && !product.is_bestseller && (
                            <span className="px-2.5 py-1 rounded-full bg-white/95 text-gray-900 text-[9px] font-semibold uppercase tracking-[0.1em] shadow-sm">
                                New
                            </span>
                        )}
                        {hasDiscount && (
                            <span className="px-2.5 py-1 rounded-full bg-[#E91E63] text-white text-[9px] font-semibold uppercase tracking-[0.1em] shadow-sm">
                                {discountPercent}% off
                            </span>
                        )}
                    </div>

                    {showQuickActions && (
                        <button
                            type="button"
                            onClick={handleWishlist}
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            className={`absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${
                                wishlisted
                                    ? "bg-[#E91E63] text-white"
                                    : "bg-white/95 text-gray-600 hover:text-[#E91E63] backdrop-blur-sm"
                            } ${wishPulse ? "scale-110" : ""}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={wishlisted ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                    )}

                    <div className="absolute inset-x-0 bottom-0 z-20 p-2.5 sm:p-3 flex flex-col gap-2 pointer-events-none md:translate-y-1 md:opacity-0 md:transition-all md:duration-300 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuickOpen(true);
                            }}
                            className="pointer-events-auto md:hidden inline-flex items-center justify-center w-full min-h-9 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-800 border border-white/50 shadow-sm active:scale-[0.98]"
                        >
                            Quick look
                        </button>
                        <Link
                            href={href}
                            className="pointer-events-auto inline-flex items-center justify-center gap-2 w-full min-h-10 sm:min-h-11 rounded-full border border-white/40 bg-white/95 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-900 shadow-sm transition-all duration-250 active:scale-[0.98] hover:border-[#E91E63] hover:bg-[#E91E63] hover:text-white"
                        >
                            View product
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="mt-3.5 sm:mt-4 flex flex-1 flex-col">
                    {!hideCategory && (
                        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-gray-400 mb-1 truncate">
                            {categoryName}
                        </p>
                    )}

                    <Link href={href} className="block">
                        <h3 className="font-playfair text-[15px] sm:text-[16.5px] font-medium text-gray-900 leading-[1.35] line-clamp-2 min-h-[2.55rem] sm:min-h-[2.7rem] transition-colors duration-200 group-hover:text-[#E91E63]">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-[15px] sm:text-[16px] font-semibold text-gray-900 tracking-tight tabular-nums">
                            ₹{price}
                        </span>
                        {hasDiscount && (
                            <span className="text-[12px] text-gray-400 line-through tabular-nums">
                                ₹
                                {originalPrice.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                })}
                            </span>
                        )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {reviewCount > 0 && (
                            <span className="text-[11px] text-amber-600 font-medium tracking-wide">
                                ★ {reviewCount}
                            </span>
                        )}
                        <span className="text-[10px] text-gray-400 tracking-wide">
                            Anti-tarnish · Waterproof
                        </span>
                    </div>
                </div>
            </article>

            {quickOpen && (
                <QuickLookModal
                    product={product}
                    reviewCount={reviewCount}
                    onClose={() => setQuickOpen(false)}
                />
            )}
        </>
    );
}
