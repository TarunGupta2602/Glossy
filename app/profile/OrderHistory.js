"use client";

import Link from "next/link";
import { OrderCardSkeleton } from "./ProfileSkeletons";

export default function OrderHistory({ orders, loading, onViewDetails, getStatusColor, onCancelOrder, onReturnOrder }) {
    const isEligibleForReturn = (order) => {
        if (order.order_status !== 'delivered') return false;
        // In a real app we'd use delivered_at. Fallback to created_at for now.
        const deliveryDate = new Date(order.delivered_at || order.created_at);
        const diffTime = Math.abs(new Date() - deliveryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-8">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Acquisitions Yet</h3>
                <p className="text-gray-400 mb-10 max-w-xs mx-auto text-sm">Your journey with The luxe jewels begins with your first selection.</p>
                <Link href="/shop" className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all shadow-xl shadow-gray-200">
                    Browse the Collection
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8">
            {orders.map((order) => (
                <div key={order.id} className="group bg-white rounded-[32px] border border-gray-100 hover:border-gray-200 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-gray-100">
                    <div className="p-8 md:p-10 flex flex-col md:flex-row items-stretch md:items-center gap-10">
                        <div className="space-y-4 min-w-[200px]">
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${getStatusColor(order.order_status)}`}>
                                    {order.order_status}
                                </span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">ID: {order.razorpay_order_id}</p>
                                <p className="text-2xl font-black text-gray-900 italic">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-wrap gap-4 items-center">
                            <div className="flex -space-x-4">
                                {order.items?.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white bg-gray-50 shadow-sm ring-1 ring-gray-100">
                                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                    </div>
                                ))}
                                {order.items?.length > 3 && (
                                    <div className="relative w-20 h-20 rounded-2xl bg-gray-50 border-4 border-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center text-xs font-black text-gray-400">
                                        +{order.items.length - 3}
                                    </div>
                                )}
                            </div>
                            <div className="hidden lg:block ml-4">
                                <p className="text-sm font-bold text-gray-900 leading-tight">
                                    {order.items?.[0]?.name}
                                    {order.items?.length > 1 && <span className="text-gray-400 ml-1">& {order.items.length - 1} others</span>}
                                </p>
                                <p className="text-[11px] text-gray-400 font-medium mt-1">Insured Express Shipping · Indian Rupee (INR)</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {order.order_status === 'processing' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCancelOrder(order.id);
                                    }}
                                    className="px-6 h-14 rounded-2xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center"
                                >
                                    Cancel
                                </button>
                            )}
                            {isEligibleForReturn(order) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onReturnOrder(order.id);
                                    }}
                                    className="px-6 h-14 rounded-2xl bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center"
                                >
                                    Return
                                </button>
                            )}
                            <button
                                onClick={() => onViewDetails(order)}
                                className="flex-1 md:flex-none h-14 px-10 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-900 text-[11px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3"
                            >
                                View Details
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
