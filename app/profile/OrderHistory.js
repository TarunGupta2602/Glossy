"use client";

import Link from "next/link";
import Image from "next/image";
import { OrderCardSkeleton } from "./ProfileSkeletons";

export default function OrderHistory({ orders, loading, onViewDetails, getStatusColor, onCancelOrder, onReturnOrder }) {
    const isEligibleForReturn = (order) => {
        if (order.order_status !== 'delivered') return false;
        const deliveryDate = new Date(order.delivered_at || order.created_at);
        const diffTime = Math.abs(new Date() - deliveryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white border border-gray-100 p-24 text-center rounded-[40px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><circle cx="12" cy="13" r="3" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">An Empty Gallery</h3>
                <p className="text-gray-400 mb-12 max-w-xs mx-auto text-sm leading-relaxed">Your journey through our curated collections is about to begin. Every masterpiece starts with a single selection.</p>
                <Link href="/shop" className="inline-flex items-center gap-4 bg-gray-900 text-white px-12 py-5 rounded-full text-[11px] font-black tracking-[0.3em] uppercase hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                    Explore Collections
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="group bg-white border border-gray-100 hover:border-gray-900 transition-all duration-700 overflow-hidden rounded-[32px] md:rounded-[40px] hover:shadow-2xl hover:shadow-gray-100/50"
                >
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col xl:flex-row gap-12">
                            {/* Order Status and Info */}
                            <div className="xl:w-1/4 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusColor(order.order_status).replace('bg-', 'border-').replace('100', '200')} ${getStatusColor(order.order_status)}`}>
                                        {order.order_status}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">
                                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Transaction ID</p>
                                    <p className="text-sm font-bold text-gray-900 tracking-tight">{order.razorpay_order_id}</p>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] font-black text-[#E91E63] uppercase tracking-[0.2em] mb-1">Total Valuation</p>
                                    <p className="text-4xl font-black text-gray-900 tracking-tighter italic">₹{parseFloat(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            {/* Item Previews */}
                            <div className="flex-1">
                                <div className="flex flex-col justify-between h-full py-2">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex -space-x-6">
                                            {order.items?.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-3xl overflow-hidden border-4 border-white bg-gray-50 shadow-xl shadow-gray-900/5 group-hover:-translate-y-2 transition-transform duration-500" style={{ transitionDelay: `${idx * 100}ms` }}>
                                                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                                                </div>
                                            ))}
                                            {order.items?.length > 4 && (
                                                <div className="relative w-24 h-24 rounded-3xl bg-gray-900 border-4 border-white shadow-xl flex items-center justify-center text-xs font-black text-white z-10">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-6 space-y-1">
                                            <p className="text-lg font-black text-gray-900 tracking-tight">
                                                {order.items?.[0]?.name}
                                                {order.items?.length > 1 && <span className="text-gray-400 ml-2">& {order.items.length - 1} Selected Works</span>}
                                            </p>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                Insured Express Delivery · Indian Rupee (INR)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Footnote */}
                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <button
                                            onClick={() => onViewDetails(order)}
                                            className="h-14 px-10 rounded-full bg-gray-900 text-white text-[11px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4 hover:bg-black shadow-lg shadow-gray-200"
                                        >
                                            View Dossier
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>

                                        {order.order_status === 'processing' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onCancelOrder(order.id);
                                                }}
                                                className="h-14 px-8 rounded-full border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center hover:bg-red-50"
                                            >
                                                Request Cancellation
                                            </button>
                                        )}
                                        {isEligibleForReturn(order) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onReturnOrder(order.id);
                                                }}
                                                className="h-14 px-8 rounded-full border border-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center hover:bg-orange-50"
                                            >
                                                Initialize Return
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

