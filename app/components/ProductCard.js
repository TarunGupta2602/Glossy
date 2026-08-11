"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductPath } from "@/lib/seo";
import { getProductDiscountInfo } from "@/lib/discountUtils";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({
    product,
    reviewCount = 0,
    hideCategory = false,
    priority = false,
    sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
    showQuickActions = true,
}) {
    const categoryName = product.categories?.name || "Jewellery";
    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";
    const { hasDiscount, originalPrice, discountPercent } = getProductDiscountInfo(product);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id);
    const [added, setAdded] = useState(false);
    const [adding, setAdding] = useState(false);

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(product);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (adding) return;
        setAdding(true);
        try {
            await addToCart(product, 1);
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="group flex flex-col h-full">
            <div className="relative overflow-hidden rounded-lg sm:rounded-2xl border border-gray-100 shadow-sm sm:shadow-lg hover:shadow-2xl bg-white aspect-square w-full transition-all duration-700">
                <Link
                    href={getProductPath(product)}
                    className="absolute inset-0 z-0 block"
                    aria-label={product.name}
                >
                    <Image
                        src={product.main_image || "/logo.png"}
                        alt={product.image_alt || product.name}
                        fill
                        sizes={sizes}
                        quality={priority ? 75 : 65}
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-white/5 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                </Link>

                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex flex-col gap-1.5 sm:gap-2 pointer-events-none">
                    {product.is_bestseller && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-[8px] sm:text-[10px] font-black shadow-[0_4px_10px_rgba(251,191,36,0.5)] border border-white/20 uppercase tracking-[0.05em] leading-none">
                            BEST SELLER
                        </span>
                    )}
                    {product.is_new && (
                        <span className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white text-gray-900 text-[8px] sm:text-[10px] font-bold shadow-md border border-gray-100 uppercase tracking-widest leading-none">
                            New
                        </span>
                    )}
                </div>

                {showQuickActions && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30">
                        <button
                            type="button"
                            onClick={handleWishlist}
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                wishlisted
                                    ? "bg-[#E91E63] border-[#E91E63] text-white"
                                    : "bg-white/95 border-gray-100 text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63]"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={wishlisted ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-stretch gap-2 p-1.5 sm:p-3 translate-y-0 opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-400">
                    {showQuickActions ? (
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={adding}
                            className="w-full bg-white/95 text-gray-900 text-[9px] sm:text-[11px] font-bold tracking-[0.1em] uppercase px-2 sm:px-3 py-2 sm:py-2.5 min-h-9 sm:min-h-10 rounded-full shadow border border-gray-200 backdrop-blur-sm active:bg-gray-900 active:text-white md:hover:bg-gray-900 md:hover:text-white transition-colors duration-200 disabled:opacity-60"
                        >
                            {added ? "Added" : adding ? "Adding…" : "Add to bag"}
                        </button>
                    ) : (
                        <Link
                            href={getProductPath(product)}
                            className="w-full text-center bg-white/95 text-gray-900 text-[9px] sm:text-[11px] font-bold tracking-[0.1em] uppercase px-2 sm:px-3 py-2 sm:py-2.5 min-h-9 rounded-full shadow border border-gray-200 backdrop-blur-sm"
                        >
                            View
                        </Link>
                    )}
                </div>
            </div>

            <div className="mt-2 sm:mt-4 flex flex-col gap-0.5 sm:gap-1 px-0.5 sm:px-1">
                {!hideCategory && (
                    <span className="text-[8px] sm:text-[10px] font-semibold tracking-wide text-gray-600 uppercase truncate">
                        {categoryName}
                    </span>
                )}

                <Link href={getProductPath(product)}>
                    <h3 className={`text-[12px] sm:text-[15px] font-black text-gray-900 leading-snug transition-colors duration-200 line-clamp-2 ${hideCategory ? "min-h-[2.4rem] sm:min-h-11" : "min-h-[2.2rem] sm:min-h-10"}`}>
                        {product.name}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                    <p className="text-[13px] sm:text-[15px] font-bold text-gray-900">
                        ₹{price}
                    </p>
                    {hasDiscount && (
                        <>
                            <p className="text-[10px] sm:text-[11px] text-gray-500 line-through">
                                ₹{originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-[10px] sm:text-[11px] font-bold text-green-700">
                                -{discountPercent}%
                            </p>
                        </>
                    )}
                </div>
                {reviewCount > 0 && (
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1">
                        ★ {reviewCount}
                    </p>
                )}
            </div>
        </div>
    );
}
