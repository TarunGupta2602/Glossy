"use client";

import { HOME_CONTAINER, HOME_SECTION_Y, HOME_SURFACE_IVORY, HOME_SURFACE_EDGE } from "@/lib/siteLayout";
import { PROMO_LABEL } from "@/lib/promo";
import { useState } from "react";

export default function Newsletter({ variant = "section" }) {
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

    const form = (
        <form
            onSubmit={handleSubmit}
            className={
                variant === "footer"
                    ? "flex flex-col sm:flex-row items-stretch gap-2 max-w-md"
                    : "flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 max-w-xl mx-auto"
            }
        >
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={
                    variant === "footer"
                        ? "w-full flex-1 px-4 py-3 border border-gray-200 bg-white text-[14px] focus:outline-none focus:border-gray-900"
                        : "w-full flex-1 px-4 sm:px-5 py-3.5 border border-gray-200 bg-white text-base focus:outline-none focus:border-gray-900"
                }
                required
                autoComplete="email"
                inputMode="email"
            />
            <button
                type="submit"
                disabled={loading}
                className={
                    variant === "footer"
                        ? "w-full sm:w-auto px-5 py-3 min-h-11 bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-[#E91E63] transition-colors disabled:opacity-50"
                        : "w-full sm:w-auto px-6 py-3.5 min-h-12 bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-[#E91E63] transition-colors disabled:opacity-50"
                }
            >
                {loading ? "Joining..." : "Join the list"}
            </button>
        </form>
    );

    if (variant === "footer") {
        return (
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                    The list
                </p>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-3 max-w-sm">
                    Early access to new anti-tarnish drops and offers like {PROMO_LABEL}.
                </p>
                {form}
                {message && (
                    <p className="mt-2.5 text-[13px] text-gray-600" role="status">
                        {message}
                    </p>
                )}
            </div>
        );
    }

    return (
        <section className={`${HOME_SECTION_Y} ${HOME_SURFACE_IVORY} text-center ${HOME_SURFACE_EDGE}`}>
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

                {form}

                {message && (
                    <p className="mt-4 text-sm text-gray-600" role="status">
                        {message}
                    </p>
                )}
            </div>
        </section>
    );
}
