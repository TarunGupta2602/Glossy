"use client";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
    const { cart, cartSubtotal, shippingFee, discountAmount, cartTotal, isInitialized, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

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
                                text: 'continue_with',
                                shape: 'pill',
                                width: btn.offsetWidth || 320
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

    const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, success, error new
    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    });


    useEffect(() => {
        if (isInitialized && !user) {
            router.push("/cart");
        }
    }, [user, isInitialized, router]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        const res = await loadRazorpay();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            setIsProcessing(false);
            return;
        }

        try {
            // 1. Create order on server
            const orderResponse = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: cartTotal,
                    currency: "INR",
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.error || "Failed to create order");
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "The luxe jewels",
                description: "Jewelry Purchase",
                image: "/logo.png",
                order_id: orderData.id,
                handler: async function (response) {
                    // Payment successful
                    try {
                        const storeOrderRes = await fetch("/api/orders", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user_id: user.id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                total_amount: cartTotal,
                                shipping_address: shippingInfo,
                                contact_phone: shippingInfo.phone,
                                items: cart
                            }),
                        });

                        if (!storeOrderRes.ok) {
                            const errorData = await storeOrderRes.json();
                            throw new Error(errorData.error || "Failed to store order");
                        }

                        setPaymentStatus("success");
                        clearCart();
                    } catch (error) {
                        console.error("Error storing order:", error);
                        alert("Payment was successful, but we had trouble saving your order. Please contact support.");
                        setPaymentStatus("error");
                    }
                },
                prefill: {
                    name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                    email: user.email,
                    contact: shippingInfo.phone,
                },
                theme: {
                    color: "#E91E63",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Something went wrong with the payment.");
            setPaymentStatus("error");
            setIsProcessing(false);
        }
    };

    if (paymentStatus === "success") {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-gray-500 max-w-sm mb-10 text-lg">Thank you for your purchase.</p>
                <Link
                    href="/shop"
                    className="bg-gray-900 text-white px-10 py-5 rounded-2xl text-sm font-bold tracking-widest uppercase hover:bg-black transition-all"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (!isInitialized || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex flex-col items-center leading-none mb-8">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#E91E63] mb-1">THE</span>
                        <span className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                            LUXE <span className="font-light text-gray-500">JEWELS</span>
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Signature Awaits.</h1>
                    <p className="text-gray-400 mb-10 text-sm leading-relaxed px-4">Log in to complete your acquisition and track your order every step of the way.</p>

                    {/* Native Branded Google Button */}
                    <div className="flex justify-center min-h-[50px]">
                        <div id="google-checkout-login" className="w-full h-[50px] flex justify-center"></div>
                    </div>

                    <GoogleBtn id="google-checkout-login" />

                    <div className="mt-12 flex flex-col gap-4">
                        <Link href="/cart" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
                            Return to Bag
                        </Link>
                    </div>
                </div>
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
                    {/* Left: Information Forms */}
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
                                        placeholder="your@email.com"
                                        value={shippingInfo.email}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
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
                                    <input
                                        type="text"
                                        placeholder="Enter first name"
                                        value={shippingInfo.firstName}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter last name"
                                        value={shippingInfo.lastName}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Address</label>
                                    <input
                                        type="text"
                                        placeholder="Street address"
                                        value={shippingInfo.address}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={shippingInfo.city}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">State</label>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={shippingInfo.state}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pin Code</label>
                                    <input
                                        type="text"
                                        placeholder="6-digit pin code"
                                        value={shippingInfo.pincode}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        value={shippingInfo.phone}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63]"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing || !shippingInfo.firstName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode}
                            className={`w-full py-5 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 ${isProcessing || !shippingInfo.firstName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-900 text-white hover:bg-black transform active:scale-[0.98]"
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                "Pay Now with Razorpay"
                            )}
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
                                            <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{item.category}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500 font-semibold">Qty: {item.quantity}</span>
                                                <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 mt-8 pt-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Cart Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{cartSubtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span className="font-medium">Offer Discount (Buy 2 Get 1)</span>
                                        <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-black tracking-widest uppercase text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-3">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-[#E91E63]">₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Secure encrypted payments
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
