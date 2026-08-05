"use client";

import Link from "next/link";
import Image from "next/image";
import { OrderCardSkeleton } from "./ProfileSkeletons";

const STATUS_LABELS = {
    processing: "Processing",
    confirmed: "Confirmed",
    shipped: "Shipped",
    "out for delivery": "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    "return requested": "Return requested",
    returned: "Returned",
};

export default function OrderHistory({ orders, loading, onViewDetails, getStatusColor, onCancelOrder, onReturnOrder }) {
    const isEligibleForReturn = (order) => {
        if (order.order_status !== "delivered") return false;
        const deliveryDate = new Date(order.delivered_at || order.created_at);
        const diffDays = Math.ceil(Math.abs(new Date() - deliveryDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 10;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 md:p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><circle cx="12" cy="13" r="3" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">When you place an order, it will appear here with tracking and details.</p>
                <Link href="/shop" className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#C2185B] transition-colors">
                    Start shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                const statusLabel = STATUS_LABELS[order.order_status] || order.order_status;
                const orderRef = order.razorpay_order_id?.slice(-8) || order.id.slice(-8);

                return (
                    <article
                        key={order.id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all"
                    >
                        <div className="p-5 md:p-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusColor(order.order_status)}`}>
                                            {statusLabel}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Order #{orderRef}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            ₹{parseFloat(order.total_amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex -space-x-3">
                                    {order.items?.slice(0, 3).map((item, idx) => (
                                        <div key={`${item.id || idx}-${item.isFreeGift ? "free" : "item"}`} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white bg-gray-50 shadow-sm">
                                            <Image src={item.image || "/logo.png"} alt={item.name} fill sizes="64px" className="object-cover" />
                                        </div>
                                    ))}
                                    {(order.items?.length || 0) > 3 && (
                                        <div className="relative w-16 h-16 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {order.items?.[0] && (
                                <p className="mt-4 text-sm text-gray-600 line-clamp-1">
                                    {order.items[0].name}
                                    {order.items.length > 1 && ` + ${order.items.length - 1} more item${order.items.length > 2 ? "s" : ""}`}
                                </p>
                            )}

                            <div className="mt-5 flex flex-wrap gap-3 pt-5 border-t border-gray-50">
                                <button
                                    onClick={() => onViewDetails(order)}
                                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                                >
                                    View details
                                </button>
                                <Link
                                    href={`/order/${order.id}/invoice`}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest hover:border-gray-900 transition-colors"
                                >
                                    Invoice
                                </Link>
                                {order.order_status === "processing" && (
                                    <button
                                        onClick={() => onCancelOrder(order.id)}
                                        className="px-5 py-2.5 rounded-xl border border-red-100 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                                    >
                                        Cancel order
                                    </button>
                                )}
                                {isEligibleForReturn(order) && (
                                    <button
                                        onClick={() => onReturnOrder(order.id)}
                                        className="px-5 py-2.5 rounded-xl border border-orange-100 text-orange-700 text-xs font-semibold hover:bg-orange-50 transition-colors"
                                    >
                                        Request return
                                    </button>
                                )}
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
