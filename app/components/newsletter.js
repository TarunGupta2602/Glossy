"use client";

import { HOME_CONTAINER } from "@/lib/siteLayout";
import { PROMO_LABEL } from "@/lib/promo";
import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!email.includes("@")) {
            setMessage("Enter a valid email");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("You're on the list — welcome.");
                setEmail("");
            } else if (data.error === "Already subscribed") {
                setMessage("You're already subscribed.");
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Newsletter Subscription Error:", error);
            setMessage("Something went wrong. Please try again later.");
        }

        setLoading(false);
    }

    return (
        <section className="py-10 md:py-16 bg-gradient-to-b from-white to-[#faf7f8] text-center">
            <div className={HOME_CONTAINER}>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#E91E63] mb-2.5 md:mb-3 block">
                    The list
                </span>
                <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair font-bold text-gray-900 mb-2.5 md:mb-3 px-1">
                    Early access to drops & offers
                </h2>
                <p className="text-gray-500 text-sm sm:text-[15px] mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed px-1">
                    Be first to new anti-tarnish releases, exclusive gifting edits, and storewide offers like {PROMO_LABEL}.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 max-w-xl mx-auto"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full flex-1 px-4 sm:px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#E91E63]/25 focus:border-[#E91E63]/40"
                        required
                        autoComplete="email"
                        inputMode="email"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-3.5 min-h-12 rounded-xl bg-[#E91E63] text-white font-semibold hover:bg-[#c2185b] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Joining..." : "Join the list"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-sm text-gray-600" role="status">
                        {message}
                    </p>
                )}
            </div>
        </section>
    );
}
