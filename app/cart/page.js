"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, cartSubtotal, cartTotal, shippingFee, removeFromCart, updateQuantity, isInitialized } = useCart();
    const { user, signInWithGoogle } = useAuth();
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
                                            <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
                                <span className="font-semibold text-gray-900">₹{cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tax</span>
                                <span className="font-semibold text-gray-900">₹0.00</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-[#E91E63]">₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {user ? (
                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full bg-gray-900 text-white py-5 rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-black transition-all duration-300 transform active:scale-[0.98] mb-4"
                            >
                                Proceed to Checkout
                            </button>
                        ) : (
                            <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Image
                                        src="/favicon.ico"
                                        alt="The luxe jewels Logo"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 object-contain"
                                    />
                                    <h3 className="text-lg font-black tracking-tight text-gray-900">Join The luxe jewels.</h3>
                                </div>
                                <p className="text-xs text-gray-500 font-medium mb-5">Sign in to sync your bag, track orders, and enjoy a faster checkout.</p>
                                <button
                                    onClick={signInWithGoogle}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 py-3 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-200 transition-all group active:scale-[0.98]"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">Sign in with Google</span>
                                </button>
                            </div>
                        )}

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
