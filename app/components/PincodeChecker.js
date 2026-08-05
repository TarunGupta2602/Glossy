"use client";

import { useState } from "react";

export default function PincodeChecker() {
    const [pincode, setPincode] = useState("");
    const [result, setResult] = useState(null);

    const checkDelivery = (e) => {
        e.preventDefault();
        const cleaned = pincode.replace(/\D/g, "").slice(0, 6);
        setPincode(cleaned);

        if (cleaned.length !== 6) {
            setResult({ ok: false, message: "Please enter a valid 6-digit Indian pincode." });
            return;
        }

        setResult({
            ok: true,
            message: "Delivery available to your area. Estimated arrival in 3–5 business days.",
        });
    };

    return (
        <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-100">
            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight mb-2">
                Check Delivery
            </p>
            <form onSubmit={checkDelivery} className="flex gap-2">
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1 px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white focus:outline-none focus:border-[#E91E63]"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                    Check
                </button>
            </form>
            {result && (
                <p className={`mt-2 text-xs font-medium ${result.ok ? "text-green-700" : "text-red-600"}`}>
                    {result.message}
                </p>
            )}
        </div>
    );
}
