"use client";

import Link from "next/link";
import { BRAND_NAME, SUPPORT_EMAIL, SUPPORT_PHONE, BUSINESS_HOURS } from "@/lib/constants";
import { formatInr, getInvoiceNumber, getInvoiceTotals } from "@/lib/invoice";

export default function OrderInvoice({ order, showActions = true }) {
    if (!order) return null;

    const invoiceNumber = getInvoiceNumber(order);
    const { subtotal, discount, shipping, total } = getInvoiceTotals(order);
    const address = order.shipping_address || {};
    const customerName = [address.firstName, address.lastName].filter(Boolean).join(" ") || "Customer";
    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handlePrint = () => window.print();

    return (
        <div className="invoice-root">
            {showActions && (
                <div className="invoice-actions no-print flex flex-wrap gap-3 mb-6">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold tracking-widest uppercase hover:bg-black transition-colors"
                    >
                        Print / Save PDF
                    </button>
                    <Link
                        href="/profile"
                        className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold tracking-widest uppercase text-gray-700 hover:border-gray-900 transition-colors"
                    >
                        My orders
                    </Link>
                </div>
            )}

            <div className="invoice-sheet bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm print:shadow-none print:border-gray-300">
                <div className="p-8 md:p-10 border-b border-gray-100 bg-gradient-to-r from-[#FFF5F8] to-white">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#E91E63] mb-2">THE</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
                                Luxe <span className="font-light text-gray-500">Jewels</span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-2">Tax Invoice / Payment Receipt</p>
                        </div>
                        <div className="text-left md:text-right text-sm">
                            <p className="font-bold text-gray-900 text-lg">{invoiceNumber}</p>
                            <p className="text-gray-500 mt-1">Date: {orderDate}</p>
                            <p className="mt-3 inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wide border border-emerald-100">
                                Paid
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Bill to</p>
                        <p className="font-semibold text-gray-900">{customerName}</p>
                        {address.email && <p className="text-sm text-gray-600 mt-1">{address.email}</p>}
                        {address.phone && <p className="text-sm text-gray-600">{address.phone}</p>}
                        {address.address && (
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                {address.address}
                                <br />
                                {address.city}, {address.state} {address.pincode}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Payment details</p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">Method:</span> Online (Razorpay)
                        </p>
                        {order.razorpay_payment_id && (
                            <p className="text-sm text-gray-700 mt-1 break-all">
                                <span className="font-semibold text-gray-900">Payment ID:</span> {order.razorpay_payment_id}
                            </p>
                        )}
                        {order.razorpay_order_id && (
                            <p className="text-sm text-gray-700 mt-1 break-all">
                                <span className="font-semibold text-gray-900">Order ref:</span> {order.razorpay_order_id}
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-8 md:p-10">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                <th className="pb-3 pr-4">Item</th>
                                <th className="pb-3 pr-4 text-center w-16">Qty</th>
                                <th className="pb-3 pr-4 text-right w-28">Rate</th>
                                <th className="pb-3 text-right w-28">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.items || []).map((item, idx) => {
                                const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
                                return (
                                    <tr key={`${item.id}-${idx}`} className="border-b border-gray-50">
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.category || "Jewellery"}
                                                {item.isFreeGift && " · Complimentary gift"}
                                            </p>
                                        </td>
                                        <td className="py-4 pr-4 text-center text-gray-700">{item.quantity || 1}</td>
                                        <td className="py-4 pr-4 text-right text-gray-700">
                                            {item.isFreeGift ? "—" : formatInr(item.price)}
                                        </td>
                                        <td className="py-4 text-right font-semibold text-gray-900">
                                            {item.isFreeGift ? "FREE" : formatInr(lineTotal)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="mt-8 ml-auto max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatInr(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-700">
                                <span>Discount</span>
                                <span>-{formatInr(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? "FREE" : formatInr(shipping)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                            <span>Total paid</span>
                            <span className="text-[#E91E63]">{formatInr(total)}</span>
                        </div>
                    </div>
                </div>

                <div className="px-8 md:px-10 py-6 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
                    <p className="font-semibold text-gray-700 mb-1">{BRAND_NAME}</p>
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                    <p className="mt-2">
                        Questions? {SUPPORT_EMAIL} · {SUPPORT_PHONE} · {BUSINESS_HOURS}
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .invoice-root,
                    .invoice-root * {
                        visibility: visible;
                    }
                    .invoice-root {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .invoice-sheet {
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
