"use client";

import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // simple validation
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
                setMessage("Subscribed successfully 🎉");
                setEmail("");
            } else {
                if (data.error === "Already subscribed") {
                    setMessage("You are already subscribed!");
                } else {
                    setMessage("Something went wrong");
                }
            }
        } catch (error) {
            console.error("Newsletter Subscription Error:", error);
            setMessage("Something went wrong. Please try again later.");
        }

        setLoading(false);
    }

    return (
        <section className="py-10 md:py-14 bg-white text-center">
            <div className="w-full px-4 md:px-6">

                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                    Join The luxe jewels List
                </h2>

                <p className="text-gray-500 text-[15px] mb-8 max-w-xl mx-auto">
                    Sign up for early access to our anti-tarnish jewelry drops,
                    exclusive offers, and new handcrafted fine jewelry collections.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex items-center justify-center gap-3 max-w-xl mx-auto"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-[#f7f7f7]"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-[#0f172a] text-white font-semibold disabled:opacity-50"
                    >
                        {loading ? "Joining..." : "Join"}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p className="mt-4 text-sm text-gray-600">
                        {message}
                    </p>
                )}

            </div>
        </section>
    );
}