"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductsListPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = localStorage.getItem("glossy_admin_logged_in");
        if (session !== "true") {
            router.push("/admin");
            return;
        }
        fetchProducts();
    }, [router]);

    const fetchProducts = async () => {
        setLoading(true);
        // Fetch products with their category name
        const { data, error } = await supabase
            .from("products")
            .select(`
        *,
        categories (
          name
        )
      `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id, mainImageUrl) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            // 1. Delete images from storage
            // Note: In a real app, you'd also want to delete 'otherImages' from product_images table and storage
            if (mainImageUrl) {
                const fileName = mainImageUrl.split("/").pop();
                await supabase.storage.from("product-images").remove([fileName]);
            }

            // 2. Delete product from database
            const { error } = await supabase.from("products").delete().eq("id", id);

            if (error) throw error;

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
                        <Link href="/admin" className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                    </div>
                    <Link
                        href="/admin/add-product"
                        className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No products found. Start by adding one!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Product</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {product.main_image ? (
                                                            <img src={product.main_image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
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
                                                    onClick={() => handleDelete(product.id, product.main_image)}
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
