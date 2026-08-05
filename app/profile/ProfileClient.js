"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import ProfileHeader from "./ProfileHeader";
import OrderHistory from "./OrderHistory";
import OrderModal from "./OrderModal";
import WishlistTab from "./WishlistTab";
import { ProfileHeaderSkeleton } from "./ProfileSkeletons";

const TABS = [
    { id: "orders", label: "My Orders" },
    { id: "wishlist", label: "Saved Items" },
];

export default function ProfileClient() {
    const { user, profile, loading: authLoading, signOut } = useAuth();
    const { wishlist, removeFromWishlist, isInitialized: wishlistReady } = useWishlist();
    const { addToCart } = useCart();

    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchUserOrders = useCallback(async () => {
        if (!user) return;
        setOrdersLoading(true);
        try {
            const response = await fetch(`/api/orders?userId=${user.id}`);
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                console.error("Error fetching user orders:", data.error);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
        }
        setOrdersLoading(false);
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchUserOrders(); // eslint-disable-line react-hooks/set-state-in-effect
        } else if (!authLoading) {
            setOrdersLoading(false);
        }
    }, [user, authLoading, fetchUserOrders]);

    const handleCancelOrder = async (orderId) => {
        if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

        try {
            const response = await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, order_status: "cancelled" }),
            });

            const data = await response.json();
            if (data.success) {
                fetchUserOrders();
                setSelectedOrder(null);
            } else {
                alert("Failed to cancel order: " + data.error);
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("An error occurred while cancelling the order.");
        }
    };

    const handleReturnOrder = async (orderId) => {
        if (!confirm("Request a return for this order? Returns are accepted within 10 days of delivery.")) return;

        try {
            const response = await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, order_status: "return requested" }),
            });

            const data = await response.json();
            if (data.success) {
                fetchUserOrders();
                setSelectedOrder(null);
                alert("Return request submitted. Our team will contact you shortly.");
            } else {
                alert("Failed to request return: " + data.error);
            }
        } catch (error) {
            console.error("Error requesting return:", error);
            alert("An error occurred while requesting the return.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "processing": return "bg-amber-50 text-amber-800 border-amber-100";
            case "confirmed": return "bg-blue-50 text-blue-800 border-blue-100";
            case "shipped": return "bg-indigo-50 text-indigo-800 border-indigo-100";
            case "out for delivery": return "bg-slate-50 text-slate-800 border-slate-100";
            case "delivered": return "bg-emerald-50 text-emerald-800 border-emerald-100";
            case "cancelled": return "bg-rose-50 text-rose-800 border-rose-100";
            case "return requested": return "bg-orange-50 text-orange-800 border-orange-100";
            case "returned": return "bg-gray-50 text-gray-700 border-gray-100";
            default: return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-24">
                    <ProfileHeaderSkeleton />
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your account</h1>
                <p className="text-gray-500 mb-8 max-w-sm text-sm">Track orders, manage saved items, and update your details.</p>
                <Link href="/" className="bg-[#E91E63] text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#C2185B] transition-colors">
                    Go to homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-24">
                <ProfileHeader
                    user={user}
                    profile={profile}
                    ordersCount={orders.length}
                    wishlistCount={wishlist.length}
                    signOut={signOut}
                />

                <div className="mt-10">
                    <div className="flex gap-1 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm w-full sm:w-fit">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === tab.id
                                        ? "bg-gray-900 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {tab.label}
                                {tab.id === "orders" && orders.length > 0 && (
                                    <span className={`ml-2 text-xs ${activeTab === tab.id ? "text-white/70" : "text-gray-400"}`}>
                                        ({orders.length})
                                    </span>
                                )}
                                {tab.id === "wishlist" && wishlist.length > 0 && (
                                    <span className={`ml-2 text-xs ${activeTab === tab.id ? "text-white/70" : "text-gray-400"}`}>
                                        ({wishlist.length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 min-h-[320px]">
                    {activeTab === "orders" ? (
                        <OrderHistory
                            orders={orders}
                            loading={ordersLoading}
                            onViewDetails={setSelectedOrder}
                            getStatusColor={getStatusColor}
                            onCancelOrder={handleCancelOrder}
                            onReturnOrder={handleReturnOrder}
                        />
                    ) : (
                        <WishlistTab
                            wishlist={wishlist}
                            initialized={wishlistReady}
                            removeFromWishlist={removeFromWishlist}
                            addToCart={addToCart}
                        />
                    )}
                </div>
            </main>

            <OrderModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                getStatusColor={getStatusColor}
                onCancelOrder={handleCancelOrder}
                onReturnOrder={handleReturnOrder}
            />
        </div>
    );
}
