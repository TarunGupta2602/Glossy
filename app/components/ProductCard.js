"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductPath } from "@/lib/seo";
import { getProductDiscountInfo } from "@/lib/discountUtils";
import { IMAGE_BLUR_DATA_URL, PRODUCT_CARD_SIZES } from "@/lib/imageBlur";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

function productHashtag(product) {
    const source = product.slug || product.name || "jewellery";
    const tag = String(source)
        .replace(/[^a-zA-Z0-9]+/g, "")
        .slice(0, 16)
        .toUpperCase();
    return tag ? `#${tag}` : "#JEWELLERY";
}

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
    const [wishPulse, setWishPulse] = useState(false);
    const href = getProductPath(product);
    const hoverImage = product.hover_image;
    const hashtag = productHashtag(product);

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
        <article className="group flex flex-col h-full overflow-hidden rounded-[1.35rem] sm:rounded-[1.5rem] bg-white shadow-[0_8px_30px_-18px_rgba(42,39,36,0.35)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[0_14px_36px_-16px_rgba(42,39,36,0.4)]">
            <div className="relative overflow-hidden bg-[#f4f2f0] aspect-square w-full">
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

                <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none max-w-[75%]">
                    <span className="px-2 py-1 rounded-md bg-white text-[9px] font-semibold tracking-[0.06em] text-[#2a2724] uppercase truncate max-w-full">
                        {hashtag}
                    </span>
                    {hasDiscount && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E91E63] text-white text-[10px] font-bold tracking-wide">
                            −{discountPercent}%
                        </span>
                    )}
                    {!hasDiscount && product.is_bestseller && (
                        <span className="px-2 py-0.5 rounded-full bg-[#2a2724] text-white text-[9px] font-semibold tracking-wide">
                            Bestseller
                        </span>
                    )}
                    {!hasDiscount && product.is_new && !product.is_bestseller && (
                        <span className="px-2 py-0.5 rounded-full bg-white text-[#2a2724] text-[9px] font-semibold tracking-wide ring-1 ring-black/5">
                            New
                        </span>
                    )}
                </div>

                {showQuickActions && (
                    <button
                        type="button"
                        onClick={handleWishlist}
                        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
                            wishlisted
                                ? "bg-[#E91E63] text-white"
                                : "bg-white text-gray-500 hover:text-[#E91E63]"
                        } ${wishPulse ? "scale-110" : ""}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
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

                <div className="hidden md:flex absolute inset-x-3 bottom-3 z-20 pointer-events-none translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <Link
                        href={href}
                        className="pointer-events-auto inline-flex items-center justify-center gap-2 w-full min-h-10 rounded-xl bg-[#2a2724]/88 text-[10px] font-semibold tracking-[0.14em] uppercase text-white backdrop-blur-sm hover:bg-[#2a2724] transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M6 6h15l-1.5 9h-12z" />
                            <circle cx="9" cy="20" r="1" />
                            <circle cx="18" cy="20" r="1" />
                            <path d="M6 6 5 3H2" />
                        </svg>
                        Quick view
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-3.5 sm:px-4 pt-3.5 pb-4">
                {!hideCategory && (
                    <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-gray-400 mb-1 truncate">
                        {categoryName}
                    </p>
                )}

                <Link href={href} className="block active:opacity-70">
                    <h3 className="font-playfair text-[15px] sm:text-[16px] font-medium text-[#2a2724] leading-snug line-clamp-2 min-h-[2.4rem] group-hover:text-[#E91E63] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-2.5 flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                        <Link
                            href={href}
                            className="text-[15px] font-bold text-[#2a2724] tabular-nums"
                        >
                            ₹{price}
                        </Link>
                        {hasDiscount && (
                            <span className="text-[12px] text-gray-400 line-through tabular-nums">
                                ₹
                                {originalPrice.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                })}
                            </span>
                        )}
                    </div>
                    {hasDiscount && (
                        <span
                            className="shrink-0 text-[11px] font-semibold tabular-nums"
                            style={{ color: "#b59e7b" }}
                        >
                            {discountPercent}% off
                        </span>
                    )}
                </div>

                {reviewCount > 0 && (
                    <p className="mt-1.5 text-[11px] text-gray-400">
                        <span className="text-amber-500">★</span> {reviewCount}
                    </p>
                )}
            </div>
        </article>
    );
}
