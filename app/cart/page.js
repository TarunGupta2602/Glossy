"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CartPage() {
    const { cart, cartTotal, removeFromCart, updateQuantity, isInitialized } = useCart();

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
                <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven't added anything to your bag yet. Let's find something special.</p>
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
                <h1 className="text-[32px] font-bold text-gray-900 mb-10 tracking-tight">Shopping Bag</h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                    {/* Items List */}
                    <div className="space-y-8">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-100 last:border-0 group">
                                {/* Product Image */}
                                <Link href={`/product/${item.id}`} className="relative w-32 sm:w-40 aspect-square rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
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
                                            <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">{item.category}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        {/* Qty Selector */}
                                        <div className="flex items-center border border-gray-200 rounded-xl h-10 px-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs font-bold text-gray-400 hover:text-red-500 tracking-widest uppercase transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="bg-gray-50 rounded-3xl p-8 sticky top-28">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span className="font-semibold text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tax</span>
                                <span className="font-semibold text-gray-900">$0.00</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-[#E91E63]">${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <button className="w-full bg-gray-900 text-white py-5 rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-black transition-all duration-300 transform active:scale-[0.98] mb-4">
                            Proceed to Checkout
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Secure Checkout Guarantee
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
