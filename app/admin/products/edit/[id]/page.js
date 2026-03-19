"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext";

export default function EditProductPage({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [mainImageUrl, setMainImageUrl] = useState("");
    const [newMainImage, setNewMainImage] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== 'admin') {
                router.push("/admin");
            } else {
                fetchData();
            }
        }
    }, [id, user, profile, authLoading, router]);

    const fetchData = async () => {
        setLoading(true);

        // 1. Fetch Categories
        const { data: cats } = await supabase.from("categories").select("*").order("name");
        setCategories(cats || []);

        // 2. Fetch Product
        const { data: product, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching product:", error);
            alert("Error fetching product");
            router.push("/admin/products");
        } else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description || "");
            setCategoryId(product.category_id);
            setMainImageUrl(product.main_image || "");
        }

        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            let finalMainImageUrl = mainImageUrl;

            // 1. Handle Main Image Update
            if (newMainImage) {
                // Optional: Delete old image
                if (mainImageUrl) {
                    const oldFileName = mainImageUrl.split("/").pop();
                    await supabase.storage.from("product-images").remove([`${id}/${oldFileName}`]);
                }

                const fileName = `${id}/main-${Date.now()}`;
                await supabase.storage.from("product-images").upload(fileName, newMainImage);
                const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
                finalMainImageUrl = data.publicUrl;
            }

            // 2. Update Product record
            const { error } = await supabase
                .from("products")
                .update({
                    name,
                    price,
                    description,
                    category_id: categoryId,
                    main_image: finalMainImageUrl,
                })
                .eq("id", id);

            if (error) throw error;

            alert("Product updated successfully 🚀");
            router.push("/admin/products");
        } catch (err) {
            console.error(err);
            alert("Error updating product");
        }

        setIsUpdating(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                {authLoading ? "Verifying authorization..." : "Loading Product Data..."}
            </div>
        );
    }

    if (!user || profile?.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/products" className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-6 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Inventory
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 overflow-hidden">
                    <h1 className="text-2xl font-bold mb-10 text-gray-900">Edit Product Listing</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Product Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Price (INR)</label>
                                <input
                                    type="number"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Category</label>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium appearance-none cursor-pointer"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description Area */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Description</label>
                            <textarea
                                rows="5"
                                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium resize-none shadow-inner"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Main Image Management */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Main Cover Image</label>
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border-2 border-dashed border-gray-100">
                                {mainImageUrl && (
                                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                                        <img src={mainImageUrl} alt="Current" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-grow w-full">
                                    <input
                                        type="file"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#E91E63] file:text-white hover:file:bg-[#D81B60] file:cursor-pointer transition-all"
                                        onChange={(e) => setNewMainImage(e.target.files[0])}
                                    />
                                    <p className="mt-3 text-[11px] text-gray-400 font-medium italic underline underline-offset-4 decoration-pink-100">
                                        Choosing a new file will automatically replace the existing cover image.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-gray-800 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                            >
                                {isUpdating ? "Syncing Changes..." : "Update Product Listing"}
                            </button>

                            <Link
                                href="/admin/products"
                                className="w-full text-center py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
                            >
                                Discard Edits
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
