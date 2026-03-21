"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminOrdersPage() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

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

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== 'admin') {
                router.push("/admin");
            } else {
                fetchOrders();
            }
        }
    }, [user, profile, authLoading, router]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/orders");
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                console.error("Error fetching orders:", data.error);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
        setLoading(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                Verifying authorization...
            </div>
        );
    }

    if (!user || profile?.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin" className="p-2 hover:bg-white rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No orders found.</td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {new Date(order.created_at).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-black text-gray-900">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.order_status)}`}>
                                                        {order.order_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-900 font-bold">
                                                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-medium">{order.contact_phone}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-xs font-bold text-[#E91E63] hover:text-[#D81B60] transition-colors"
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>

                            <h2 className="text-2xl font-black text-gray-900 mb-8">Order Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Razorpay Order ID</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.razorpay_order_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Razorpay Payment ID</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.razorpay_payment_id}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Phone</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.contact_phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Status</p>
                                        <select
                                            disabled={updatingStatus}
                                            value={selectedOrder.order_status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                setUpdatingStatus(true);
                                                try {
                                                    const response = await fetch("/api/orders", {
                                                        method: "PATCH",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            id: selectedOrder.id,
                                                            order_status: newStatus
                                                        }),
                                                    });
                                                    const data = await response.json();

                                                    if (data.success) {
                                                        setSelectedOrder({ ...selectedOrder, order_status: newStatus });
                                                        fetchOrders();
                                                    } else {
                                                        alert("Failed to update status: " + data.error);
                                                    }
                                                } catch (error) {
                                                    console.error("Update Error:", error);
                                                    alert("An error occurred while updating status");
                                                }
                                                setUpdatingStatus(false);
                                            }}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none border-none cursor-pointer ${getStatusColor(selectedOrder.order_status)}`}
                                        >
                                            <option value="processing">Processing</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="out for delivery">Out for Delivery</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="return requested">Return Requested</option>
                                            <option value="returned">Returned</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ordered Items</p>
                                <div className="space-y-4">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No item details available for this order.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Address</p>
                                <div className="space-y-1 text-sm text-gray-900">
                                    <p className="font-bold">{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                                    <p>{selectedOrder.shipping_address.address}</p>
                                    <p>{selectedOrder.shipping_address.city}</p>
                                    <p className="mt-2 font-semibold">Phone: {selectedOrder.shipping_address.phone}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-[#E91E63] text-white p-6 rounded-2xl">
                                <span className="text-sm font-bold tracking-widest uppercase">Total Amount Paid</span>
                                <span className="text-2xl font-black">₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
