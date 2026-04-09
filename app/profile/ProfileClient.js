"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import ProfileHeader from "./ProfileHeader";
import OrderHistory from "./OrderHistory";
import WishlistTab from "./WishlistTab";
import OrderModal from "./OrderModal";
import { ProfileHeaderSkeleton } from "./ProfileSkeletons";

export default function ProfileClient() {
    const { user, loading: authLoading, signOut } = useAuth();
    const { wishlist, removeFromWishlist, isInitialized: wishlistInitialized } = useWishlist();
    const { addToCart } = useCart();

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders");
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
        if (!confirm("Are you sure you want to request a return for this order? Our policy allows returns within 7 days of delivery.")) return;

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
                alert("Return request submitted successfully. Our team will contact you shortly.");
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
            case 'processing': return 'bg-amber-100 text-amber-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-indigo-100 text-indigo-700';
            case 'out for delivery': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'return requested': return 'bg-orange-100 text-orange-700';
            case 'returned': return 'bg-gray-200 text-gray-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <ProfileHeaderSkeleton />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20 px-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-500 mb-8 max-w-xs">Please sign in to view your orders and wishlist.</p>
                <Link href="/" className="bg-gray-900 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-black transition-all">
                    Go Back Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6 lg:px-12">

                <ProfileHeader
                    user={user}
                    ordersCount={orders.length}
                    wishlistCount={wishlist.length}
                    signOut={signOut}
                />

                <div className="flex justify-center md:justify-start gap-12 mb-12 relative">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`group pb-6 text-sm font-bold tracking-[0.2em] uppercase transition-all relative ${activeTab === 'orders' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Order History
                        <div className={`absolute bottom-0 left-0 h-1 bg-gray-900 transition-all duration-300 ${activeTab === 'orders' ? 'w-full' : 'w-0 group-hover:w-4'}`} />
                    </button>
                    <button
                        onClick={() => setActiveTab("wishlist")}
                        className={`group pb-6 text-sm font-bold tracking-[0.2em] uppercase transition-all relative ${activeTab === 'wishlist' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        My Wishlist
                        <div className={`absolute bottom-0 left-0 h-1 bg-gray-900 transition-all duration-300 ${activeTab === 'wishlist' ? 'w-full' : 'w-0 group-hover:w-4'}`} />
                    </button>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100 -z-10" />
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'orders' ? (
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
                            initialized={wishlistInitialized}
                            removeFromWishlist={removeFromWishlist}
                            addToCart={addToCart}
                        />
                    )}
                </div>
            </div>

            <OrderModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                getStatusColor={getStatusColor}
                onCancelOrder={handleCancelOrder}
                onReturnOrder={handleReturnOrder}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #F3F4F6;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #E5E7EB;
                }
            `}</style>
        </div>
    );
}
