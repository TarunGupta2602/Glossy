"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../../context/AuthContext";

export default function EditCategoryPage({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== 'admin') {
                router.push("/admin");
            } else {
                fetchCategory();
            }
        }
    }, [id, user, profile, authLoading, router]);

    const fetchCategory = async () => {
        try {
            const response = await fetch(`/api/categories/${id}`);
            const data = await response.json();
            if (data.success) {
                setName(data.category.name);
                setImageUrl(data.category.image_url);
            } else {
                console.error("Error fetching category:", data.error);
                alert("Error fetching category");
                router.push("/admin/categories");
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        }
        setLoading(false);
    };

    const generateSlug = (text) => text.toLowerCase().replace(/\s+/g, "-");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            let finalImageUrl = imageUrl;

            // 1. Upload new image if provided
            if (imageFile) {
                // Optional: Delete old image if it exists
                if (imageUrl) {
                    const oldFileName = imageUrl.split("/").pop();
                    await supabase.storage.from("category-images").remove([oldFileName]);
                }

                const fileName = `category-${Date.now()}-${imageFile.name}`;
                await supabase.storage.from("category-images").upload(fileName, imageFile);
                const { data } = supabase.storage.from("category-images").getPublicUrl(fileName);
                finalImageUrl = data.publicUrl;
            }

            // 2. Update Category via API
            const res = await fetch(`/api/categories/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    slug: generateSlug(name),
                    image_url: finalImageUrl,
                }),
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error || "Failed to update category");

            alert("Category updated successfully 🚀");
            router.push("/admin/categories");
        } catch (err) {
            console.error(err);
            alert("Error updating category");
        }

        setIsUpdating(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                {authLoading ? "Verifying authorization..." : "Loading category data..."}
            </div>
        );
    }

    if (!user || profile?.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Categories
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-2xl font-bold mb-8">Edit Category</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Category Name</label>
                            <input
                                type="text"
                                placeholder="Category Name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Category Image</label>

                            <div className="mt-2 flex items-center space-x-4">
                                {imageUrl && (
                                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative">
                                        <Image src={imageUrl} alt="Current" fill sizes="80px" className="object-cover" />
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <input
                                        type="file"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#E91E63] hover:file:bg-pink-100 transition-all cursor-pointer"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                    />
                                    <p className="mt-2 text-xs text-gray-400">Leave empty to keep existing image</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                            {isUpdating ? "Updating..." : "Update Category"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
