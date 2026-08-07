"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOverlayOpen } from "../context/OverlayContext";

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

export default function OrderModal({ order, onClose, getStatusColor, onCancelOrder, onReturnOrder }) {
    const isOpen = Boolean(order);
    useBodyScrollLock(isOpen);
    useOverlayOpen(isOpen);

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!order) return null;

    const isEligibleForReturn = () => {
        if (order.order_status !== "delivered") return false;
        const deliveryDate = new Date(order.delivered_at || order.created_at);
        const diffDays = Math.ceil(Math.abs(new Date() - deliveryDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 10;
    };

    const isProcessing = order.order_status === "processing";
    const orderRef = order.razorpay_order_id?.slice(-8) || order.id.slice(-8);
    const statusLabel = STATUS_LABELS[order.order_status] || order.order_status;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Order #{orderRef}</p>
                        <h2 className="text-xl font-bold text-gray-900 mt-0.5">Order details</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
                        <div>
                            <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusColor(order.order_status)}`}>
                                {statusLabel}
                            </span>
                            <p className="text-xs text-gray-500 mt-2">
                                Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹{parseFloat(order.total_amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Items</h3>
                        <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                                <div key={`${item.id || idx}-${item.isFreeGift ? "free" : "item"}`} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                        <Image src={item.image || "/logo.png"} alt={item.name} fill sizes="64px" className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                            {item.isFreeGift && (
                                                <span className="shrink-0 rounded-full bg-[#E91E63]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#E91E63]">Free gift</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Qty {item.quantity} · ₹{parseFloat(item.price).toLocaleString(undefined, { maximumFractionDigits: 0 })} each</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 shrink-0">
                                        ₹{(item.price * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {order.shipping_address && (
                        <div className="rounded-2xl border border-gray-100 p-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Delivery address</h3>
                            <p className="text-sm font-semibold text-gray-900">
                                {order.shipping_address.firstName} {order.shipping_address.lastName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {order.shipping_address.address}<br />
                                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">{order.shipping_address.phone}</p>
                        </div>
                    )}

                    <div className="rounded-2xl bg-gray-900 text-white p-4">
                        <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-1">Payment</p>
                        <p className="text-sm font-semibold">Paid online via Razorpay</p>
                    </div>
                </div>

                <div className="px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-gray-100 flex flex-wrap gap-3">
                    <Link
                        href={`/order/${order.id}/invoice`}
                        className="flex-1 min-w-[140px] min-h-11 py-3 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors text-center flex items-center justify-center"
                    >
                        View invoice
                    </Link>
                    {isProcessing && (
                        <button
                            onClick={() => onCancelOrder(order.id)}
                            className="flex-1 min-w-[140px] min-h-11 py-3 rounded-xl border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                        >
                            Cancel order
                        </button>
                    )}
                    {isEligibleForReturn() && (
                        <button
                            onClick={() => onReturnOrder(order.id)}
                            className="flex-1 min-w-[140px] min-h-11 py-3 rounded-xl border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-widest hover:bg-orange-50 transition-colors"
                        >
                            Request return
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
