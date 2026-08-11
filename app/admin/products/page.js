"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { adminFetch } from "@/lib/adminApi";

export default function ProductsListPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autofilling, setAutofilling] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== "admin") {
                router.push("/admin");
            } else {
                fetchProducts();
            }
        }
    }, [user, profile, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                Verifying authorization...
            </div>
        );
    }

    if (!user || profile?.role !== "admin") return null;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
            if (data.success) {
                setProducts(data.products || []);
            } else {
                console.error("Error fetching products:", data.error);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    const isSparse = (product) =>
        !product.material ||
        !product.plating ||
        !product.care_instructions ||
        !product.weight ||
        !product.size_info ||
        product.stock_count == null ||
        product.original_price == null;

    const sparseCount = products.filter(isSparse).length;

    const handleAutofillAll = async () => {
        const ok = confirm(
            [
                "Auto-fill empty fields on all products?",
                "",
                "Will fill only blanks:",
                "• MRP (~1.5× price)",
                "• Stock (30)",
                "• Material, plating, care",
                "• Weight & size (by product type)",
                "• New Arrival (if under ~45 days old)",
                "• Best Seller (only if name says bestseller)",
                "• Missing SEO fields",
                "",
                "Existing values are never overwritten.",
                sparseCount ? `\n${sparseCount} product(s) look incomplete.` : "",
            ].join("\n")
        );
        if (!ok) return;

        setAutofilling(true);
        try {
            const res = await adminFetch("/api/products/autofill", { method: "POST" });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Autofill failed");

            const lines = [
                `Scanned: ${data.scanned}`,
                `Updated: ${data.updated}`,
                `Already complete: ${data.skipped}`,
            ];
            if (data.note) {
                lines.push("", data.note);
            }
            if (data.changes?.length) {
                lines.push("", "Examples:");
                data.changes.slice(0, 10).forEach((c) => {
                    lines.push(`• ${c.name}: ${c.filled.join(", ")}`);
                });
                if (data.changes.length > 10) {
                    lines.push(`…and ${data.changes.length - 10} more`);
                }
            }
            if (data.failures?.length) {
                lines.push("", `Failed: ${data.failures.length}`);
                const uniqueErrors = [...new Set(data.failures.map((f) => f.error))];
                uniqueErrors.slice(0, 5).forEach((err) => {
                    lines.push(`• ${err}`);
                });
                const sample = data.failures[0];
                if (sample?.name) {
                    lines.push(`(e.g. ${sample.name})`);
                }
            }
            alert(lines.join("\n"));
            await fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Error: " + (err.message || "Autofill failed"));
        }
        setAutofilling(false);
    };

    const handleDelete = async (id, mainImageUrl) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            if (mainImageUrl) {
                await adminFetch("/api/products/upload", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl: mainImageUrl }),
                });
            }

            const res = await adminFetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error || "Failed to delete product");

            alert("Product deleted successfully");
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Error deleting product");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <Link
                            href="/admin"
                            className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {products.length} product{products.length !== 1 ? "s" : ""}
                            {sparseCount > 0 ? (
                                <span className="text-amber-600 font-medium">
                                    {" "}
                                    · {sparseCount} missing detail fields
                                </span>
                            ) : null}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleAutofillAll}
                            disabled={autofilling || loading || products.length === 0}
                            className="px-5 py-3 bg-white border border-gray-200 text-gray-800 font-bold rounded-xl hover:border-[#E91E63] hover:text-[#E91E63] transition-all disabled:opacity-50"
                        >
                            {autofilling ? "Auto-filling…" : "Auto-fill empty fields"}
                        </button>
                        <Link
                            href="/admin/add-product"
                            className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Product
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No products found. Start by adding one!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                            Category
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {product.main_image ? (
                                                            <div className="relative w-full h-full">
                                                                <Image
                                                                    src={product.main_image}
                                                                    alt={product.name}
                                                                    fill
                                                                    sizes="64px"
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-8 w-8"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                                            {product.name}
                                                            {isSparse(product) && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                                                                    Incomplete
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {product.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {product.categories?.name || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                ₹{product.price}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(product.id, product.main_image)
                                                    }
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
