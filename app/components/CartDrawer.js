"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOverlayOpen } from "../context/OverlayContext";
import { PROMO_LABEL } from "@/lib/promo";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import { getProductPath } from "@/lib/seo";

export default function CartDrawer() {
    const {
        cart,
        cartCount,
        cartSubtotal,
        discountAmount,
        cartTotal,
        promo,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
    } = useCart();

    useBodyScrollLock(isCartOpen);
    useOverlayOpen(isCartOpen);

    useEffect(() => {
        if (!isCartOpen) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") closeCart();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isCartOpen, closeCart]);

    if (!isCartOpen) return null;

    const untilNext = promo?.itemsUntilNextFree ?? 0;
    const freeUnlocked = promo?.completeSets > 0;
    const progressPct = untilNext === 0 && cartCount > 0 ? 100 : cartCount % 2 === 1 ? 50 : cartCount > 0 ? 100 : 0;

    return (
        <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Shopping bag">
            <button
                type="button"
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                aria-label="Close bag"
                onClick={closeCart}
            />

            <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideInRight_0.28s_ease-out]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-playfair font-bold text-gray-900">Your bag</h2>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            {cartCount} item{cartCount === 1 ? "" : "s"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeCart}
                        className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-900"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-5 py-3 border-b border-gray-50 bg-[#faf7f8]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#E91E63]">
                            {PROMO_LABEL}
                        </p>
                        <p className="text-[11px] text-gray-600 text-right">
                            {freeUnlocked
                                ? `${promo.completeSets} free gift${promo.completeSets > 1 ? "s" : ""} unlocked`
                                : untilNext === 1
                                  ? "Add 1 more for a free gift"
                                  : "Add 2 items for a free gift"}
                        </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-white overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#E91E63] transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 mb-4">Your bag is empty</p>
                            <Link
                                href="/shop"
                                onClick={closeCart}
                                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gray-900 px-5 text-[11px] font-semibold uppercase tracking-wider text-white"
                            >
                                Continue shopping
                            </Link>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cart.map((item) => (
                                <li key={item.id} className="flex gap-3">
                                    <Link
                                        href={getProductPath(item)}
                                        onClick={closeCart}
                                        className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f3ebe4]"
                                    >
                                        <Image
                                            src={item.main_image || item.image || "/logo.png"}
                                            alt={item.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                            placeholder="blur"
                                            blurDataURL={IMAGE_BLUR_DATA_URL}
                                        />
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={getProductPath(item)}
                                            onClick={closeCart}
                                            className="font-playfair text-[15px] text-gray-900 line-clamp-2 hover:text-[#E91E63]"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="mt-1 text-[13px] font-semibold text-gray-900">
                                            ₹{(item.price || 0).toLocaleString()}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <div className="inline-flex items-center rounded-full border border-gray-200">
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 text-gray-600"
                                                    onClick={() =>
                                                        item.quantity <= 1
                                                            ? removeFromCart(item.id)
                                                            : updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="w-6 text-center text-[12px] font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 text-gray-600"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-[11px] font-medium text-gray-400 hover:text-[#E91E63]"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] space-y-3">
                        <div className="flex justify-between text-[13px] text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{cartSubtotal.toLocaleString()}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-[13px] text-[#E91E63]">
                                <span>Promo savings</span>
                                <span>−₹{discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-[15px] font-semibold text-gray-900">
                            <span>Total</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Link
                            href="/cart"
                            onClick={closeCart}
                            className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#E91E63] text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#c2185b] transition-colors"
                        >
                            View bag & checkout
                        </Link>
                    </div>
                )}
            </aside>
        </div>
    );
}
