"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("contacts").insert([
            {
                name: form.name,
                email: form.email,
                message: form.message,
            },
        ]);

        if (error) {
            console.error(error);
            alert("Something went wrong!");
        } else {
            setSuccess(true);
            setForm({ name: "", email: "", message: "" });
        }

        setLoading(false);
    };

    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                        Contact Us
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Have a question? We'd love to hear from you.
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <p className="text-green-600 text-center mb-6">
                        ✅ Message sent successfully!
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                    />

                    <textarea
                        name="message"
                        placeholder="Your message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-black text-white rounded-xl font-medium hover:opacity-90 transition"
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>

                </form>

                {/* Info */}
                <div className="mt-10 text-center text-sm text-gray-500">
                    <p>Email: support@glossy.com</p>
                </div>

            </div>
        </section>
    );
}