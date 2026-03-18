"use client";

export default function OrderModal({ order, onClose, getStatusColor }) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[50px] w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-10 right-10 w-12 h-12 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-full flex items-center justify-center transition-all z-20 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-10 md:p-14 pt-16 md:pt-20 bg-gradient-to-b from-gray-50 to-white">
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${getStatusColor(order.order_status)}`}>
                                Order {order.order_status}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4 italic">#{order.razorpay_order_id.split('_')[1]}</h2>
                        <p className="text-gray-400 font-medium text-lg">Detailed manifest of your selected acquisitions.</p>
                    </div>

                    <div className="p-10 md:p-14 pt-0">
                        <div className="space-y-8 mb-16">
                            <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                                Atelier Selects
                                <div className="flex-1 h-px bg-gray-100" />
                            </h4>
                            <div className="grid grid-cols-1 gap-6">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-8 items-center group p-4 rounded-[28px] hover:bg-gray-50 transition-colors">
                                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm border border-gray-100">
                                            <img src={item.image} alt={item.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[10px] text-[#E91E63] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{item.category}</p>
                                            <p className="text-xl font-bold text-gray-900 leading-tight">{item.name}</p>
                                            <p className="text-[11px] text-gray-400 font-medium italic">Quantity ({item.quantity})</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900 tracking-tight">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-[40px] p-12 text-white relative overflow-hidden">
                            <div className="relative z-10 grid grid-cols-2 gap-12">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em]">Total Value</p>
                                    <p className="text-4xl font-black italic tracking-tighter">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1 border-l border-white/10 pl-12">
                                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em]">Payment Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <p className="text-xl font-black uppercase tracking-widest">SUCCESSFUL</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Thank you for your trust in GLOSSY. Fine Jewelry</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
