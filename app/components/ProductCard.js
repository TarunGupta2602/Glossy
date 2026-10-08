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
    const [loadHover, setLoadHover] = useState(false);
    const [wishPulse, setWishPulse] = useState(false);
    const [addedToBag, setAddedToBag] = useState(false);
    const href = getProductPath(product);
    const hoverImage = product.hover_image;
    const outOfStock = isProductOutOfStock(product);
    const left = lowStockCount(product);

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
        <article className="group flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-[1.5rem] bg-white shadow-[0_8px_30px_-18px_rgba(42,39,36,0.35)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[0_14px_36px_-16px_rgba(42,39,36,0.4)]">
            <div
                className="relative overflow-hidden bg-[#f4f2f0] aspect-square w-full"
                onMouseEnter={() => {
                    if (hoverImage) setLoadHover(true);
                }}
            >
                <Link href={href} className="absolute inset-0 z-0 block" aria-label={product.name}>
                    <Image
                        src={product.main_image || "/logo.png"}
                        alt={product.image_alt || product.name}
                        fill
                        sizes={sizes}
                        quality={priority ? 70 : 55}
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className={`object-cover transition-[transform,opacity] duration-[700ms] ease-out will-change-transform md:group-hover:scale-[1.03] ${
                            hoverImage ? "md:group-hover:opacity-0" : ""
                        } ${outOfStock ? "opacity-70" : ""}`}
                    />
                    {hoverImage && loadHover && (
                        <Image
                            src={hoverImage}
                            alt=""
                            fill
                            sizes={sizes}
                            quality={55}
                            loading="lazy"
                            aria-hidden
                            className="object-cover opacity-0 transition-opacity duration-500 md:group-hover:opacity-100"
                        />
                    )}
                </Link>

                <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none max-w-[75%]">
                    {outOfStock ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#2a2724] text-white text-[9px] font-semibold tracking-wide">
                            Out of stock
                        </span>
                    ) : left > 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#8a5a28] text-[#f7f1e8] text-[9px] font-semibold tracking-wide">
                            Only {left} left
                        </span>
                    ) : hasDiscount ? null : isRealBestseller(product.units_sold) ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#2a2724] text-white text-[9px] font-semibold tracking-wide">
                            Bestseller
                        </span>
                    ) : product.is_new ? (
                        <span className="px-2.5 py-1 rounded-full bg-white text-[#2a2724] text-[9px] font-semibold tracking-wide ring-1 ring-black/5">
                            New
                        </span>
                    ) : null}
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
                        className={`pointer-events-auto inline-flex items-center justify-center gap-2 w-full min-h-10 rounded-xl text-[10px] font-semibold tracking-[0.14em] uppercase backdrop-blur-sm transition-colors ${
                            outOfStock
                                ? "bg-[#efeae4] text-[#6b6560]"
                                : "bg-[#2a2724]/88 text-white hover:bg-[#2a2724]"
                        }`}
                    >
                        {outOfStock ? "Out of stock" : "View"}
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-2.5 sm:px-4 pt-2.5 sm:pt-3.5 pb-3 sm:pb-4">
                {!hideCategory && (
                    <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-gray-400 mb-1 truncate">
                        {categoryName}
                    </p>
                )}

                <Link href={href} className="block active:opacity-70">
                    <h3 className="font-playfair text-[13px] sm:text-[16px] font-medium text-[#2a2724] leading-snug line-clamp-2 min-h-[2.15rem] sm:min-h-[2.4rem] group-hover:text-[#E91E63] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {outOfStock && (
                    <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a847c]">
                        Out of stock
                    </p>
                )}

                <div className="mt-2.5 flex items-baseline gap-2 min-w-0 flex-wrap">
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

                {reviewCount > 0 && (
                    <p className="mt-1.5 text-[11px] text-gray-400 tabular-nums">
                        <span className="text-amber-500">★</span>{" "}
                        {reviewAverage > 0 ? reviewAverage.toFixed(1) : "—"} ({reviewCount})
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={outOfStock}
                    className={`mt-2.5 sm:mt-3 w-full min-h-9 sm:min-h-10 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.1em] sm:tracking-[0.12em] uppercase transition-colors ${
                        outOfStock
                            ? "bg-[#efeae4] text-[#8a847c] cursor-not-allowed"
                            : addedToBag
                              ? "bg-[#2a2724] text-white"
                              : "bg-[#E91E63] text-white active:bg-[#C2185B]"
                    }`}
                >
                    {outOfStock ? "Out of stock" : addedToBag ? "Added" : "Add to bag"}
                </button>
            </div>
        </article>
    );
}
