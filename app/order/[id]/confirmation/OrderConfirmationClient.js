"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import OrderInvoice from "../../../components/OrderInvoice";
import { authFetch } from "@/lib/adminApi";

export default function OrderConfirmationClient() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace("/cart");
            return;
        }

        async function loadOrder() {
            try {
                const res = await authFetch(`/api/orders/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Could not load order");
                    return;
                }

                setOrder(data.order);
            } catch {
                setError("Could not load order");
            } finally {
                setLoading(false);
            }
        }

        loadOrder();
    }, [id, user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Order not found</h1>
                <p className="text-gray-500 mb-8 text-sm">{error || "This order could not be loaded."}</p>
                <Link href="/profile" className="text-[#E91E63] font-semibold text-sm hover:underline">
                    Go to my orders →
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 no-print">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payment successful</h1>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Thank you for your order. Your invoice is below — save or print it for your records.
                    </p>
                </div>

                <OrderInvoice order={order} showActions />

                <div className="no-print mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/shop"
                        className="px-8 py-3.5 rounded-xl bg-[#E91E63] text-white text-sm font-bold tracking-widest uppercase hover:bg-[#C2185B] transition-colors"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
