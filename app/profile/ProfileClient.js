"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import ProfileHeader from "./ProfileHeader";
import OrderHistory from "./OrderHistory";
import OrderModal from "./OrderModal";
import { ProfileHeaderSkeleton } from "./ProfileSkeletons";

export default function ProfileClient() {
    const { user, loading: authLoading, signOut } = useAuth();

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
            case 'processing': return 'bg-amber-50 text-amber-900 border-amber-100';
            case 'confirmed': return 'bg-blue-50 text-blue-900 border-blue-100';
            case 'shipped': return 'bg-indigo-50 text-indigo-900 border-indigo-100';
            case 'out for delivery': return 'bg-slate-50 text-slate-900 border-slate-100';
            case 'delivered': return 'bg-emerald-50 text-emerald-900 border-emerald-100';
            case 'cancelled': return 'bg-rose-50 text-rose-900 border-rose-100';
            case 'return requested': return 'bg-orange-50 text-orange-900 border-orange-100';
            case 'returned': return 'bg-gray-50 text-gray-900 border-gray-100';
            default: return 'bg-gray-50 text-gray-400 border-gray-100';
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white">
                <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-40 pb-24">
                    <ProfileHeaderSkeleton />
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-10 overflow-hidden">
                    <div className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center text-gray-300 font-serif italic text-2xl">L</div>
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Access Restricted</h1>
                <p className="text-gray-400 mb-12 max-w-sm text-sm font-medium leading-relaxed tracking-wide uppercase">Authenticate your identity to view your curated acquisitions and signature wishlist.</p>
                <Link href="/" className="bg-gray-900 text-white px-12 py-5 rounded-full text-[11px] font-black tracking-[0.4em] uppercase hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                    Return to Boutique
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-40 pb-32">
                <ProfileHeader
                    user={user}
                    ordersCount={orders.length}
                    signOut={signOut}
                />

                <div className="mt-24 space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-12">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-[2px] w-12 bg-[#E91E63]" />
                                <span className="text-[10px] font-black text-[#E91E63] uppercase tracking-[0.3em]">Client Archives</span>
                            </div>
                            <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">Purchase History</h2>
                            <p className="text-sm text-gray-400 font-medium tracking-wide leading-relaxed">A permanent record of your refined selections. Each piece reflects a moment of uncompromising taste and timeless elegance.</p>
                        </div>
                    </div>
                </div>

                <div className="min-h-[400px]">
                    <OrderHistory
                        orders={orders}
                        loading={ordersLoading}
                        onViewDetails={setSelectedOrder}
                        getStatusColor={getStatusColor}
                        onCancelOrder={handleCancelOrder}
                        onReturnOrder={handleReturnOrder}
                    />
                </div>
            </main>

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
        </div >
    );
}
