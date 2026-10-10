"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductPath } from "@/lib/seo";
import { getProductDiscountInfo } from "@/lib/discountUtils";
import { getDisplayCategoryName } from "@/lib/categoryLanding";
import { IMAGE_BLUR_DATA_URL, PRODUCT_CARD_SIZES } from "@/lib/imageBlur";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { lowStockCount } from "@/lib/festivalSeason";
import { isRealBestseller } from "@/lib/unitsSold";
import { isProductOutOfStock } from "@/lib/productAvailability";

export default function ProductCard({
    product,
    reviewCount = 0,
    reviewAverage = 0,
    hideCategory = false,
    priority = false,
    sizes = PRODUCT_CARD_SIZES,
    showQuickActions = true,
}) {
    const categoryName = getDisplayCategoryName(product.categories);
    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";
    const { hasDiscount, originalPrice } = getProductDiscountInfo(product);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const wishlisted = isInWishlist(product.id);
    const [hoverReady, setHoverReady] = useState(false);
    const [preloadHover, setPreloadHover] = useState(false);
    const [wishPulse, setWishPulse] = useState(false);
    const [addedToBag, setAddedToBag] = useState(false);
    const href = getProductPath(product);
    const hoverImage = product.hover_image;
    const outOfStock = isProductOutOfStock(product);
    const left = lowStockCount(product);
    const canSwapHover = Boolean(hoverImage && hoverReady);

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

    const handleAddToBag = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (outOfStock) return;
        const added = await addToCart(
            {
                id: product.id,
                name: product.name,
                price: product.price || 0,
                image: product.main_image || product.image || "/logo.png",
                category: categoryName,
                description: product.description || "",
                slug: product.slug,
                stock_count: product.stock_count,
            },
            1
        );
        if (!added) return;
        setAddedToBag(true);
        window.setTimeout(() => setAddedToBag(false), 1600);
    };

    return (
        <article className="group flex flex-col h-full">
            <div
                className="relative overflow-hidden rounded-[1.15rem] bg-[#f3ebe4] aspect-[4/5] w-full ring-1 ring-[#ebe3da] transition duration-300 ease-out group-hover:-translate-y-1 group-active:-translate-y-0.5 group-hover:ring-[#d8cfc3] group-hover:shadow-[0_18px_36px_-22px_rgba(42,39,36,0.45)]"
                onMouseEnter={() => {
                    if (hoverImage) setPreloadHover(true);
                }}
                onTouchStart={() => {
                    if (hoverImage) setPreloadHover(true);
                }}
            >
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
                        className={`object-cover transition-[transform,opacity] duration-500 ease-out will-change-transform group-hover:scale-[1.04] group-active:scale-[1.02] ${
                            canSwapHover ? "md:group-hover:opacity-0" : ""
                        } ${outOfStock ? "opacity-70" : ""}`}
                    />
                    {hoverImage && preloadHover ? (
                        <Image
                            src={hoverImage}
                            alt=""
                            fill
                            sizes={sizes}
                            quality={60}
                            loading="lazy"
                            aria-hidden
                            onLoad={() => setHoverReady(true)}
                            className={`object-cover transition-opacity duration-500 ${
                                canSwapHover
                                    ? "opacity-0 md:group-hover:opacity-100"
                                    : "opacity-0"
                            }`}
                        />
                    ) : null}
                </Link>

                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#2a2724]/20 via-transparent to-transparent opacity-40 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />
                <span
                    className="product-card-accent pointer-events-none absolute bottom-0 left-1/2 z-10 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#b89a6a] to-transparent transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-2/3 group-active:w-1/2"
                    aria-hidden
                />

                <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-start gap-1 pointer-events-none max-w-[75%]">
                    {outOfStock ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#2a2724]/90 text-white text-[9px] font-semibold tracking-[0.08em] uppercase">
                            Out of stock
                        </span>
                    ) : left > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#8a5a28] text-[#f7f1e8] text-[9px] font-semibold tracking-[0.08em] uppercase">
                            Only {left} left
                        </span>
                    ) : hasDiscount ? null : isRealBestseller(product.units_sold) ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#2a2724]/90 text-white text-[9px] font-semibold tracking-[0.08em] uppercase">
                            Bestseller
                        </span>
                    ) : product.is_new ? (
                        <span className="px-2 py-0.5 rounded-full bg-white/95 text-[#2a2724] text-[9px] font-semibold tracking-[0.08em] uppercase">
                            New
                        </span>
                    ) : null}
                </div>

                {showQuickActions && (
                    <button
                        type="button"
                        onClick={handleWishlist}
                        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
                            wishlisted
                                ? "bg-[#E91E63] text-white"
                                : "bg-white/95 text-[#8a847c] hover:text-[#E91E63]"
                        } ${wishPulse ? "scale-110" : ""}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
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

                <div className="hidden md:flex absolute inset-x-2.5 bottom-2.5 z-20 pointer-events-none translate-y-1.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <Link
                        href={href}
                        className={`pointer-events-auto inline-flex items-center justify-center w-full min-h-9 rounded-full text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                            outOfStock
                                ? "bg-[#2a2724]/80 text-white"
                                : "bg-[#2a2724]/92 text-white hover:bg-[#2a2724]"
                        }`}
                    >
                        Quick look
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 flex-col pt-3 px-0.5">
                {!hideCategory && (
                    <p
                        className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-1.5 truncate"
                        style={{ color: "#b89a6a" }}
                    >
                        {categoryName}
                    </p>
                )}

                <Link href={href} className="block active:opacity-70">
                    <h3 className="font-playfair text-[13px] sm:text-[14px] font-medium text-[#2a2724] leading-snug line-clamp-2 min-h-[2.2rem] group-hover:text-[#8a5a28] transition-colors">
                        {product.name}
                    </h3>
                    <span className="product-card-line" aria-hidden />
                </Link>

                <div className="mt-2.5 flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                        <Link
                            href={href}
                            className="text-[14px] sm:text-[15px] font-semibold text-[#2a2724] tabular-nums"
                        >
                            ₹{price}
                        </Link>
                        {hasDiscount && (
                            <span className="text-[11px] text-[#a89880] line-through tabular-nums">
                                ₹
                                {originalPrice.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                })}
                            </span>
                        )}
                    </div>
                    {reviewCount > 0 && (
                        <p className="shrink-0 text-[10px] text-[#a89880] tabular-nums">
                            <span className="text-[#b89a6a]">★</span>{" "}
                            {reviewAverage > 0 ? reviewAverage.toFixed(1) : "—"}
                        </p>
                    )}
                </div>

                {outOfStock ? (
                    <Link
                        href={href}
                        className="mt-3 inline-flex w-full min-h-10 items-center justify-center rounded-full border border-[#e0d8ce] text-[10px] font-semibold tracking-[0.12em] uppercase text-[#6b6560] hover:border-[#b89a6a] hover:text-[#2a2724] transition-colors"
                    >
                        View piece
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={handleAddToBag}
                        className={`mt-3 w-full min-h-10 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase transition-all duration-200 active:scale-[0.98] ${
                            addedToBag
                                ? "bg-[#2a2724] text-white"
                                : "bg-[#2a2724] text-white hover:bg-[#E91E63]"
                        }`}
                    >
                        {addedToBag ? "Added" : "Add to bag"}
                    </button>
                )}
            </div>
        </article>
    );
}
