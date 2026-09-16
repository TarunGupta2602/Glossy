"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";

/**
 * Paste reviews collected from WhatsApp / Instagram into the product page.
 */
export default function ReviewImportForm({ onImported }) {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        product_id: "",
        user_name: "",
        user_email: "",
        rating: "5",
        title: "",
        comment: "",
        source: "WhatsApp",
        is_approved: true,
    });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/products?lite=1");
                const data = await res.json();
                const list = data.products || data.data || [];
                if (!cancelled) setProducts(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoadingProducts(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await adminFetch("/api/reviews/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    rating: Number(form.rating),
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Import failed");
            alert("Review imported");
            setForm((f) => ({
                ...f,
                user_name: "",
                user_email: "",
                title: "",
                comment: "",
            }));
            onImported?.();
        } catch (err) {
            alert(err.message || "Failed to import review");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl border border-pink-100 bg-gradient-to-br from-[#FFF5F8] to-white p-6 space-y-4"
        >
            <div>
                <h2 className="text-lg font-bold text-gray-900">Import review</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Paste feedback from WhatsApp / Instagram. Approved imports show on the product
                    page immediately.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Product *
                    </label>
                    <select
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                        value={form.product_id}
                        onChange={(e) => update("product_id", e.target.value)}
                        disabled={loadingProducts}
                    >
                        <option value="">Select product…</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Source
                    </label>
                    <select
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                        value={form.source}
                        onChange={(e) => update("source", e.target.value)}
                    >
                        <option>WhatsApp</option>
                        <option>Instagram</option>
                        <option>Offline / Store</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Customer name *
                    </label>
                    <input
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                        value={form.user_name}
                        onChange={(e) => update("user_name", e.target.value)}
                        placeholder="e.g. Ananya"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Rating *
                    </label>
                    <select
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                        value={form.rating}
                        onChange={(e) => update("rating", e.target.value)}
                    >
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                                {n} star{n === 1 ? "" : "s"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Review text *
                </label>
                <textarea
                    required
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-y"
                    value={form.comment}
                    onChange={(e) => update("comment", e.target.value)}
                    placeholder="Paste the customer’s message…"
                />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={form.is_approved}
                    onChange={(e) => update("is_approved", e.target.checked)}
                />
                Publish immediately (approved)
            </label>

            <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center rounded-xl bg-[#E91E63] px-5 text-sm font-semibold text-white hover:bg-[#c2185b] disabled:opacity-50"
            >
                {saving ? "Saving…" : "Import review"}
            </button>
        </form>
    );
}
