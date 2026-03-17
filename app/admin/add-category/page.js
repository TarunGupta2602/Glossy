"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddCategoryPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check session on mount
    useEffect(() => {
        const session = localStorage.getItem("glossy_admin_logged_in");
        if (session !== "true") {
            router.push("/admin");
        }
    }, [router]);

    // slug generator
    const generateSlug = (text) =>
        text.toLowerCase().replace(/\s+/g, "-");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";

            // 1. Upload Image
            if (image) {
                const fileName = `category-${Date.now()}-${image.name}`;

                await supabase.storage
                    .from("category-images")
                    .upload(fileName, image);

                const { data } = supabase.storage
                    .from("category-images")
                    .getPublicUrl(fileName);

                imageUrl = data.publicUrl;
            }

            // 2. Insert Category
            const { error } = await supabase.from("categories").insert([
                {
                    name,
                    slug: generateSlug(name),
                    image_url: imageUrl,
                },
            ]);

            if (error) throw error;

            alert("Category added successfully 🚀");
            router.push("/admin/categories");
        } catch (err) {
            console.error(err);
            alert("Error adding category");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-xl mx-auto">
                <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Categories
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-2xl font-bold mb-8">Add New Category</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Category Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Earrings"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Category Image</label>
                            <input
                                type="file"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#E91E63] hover:file:bg-pink-100 transition-all cursor-pointer"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? "Uploading..." : "Add Category"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}