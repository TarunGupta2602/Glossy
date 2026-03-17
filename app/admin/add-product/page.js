"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProductPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");

    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);

    const [loading, setLoading] = useState(false);

    // Check session on mount
    useEffect(() => {
        const session = localStorage.getItem("glossy_admin_logged_in");
        if (session !== "true") {
            router.push("/admin");
        }
    }, [router]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from("categories").select("*").order("name");
            setCategories(data || []);
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert product
            const { data: product, error } = await supabase
                .from("products")
                .insert([
                    {
                        name,
                        price,
                        description,
                        category_id: categoryId,
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            // 2. Upload main image
            if (mainImage) {
                const fileName = `${product.id}/main-${Date.now()}`;
                await supabase.storage.from("product-images").upload(fileName, mainImage);
                const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);

                await supabase.from("products").update({ main_image: data.publicUrl }).eq("id", product.id);
            }

            // 3. Upload other images
            for (let file of otherImages) {
                const fileName = `${product.id}/${Date.now()}-${file.name}`;
                await supabase.storage.from("product-images").upload(fileName, file);
                const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);

                await supabase.from("product_images").insert([
                    {
                        product_id: product.id,
                        image_url: data.publicUrl,
                    },
                ]);
            }

            alert("Product added successfully 🚀");
            router.push("/admin/products");
        } catch (err) {
            console.error(err);
            alert("Error adding product");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/products" className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-2xl font-bold mb-8 text-gray-900">Add New Product</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Elegant Diamond Studs"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Price ($)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Category</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all bg-white"
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

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Description</label>
                            <textarea
                                placeholder="Describe the product..."
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Images Section */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Main Display Image</label>
                                <input
                                    type="file"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#E91E63] hover:file:bg-pink-100 transition-all cursor-pointer"
                                    onChange={(e) => setMainImage(e.target.files[0])}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Gallery Images (Multiple)</label>
                                <input
                                    type="file"
                                    multiple
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all cursor-pointer"
                                    onChange={(e) => setOtherImages([...e.target.files])}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 mt-4"
                        >
                            {loading ? "Creating Listing..." : "Add Product to Store"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}