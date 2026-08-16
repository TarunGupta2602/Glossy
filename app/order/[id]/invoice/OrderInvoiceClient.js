"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import OrderInvoice from "../../../components/OrderInvoice";
import { authFetch } from "@/lib/adminApi";

export default function OrderInvoiceClient() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace("/cart");
            return;
        }

        authFetch(`/api/orders/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setOrder(data.order);
            })
            .finally(() => setLoading(false));
    }, [id, user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <p className="text-gray-500 mb-6">Invoice not available.</p>
                <Link href="/profile" className="text-[#E91E63] font-semibold text-sm">Back to orders</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <OrderInvoice order={order} showActions />
            </div>
        </div>
    );
}
