"use client";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
    const { cart, cartTotal, isInitialized } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !user) {
            router.push("/cart");
        }
    }, [user, isInitialized, router]);

    if (!isInitialized || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout is empty</h1>
                <p className="text-gray-500 mb-8 max-w-xs">You need to add items to your bag before checking out.</p>
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
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <h1 className="text-[32px] font-black tracking-tight text-gray-900 mb-10">Secure Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Information Forms Placeholder */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E91E63] text-white text-sm">1</span>
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue={user.email}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E91E63] text-white text-sm">2</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">First Name</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Address</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]" />
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-gray-900 text-white py-5 rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-black transition-all duration-300">
                            Continue to Payment
                        </button>
                    </div>

                    {/* Right: Order Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-6">Your Order</h2>
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{item.category}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500 font-semibold">Qty: {item.quantity}</span>
                                                <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 mt-8 pt-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-bold text-green-600 tracking-widest uppercase text-xs">Calculated at next step</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-3">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-[#E91E63]">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
