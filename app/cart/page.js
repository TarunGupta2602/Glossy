"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getProductPath } from "@/lib/seo";
import CheckoutSteps from "../components/CheckoutSteps";
import TrustStrip from "../components/TrustStrip";
import EmptyCartSuggestions from "../components/EmptyCartSuggestions";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

export default function CartPage() {
    const { cart, cartSubtotal, cartTotal, discountAmount, shippingFee, removeFromCart, updateQuantity, isInitialized, promo } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    if (!isInitialized) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center px-6 pb-16">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h1>
                <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven&apos;t added anything to your bag yet. Let&apos;s find something special.</p>
                <Link
                    href="/shop"
                    className="bg-[#E91E63] text-white px-8 py-4 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#C2185B] transition-all duration-300"
                >
                    Start Shopping
                </Link>
                <EmptyCartSuggestions />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className={`${SITE_CONTAINER} pt-6 md:pt-10`}>
                <CheckoutSteps current={1} />
                <div className="flex items-baseline justify-between gap-3 mb-4 md:mb-5">
                    <h1 className="text-2xl md:text-[32px] font-bold text-gray-900 tracking-tight">Shopping Bag</h1>
                    <Link href="/shop" className="text-[10px] md:text-xs font-bold text-[#E91E63] tracking-widest uppercase border-b border-[#E91E63] pb-1 hover:text-[#C2185B] hover:border-[#C2185B] transition-all whitespace-nowrap">
                        Continue
                    </Link>
                </div>

                <TrustStrip className="mb-6 md:mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 md:gap-10 items-start">
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-3 sm:gap-4 pb-4 border-b border-gray-100 last:border-0 group">
                                <Link href={getProductPath(item)} className="relative w-20 sm:w-24 aspect-square rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>

                                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <Link href={getProductPath(item)} className="text-[15px] sm:text-base font-bold text-gray-900 hover:text-[#E91E63] transition-colors line-clamp-2">
                                                {item.name}
                                            </Link>
                                            <p className="text-[15px] sm:text-base font-bold text-gray-900 flex-shrink-0">₹{(item.price * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                        <p className="mt-1 text-[10px] font-bold tracking-[0.16em] text-[#E91E63] uppercase">{item.category}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 gap-2">
                                        <div className="flex items-center border border-gray-100 bg-gray-50/50 rounded-full h-9 px-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-full transition-all"
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                            <span className="w-6 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-full transition-all"
                                                aria-label="Increase quantity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[10px] font-bold text-gray-300 hover:text-red-500 tracking-widest uppercase transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 sticky top-28 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between gap-4 text-sm text-green-600">
                                    <span>Buy 2 Get 1 Free</span>
                                    <span className="font-bold flex-shrink-0">-₹{discountAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-bold text-gray-900">
                                    {shippingFee > 0 ? `₹${shippingFee}` : "—"}
                                </span>
                            </div>
                        </div>

                        {promo.completeSets > 0 && promo.freeGiftSelections?.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {promo.freeGiftSelections.map((selection) => (
                                    <div key={`${selection.productId}-${selection.setNumber}`} className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-2.5">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                            <Image src={selection.image} alt="" fill sizes="40px" className="object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[12px] font-semibold text-gray-900 truncate">{selection.name}</p>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E91E63]">Free gift</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-gray-200/60 pt-4 mb-4">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-black text-[#E91E63]">₹{cartTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>

                        {user ? (
                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl text-[12px] font-bold tracking-[0.16em] uppercase hover:bg-black transition-all active:scale-[0.98]"
                            >
                                Proceed to Checkout
                            </button>
                        ) : authLoading ? (
                            <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
                        ) : (
                            <ContinueWithGoogle next="/checkout" tone="dark" label="Continue with Google" />
                        )}
                    </aside>
                </div>

            </div>
            {!user && !authLoading && (
                <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[#efeae4] bg-white/95 backdrop-blur-md px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] lg:hidden">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-lg font-black text-[#E91E63]">₹{cartTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <ContinueWithGoogle next="/checkout" tone="dark" label="Continue with Google" />
                </div>
            )}
        </div>
    );
}
