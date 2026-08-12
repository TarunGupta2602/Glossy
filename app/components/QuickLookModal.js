"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { getProductPath } from "@/lib/seo";
import { getProductDiscountInfo } from "@/lib/discountUtils";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOverlayOpen } from "../context/OverlayContext";

export default function QuickLookModal({ product, reviewCount = 0, onClose }) {
    const { addToCart, openCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useToast();
    const wishlisted = product ? isInWishlist(product.id) : false;
    const { hasDiscount, originalPrice, discountPercent } = product
        ? getProductDiscountInfo(product)
        : { hasDiscount: false, originalPrice: 0, discountPercent: 0 };

    useBodyScrollLock(Boolean(product));
    useOverlayOpen(Boolean(product));

    useEffect(() => {
        if (!product) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [product, onClose]);

    if (!product) return null;

    const href = getProductPath(product);
    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";

    const handleAdd = async () => {
        await addToCart(product, 1);
        showToast("Added to bag", { href: "/cart", hrefLabel: "Bag", tone: "pink" });
        onClose();
        openCart();
    };

    const handleWish = async () => {
        const wasIn = wishlisted;
        await toggleWishlist(product);
        showToast(wasIn ? "Removed from wishlist" : "Saved to wishlist", {
            href: "/wishlist",
            hrefLabel: "View",
            tone: "pink",
        });
    };

    return (
        <div className="fixed inset-0 z-[115] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="Quick look">
            <button
                type="button"
                className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                aria-label="Close quick look"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-[slideInUp_0.28s_ease-out]">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] bg-[#f3ebe4] shrink-0">
                    <Image
                        src={product.main_image || "/logo.png"}
                        alt={product.image_alt || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 512px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 text-gray-700 flex items-center justify-center shadow-sm"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5 sm:p-6 overflow-y-auto">
                    <p className="text-[10px] font-medium tracking-[0.16em] uppercase text-gray-400 mb-1.5">
                        {product.categories?.name || "Jewellery"}
                    </p>
                    <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-gray-900 leading-snug">
                        {product.name}
                    </h2>

                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">₹{price}</span>
                        {hasDiscount && (
                            <>
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-[11px] font-semibold text-[#E91E63]">
                                    {discountPercent}% off
                                </span>
                            </>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#faf7f8] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-gray-600">
                            Anti-tarnish
                        </span>
                        <span className="rounded-full bg-[#faf7f8] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-gray-600">
                            Waterproof
                        </span>
                        {reviewCount > 0 && (
                            <span className="rounded-full bg-[#faf7f8] px-2.5 py-1 text-[10px] font-medium text-gray-600">
                                ★ {reviewCount} reviews
                            </span>
                        )}
                    </div>

                    <div className="mt-5 flex gap-2.5">
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="flex-1 min-h-12 rounded-full bg-[#E91E63] text-white text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#c2185b] active:scale-[0.98] transition-all"
                        >
                            Add to bag
                        </button>
                        <button
                            type="button"
                            onClick={handleWish}
                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                                wishlisted
                                    ? "border-[#E91E63] bg-[#E91E63] text-white"
                                    : "border-gray-200 text-gray-600 hover:border-[#E91E63] hover:text-[#E91E63]"
                            }`}
                            aria-label={wishlisted ? "Remove from wishlist" : "Save"}
                        >
                            ♥
                        </button>
                    </div>

                    <Link
                        href={href}
                        onClick={onClose}
                        className="mt-3 flex min-h-11 w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-700 hover:text-[#E91E63]"
                    >
                        View full details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
