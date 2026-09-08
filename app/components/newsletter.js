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
        <section className="py-14 md:py-20 bg-white text-center border-t border-gray-100">
            <div className={HOME_CONTAINER}>
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-3">
                    The list
                </p>
                <h2 className="text-3xl sm:text-4xl font-playfair font-medium text-gray-900 mb-3 tracking-tight">
                    Early access to drops
                </h2>
                <p className="text-gray-500 text-[15px] mb-8 max-w-md mx-auto leading-relaxed">
                    Be first to new anti-tarnish releases and offers like {PROMO_LABEL}.
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
                        className="w-full flex-1 px-4 sm:px-5 py-3.5 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-900"
                        required
                        autoComplete="email"
                        inputMode="email"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-3.5 min-h-12 bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-[#E91E63] transition-colors disabled:opacity-50"
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
