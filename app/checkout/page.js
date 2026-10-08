"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CheckoutSteps from "../components/CheckoutSteps";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import PaymentIcons from "../components/PaymentIcons";
import { trackPurchase } from "@/lib/gtag";
import { trackMetaPurchase } from "@/lib/metaPixel";
import { authFetch } from "@/lib/adminApi";
import { RETURN_POLICY_SHORT, RETURN_POLICY_SUMMARY } from "@/lib/productTrust";
import { WELCOME_CODE, isWelcomeCode, welcomeDiscountAmount } from "@/lib/welcomeOffer";

export default function CheckoutPage() {
    const { cart, cartSubtotal, shippingFee, discountAmount, cartTotal, isInitialized, clearCart, promo } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutItems, setCheckoutItems] = useState([]);

    useEffect(() => {
        const items = cart.map((item) => ({
            ...item,
            quantity: item.quantity || 1,
            price: Number(item.price) || 0,
            isFreeGift: false,
        }));

        if (promo.freeGiftSelections?.length > 0) {
            promo.freeGiftSelections.forEach((selection) => {
                items.push({
                    id: selection.productId,
                    name: selection.name,
                    image: selection.image,
                    category: selection.category,
                    quantity: 1,
                    price: 0,
                    originalPrice: Number(selection.price) || 0,
                    isFreeGift: true,
                });
            });
        }

        setCheckoutItems(items);
    }, [cart, promo.freeGiftSelections]);

    const [paymentStatus, setPaymentStatus] = useState("idle");
    const [payMode, setPayMode] = useState(null);
    const [offerInput, setOfferInput] = useState("");
    const [welcomeOn, setWelcomeOn] = useState(false);
    const [offerMessage, setOfferMessage] = useState("");
    const [offerChecking, setOfferChecking] = useState(false);
    const welcomeDiscount = welcomeOn ? welcomeDiscountAmount(cartSubtotal) : 0;
    const payableTotal = Math.max(0, cartTotal - welcomeDiscount);
    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        giftNote: "",
    });

    useEffect(() => {
        if (user?.email) {
            setShippingInfo((prev) => ({
                ...prev,
                email: prev.email || user.email,
            }));
        }
    }, [user?.email]);

    async function applyWelcomeCode() {
        if (!user) {
            setWelcomeOn(false);
            setOfferMessage("Sign in to use FIRST10 on your first order.");
            return;
        }
        if (!isWelcomeCode(offerInput)) {
            setWelcomeOn(false);
            setOfferMessage("Enter FIRST10 for 10% off your first order.");
            return;
        }

        setOfferChecking(true);
        setOfferMessage("");
        try {
            const response = await authFetch("/api/welcome-offer", {
                method: "POST",
                body: JSON.stringify({ code: offerInput }),
            });
            const data = await response.json();
            if (!response.ok || !data.ok) {
                setWelcomeOn(false);
                setOfferMessage(data.error || "That code is not valid");
                return;
            }
            setWelcomeOn(true);
            setOfferMessage("10% off applied to this first order.");
        } catch (error) {
            console.error("Welcome code error:", error);
            setWelcomeOn(false);
            setOfferMessage("Could not check the code. Try again.");
        } finally {
            setOfferChecking(false);
        }
    }

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCodOrder = async () => {
        if (!user) {
            alert("Please sign in to complete checkout.");
            return;
        }
        if (!cart.length) {
            alert("Your cart is empty.");
            return;
        }
        if (!shippingInfo.firstName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode) {
            alert("Please fill in your shipping details.");
            return;
        }

        setIsProcessing(true);
        setPayMode("cod");

        try {
            for (const item of cart) {
                await authFetch("/api/cart", {
                    method: "POST",
                    body: JSON.stringify({
                        productId: item.id,
                        quantity: item.quantity || 1,
                        action: "add",
                    }),
                });
            }

            const storeOrderRes = await authFetch("/api/orders", {
                method: "POST",
                body: JSON.stringify({
                    payment_method: "cod",
                    shipping_address: shippingInfo,
                    contact_phone: shippingInfo.phone,
                    items: cart.map((item) => ({
                        id: item.id,
                        quantity: item.quantity || 1,
                    })),
                    welcome_code: welcomeOn ? WELCOME_CODE : "",
                }),
            });
            const saved = await storeOrderRes.json();
            if (!storeOrderRes.ok) {
                throw new Error(saved.error || "Could not place the order");
            }

            trackPurchase({
                transactionId: saved.order.id,
                value: saved.order.total_amount ?? payableTotal,
                items: checkoutItems.filter((item) => !item.isFreeGift),
            });
            trackMetaPurchase({
                value: saved.order.total_amount ?? payableTotal,
                transactionId: saved.order.id,
            });

            await clearCart();
            router.push(`/order/${saved.order.id}/confirmation`);
        } catch (error) {
            console.error("COD order error:", error);
            alert(error.message || "Could not place the cash on delivery order.");
            setIsProcessing(false);
            setPayMode(null);
        }
    };

    const handlePayment = async () => {
        if (!user) {
            alert("Please sign in to complete checkout.");
            return;
        }
        if (!cart.length) {
            alert("Your cart is empty.");
            return;
        }
        if (!shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode) {
            alert("Please fill in your shipping details.");
            return;
        }

        setIsProcessing(true);
        setPayMode("online");
        const res = await loadRazorpay();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            setIsProcessing(false);
            setPayMode(null);
            return;
        }

        try {
            // Keep DB cart in sync with what the customer sees before charging
            for (const item of cart) {
                await authFetch("/api/cart", {
                    method: "POST",
                    body: JSON.stringify({
                        productId: item.id,
                        quantity: item.quantity || 1,
                        action: "add",
                    }),
                });
            }

            const orderResponse = await authFetch("/api/razorpay", {
                method: "POST",
                body: JSON.stringify({
                    items: cart.map((item) => ({
                        id: item.id,
                        quantity: item.quantity || 1,
                    })),
                    welcome_code: welcomeOn ? WELCOME_CODE : "",
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.error || "Failed to create order");
            }

            const chargedTotal = orderData.cartTotal ?? payableTotal;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "The Luxe Jewels",
                description: "Jewellery Purchase",
                image: "/logo.png",
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        const storeOrderRes = await authFetch("/api/orders", {
                            method: "POST",
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                shipping_address: shippingInfo,
                                contact_phone: shippingInfo.phone,
                                items: cart.map((item) => ({
                                    id: item.id,
                                    quantity: item.quantity || 1,
                                })),
                                welcome_code: welcomeOn ? WELCOME_CODE : "",
                            }),
                        });

                        if (!storeOrderRes.ok) {
                            const errorData = await storeOrderRes.json();
                            throw new Error(errorData.error || "Failed to store order");
                        }

                        const savedOrder = await storeOrderRes.json();

                        trackPurchase({
                            transactionId: response.razorpay_payment_id,
                            value: chargedTotal,
                            items: checkoutItems.filter((item) => !item.isFreeGift),
                        });

                        trackMetaPurchase({
                            value: chargedTotal,
                            transactionId: response.razorpay_payment_id,
                        });

                        await clearCart();
                        router.push(`/order/${savedOrder.order.id}/confirmation`);
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
                        setPayMode(null);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert(error.message || "Something went wrong with the payment.");
            setPaymentStatus("error");
            setIsProcessing(false);
            setPayMode(null);
        }
    };

    if (paymentStatus === "error") {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
                <p className="text-gray-500 max-w-sm mb-8">Your payment may have gone through. Please check My Orders or contact support with your payment ID.</p>
                <Link href="/profile" className="bg-gray-900 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-black transition-all">
                    View my orders
                </Link>
            </div>
        );
    }

    if (!isInitialized || authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#efeae4]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E91E63] mb-2">Checkout</p>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to place this order</h1>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        Your bag stays with you. Google sign-in opens the address step so we can pack the order on your account.
                    </p>
                    {cart.length > 0 && (
                        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#fdfbf7] px-4 py-3 text-sm">
                            <span className="text-gray-500">
                                {cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)} in your bag
                            </span>
                            <span className="font-bold text-[#E91E63]">₹{cartTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    )}
                    <div className="mt-5">
                        <ContinueWithGoogle next="/checkout" />
                    </div>
                    <Link href="/cart" className="mt-4 block text-center text-[12px] font-semibold text-gray-500 hover:text-gray-900">
                        Back to bag
                    </Link>
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
            <div className={`${SITE_CONTAINER} py-8 md:py-16`}>
                <CheckoutSteps current={2} />
                <h1 className="text-2xl md:text-[32px] font-black tracking-tight text-gray-900 mb-4">Secure Checkout</h1>

                <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 md:px-5 md:py-4 text-xs md:text-sm text-blue-900">
                        Pay online with <span className="font-bold">UPI, cards, or net banking</span>, or choose <span className="font-bold">cash on delivery</span> and pay when the parcel arrives.
                    </div>
                    <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 md:px-5 md:py-4 text-xs md:text-sm text-amber-900">
                        Estimated delivery: <span className="font-bold">3–5 business days</span> across India after dispatch.
                    </div>
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 md:px-5 md:py-4 text-xs md:text-sm text-emerald-900">
                        <span className="font-bold">10-day easy returns</span> on unused pieces in original packaging.{" "}
                        <Link href="/shipping-returns" className="underline underline-offset-2 font-semibold hover:opacity-80">
                            Policy
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start">
                    {/* Left: Information Forms */}
                    <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-8 shadow-sm space-y-6 md:space-y-8">
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
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Gift note <span className="normal-case tracking-normal font-medium text-gray-400">(optional)</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        maxLength={160}
                                        placeholder="Buying for someone else? We’ll include this with festive gift wrap."
                                        value={shippingInfo.giftNote}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, giftNote: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#E91E63] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCodOrder}
                                disabled={isProcessing || !shippingInfo.firstName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode}
                                className={`w-full py-5 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 ${isProcessing || !shippingInfo.firstName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-black transform active:scale-[0.98]"
                                    }`}
                            >
                                {isProcessing && payMode === "cod" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Placing order...
                                    </>
                                ) : (
                                    "Place order · Cash on delivery"
                                )}
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || !shippingInfo.firstName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode}
                                className={`w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 border ${isProcessing || !shippingInfo.firstName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.pincode
                                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                                    : "border-gray-900 text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {isProcessing && payMode === "online" ? "Opening payment..." : "Pay now with UPI or card"}
                            </button>
                            <p className="text-center text-[11px] text-gray-500 leading-relaxed">
                                Cash on delivery is collected by the courier. The order stays on your signed-in account so we can pack and ship it.
                            </p>
                        </div>
                    </div>

                    {/* Right: Order Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-8 shadow-sm">
                            <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-6">Your Order</h2>
                            <div className="space-y-6">
                                {checkoutItems.map((item) => (
                                    <div key={`${item.id}-${item.isFreeGift ? 'free' : 'cart'}-${item.freeGiftSet || 0}`} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            <Image src={item.image || "/logo.png"} alt={item.name} fill sizes="80px" className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                                                {item.isFreeGift && (
                                                    <span className="rounded-full bg-[#E91E63]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#E91E63]">
                                                        Free Gift
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{item.category || (item.isFreeGift ? "Free Gift" : "Purchased")}</p>
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
                                        <span className="font-medium">Buy 2 Get 1 Free</span>
                                        <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="pt-1">
                                    <div className="flex gap-2">
                                        <input
                                            value={offerInput}
                                            onChange={(e) => {
                                                setOfferInput(e.target.value.toUpperCase());
                                                setWelcomeOn(false);
                                                setOfferMessage("");
                                            }}
                                            placeholder="Code FIRST10"
                                            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wide focus:outline-none focus:border-gray-900"
                                            autoComplete="off"
                                        />
                                        <button
                                            type="button"
                                            onClick={applyWelcomeCode}
                                            disabled={offerChecking}
                                            className="shrink-0 rounded-xl bg-gray-900 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-50"
                                        >
                                            {offerChecking ? "..." : "Apply"}
                                        </button>
                                    </div>
                                    <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                                        {WELCOME_CODE} is 10% off your first order. Shipping stays the same.
                                    </p>
                                    {offerMessage && (
                                        <p className={`mt-1 text-[12px] ${welcomeOn ? "text-green-700" : "text-gray-700"}`} role="status">
                                            {offerMessage}
                                        </p>
                                    )}
                                </div>
                                {welcomeDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span className="font-medium">First order 10% ({WELCOME_CODE})</span>
                                        <span className="font-bold">-₹{welcomeDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                {promo.completeSets > 0 && promo.freeGiftSelections?.length > 0 && (
                                    <div className="rounded-2xl border border-[#E91E63]/10 bg-[#E91E63]/5 p-4 text-sm text-gray-700">
                                        <p className="font-semibold text-[#E91E63] mb-2">Free gift(s) included</p>
                                        <ul className="space-y-1">
                                            {promo.freeGiftSelections.map((selection) => (
                                                <li key={`${selection.productId}-${selection.setNumber}`} className="flex items-center justify-between gap-3">
                                                    <span>Gift {selection.setNumber}</span>
                                                    <span className="font-semibold text-gray-900">{selection.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Shipping & delivery</span>
                                    <span className={shippingFee > 0 ? "font-bold text-gray-900" : "font-black tracking-widest uppercase text-green-600"}>
                                        {shippingFee > 0 ? `₹${shippingFee}` : "Free"}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                    ₹50 under ₹500, ₹80 from ₹500, ₹120 from ₹1000, ₹150 from ₹1500.
                                </p>
                                <div className="flex justify-between border-t border-gray-100 pt-3">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-[#E91E63]">₹{payableTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-1">
                            <p className="text-center text-[11px] text-gray-500 leading-relaxed">
                                {RETURN_POLICY_SUMMARY}{" "}
                                <Link href="/shipping-returns" className="text-gray-700 font-semibold underline underline-offset-2">
                                    Shipping &amp; returns
                                </Link>
                            </p>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    Secure encrypted payments · {RETURN_POLICY_SHORT}
                                </div>
                                <PaymentIcons />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
