"use client";

import Image from "next/image";

export default function OrderModal({ order, onClose, getStatusColor, onCancelOrder, onReturnOrder }) {
    if (!order) return null;

    const isEligibleForReturn = () => {
        if (order.order_status !== 'delivered') return false;
        const deliveryDate = new Date(order.delivered_at || order.created_at);
        const diffTime = Math.abs(new Date() - deliveryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    const isProcessing = order.order_status === 'processing';

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,0.2)] rounded-[40px]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 w-14 h-14 bg-white border border-gray-100 hover:border-gray-900 rounded-full flex items-center justify-center transition-all z-30 group shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Header Section */}
                    <div className="p-10 md:p-16 pt-20 bg-gray-50/50 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusColor(order.order_status).replace('bg-', 'border-').replace('100', '200')} ${getStatusColor(order.order_status)}`}>
                                        {order.order_status}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Received: {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                                    Dossier <span className="text-[#E91E63]">#{order.razorpay_order_id.split('_')[1] || order.id.slice(-6)}</span>
                                </h2>
                                <p className="text-gray-400 font-medium tracking-wide">A detailed manifest of your curated selections.</p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-1">Total Valuation</p>
                                <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{parseFloat(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 md:p-16">
                        {/* Items Section */}
                        <div className="space-y-10 mb-16">
                            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.4em] flex items-center gap-6">
                                The Collection
                                <div className="flex-1 h-[1px] bg-gray-100" />
                            </h4>
                            <div className="divide-y divide-gray-50">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-10 items-center py-8 group first:pt-0 last:pb-0">
                                        <div className="relative w-32 h-32 rounded-[32px] overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-xl shadow-gray-200/50 group-hover:-translate-y-2 transition-transform duration-500">
                                            <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-[9px] text-[#E91E63] font-black uppercase tracking-[0.2em]">{item.category}</p>
                                            <p className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{item.name}</p>
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                <span>Qty {item.quantity}</span>
                                                <div className="w-1 h-1 rounded-full bg-gray-200" />
                                                <p>₹{parseFloat(item.price).toLocaleString()}/ea</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Logistics & Payment */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="p-10 rounded-[40px] border border-gray-100 bg-gray-50/30">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Shipping Dossier</h4>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#E91E63] uppercase tracking-widest">Recipient</p>
                                        <p className="text-xl font-bold text-gray-900 tracking-tight">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                        <p className="text-xs font-bold text-gray-400 tracking-wide uppercase italic">{order.shipping_address.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#E91E63] uppercase tracking-widest">Dispatch Address</p>
                                        <p className="text-sm font-bold text-gray-800 leading-relaxed uppercase tracking-tight">
                                            {order.shipping_address.address}<br />
                                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 rounded-[40px] bg-gray-900 text-white flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Payment Settlement</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            <p className="text-2xl font-black italic tracking-widest uppercase italic">Captured</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Security Verification</p>
                                        <p className="text-xs font-medium tracking-widest uppercase opacity-60">Verified via Razorpay Secure Gateway</p>
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-4">
                                    {isProcessing && (
                                        <button
                                            onClick={() => onCancelOrder(order.id)}
                                            className="flex-1 h-16 rounded-full border border-white/10 hover:border-red-500 hover:text-red-500 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                                        >
                                            Request Halt
                                        </button>
                                    )}
                                    {isEligibleForReturn() && (
                                        <button
                                            onClick={() => onReturnOrder(order.id)}
                                            className="flex-1 h-16 rounded-full border border-white/10 hover:border-[#E91E63] hover:text-[#E91E63] text-white/60 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                                        >
                                            Request Return
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <div className="h-px w-20 bg-gray-100 mx-auto mb-8" />
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em]">The Luxe Jewels · Signature Concierge</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

