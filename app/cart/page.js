"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
    const { cart, cartSubtotal, cartTotal, shippingFee, removeFromCart, updateQuantity, isInitialized } = useCart();
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();

    const GoogleBtn = ({ id }) => {
        useEffect(() => {
            const renderBtn = () => {
                if (window.google && window.google.accounts) {
                    const btn = document.getElementById(id);
                    if (btn) {
                        window.google.accounts.id.renderButton(
                            btn,
                            {
                                theme: 'outline',
                                size: 'large',
                                text: 'signin_with',
                                shape: 'pill',
                                width: btn.offsetWidth || 300
                            }
                        );
                    }
                }
            };

            const interval = setInterval(() => {
                if (window.google && window.google.accounts) {
                    renderBtn();
                    clearInterval(interval);
                }
            }, 500);

            return () => clearInterval(interval);
        }, [id]);

        return null;
    };

    if (!isInitialized) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center px-6">
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
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-16">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">Shopping Bag</h1>
                    <Link href="/shop" className="text-xs font-bold text-[#E91E63] tracking-widest uppercase border-b border-[#E91E63] pb-1 hover:text-[#C2185B] hover:border-[#C2185B] transition-all">
                        Continue Shopping
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                    {/* Items List */}
                    <div className="space-y-8">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-100 last:border-0 group">
                                {/* Product Image */}
                                <Link href={`/product/${item.id}`} className="relative w-32 sm:w-44 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>

                                {/* Item Info */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <Link href={`/product/${item.id}`} className="text-lg font-bold text-gray-900 hover:text-[#E91E63] transition-colors line-clamp-1">
                                                {item.name}
                                            </Link>
                                            <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#E91E63] uppercase mb-3">{item.category}</p>
                                        {item.description && (
                                            <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2 mb-4 max-w-md">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                In Stock
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                Ships to India
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        {/* Qty Selector */}
                                        <div className="flex items-center border border-gray-100 bg-gray-50/50 rounded-xl h-11 px-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                                                disabled={item.quantity <= 1}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[11px] font-bold text-gray-300 hover:text-red-500 tracking-widest uppercase transition-colors"
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="bg-gray-50/80 backdrop-blur-sm rounded-[32px] p-8 sticky top-28 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Shipping</span>
                                <span className={`font-bold ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Estimated Tax</span>
                                <span className="font-bold text-gray-900">₹0.00</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200/60 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-black text-[#E91E63]">₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {user ? (
                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full bg-gray-900 text-white py-5 rounded-2xl text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 transform active:scale-[0.98] mb-6 shadow-xl shadow-gray-200"
                            >
                                Proceed to Checkout
                            </button>
                        ) : (
                            <div className="mb-6 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex flex-col items-center leading-none flex-shrink-0">
                                        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#E91E63] mb-0.5">THE</span>
                                        <span className="text-sm font-bold tracking-tight text-gray-900 uppercase">
                                            LUXE <span className="font-light text-gray-400">JEWELS</span>
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight text-gray-900 leading-none mb-1">Join The Signature Club.</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Unlock premium privileges</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">Sign in to track orders, save your favorites, and experience our swiftest checkout flow.</p>

                                {/* Native Branded Google Button */}
                                <div className="flex justify-center min-h-[50px] mb-4">
                                    <div id="google-cart-button" className="w-full h-[50px] flex justify-center"></div>
                                </div>

                                <GoogleBtn id="google-cart-button" />

                                <p className="mt-8 text-[10px] text-gray-300 font-medium text-center">
                                    By continuing, you agree to our Terms of Service.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100/60">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-[#E91E63]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-900 tracking-tight">Authenticity Guaranteed</p>
                                    <p className="text-[10px] text-gray-400 font-medium">100% genuine products.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100/60">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-[#E91E63]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-900 tracking-tight">Secure Payment</p>
                                    <p className="text-[10px] text-gray-400 font-medium">SSL encrypted checkout.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

            </div>
        </div>
    );
}
