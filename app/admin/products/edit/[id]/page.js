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
    const [galleryImages, setGalleryImages] = useState([]);
    const [newGalleryImages, setNewGalleryImages] = useState([]);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");
    const [imageAlt, setImageAlt] = useState("");

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. Handle Authentication Redirect
    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== 'admin')) {
            router.push("/admin");
        }
    }, [user, profile, authLoading, router]);

    // 2. Handle Initial Data Fetch (Only once or if ID changes)
    useEffect(() => {
        if (!authLoading && user && profile?.role === 'admin') {
            fetchData();
        }
    }, [id]); // Only refetch if the product ID changes

    const fetchData = async () => {
        setLoading(true);

        try {
            // 1. Fetch Categories
            const catRes = await fetch("/api/categories");
            const catData = await catRes.json();
            if (catData.success) {
                setCategories(catData.categories || []);
            }

            // 2. Fetch Product
            const prodRes = await fetch(`/api/products/${id}`);
            const prodData = await prodRes.json();

            if (!prodData.success) {
                console.error("Error fetching product:", prodData.error);
                alert("Error fetching product");
                router.push("/admin/products");
            } else {
                const product = prodData.product;
                setName(product.name);
                setPrice(product.price);
                setDescription(product.description || "");
                setCategoryId(product.category_id);
                setMainImageUrl(product.main_image || "");
                setGalleryImages(prodData.galleryImages || []);
                setMetaTitle(product.meta_title || "");
                setMetaDescription(product.meta_description || "");
                setMetaKeywords(product.meta_keywords || "");
                setImageAlt(product.image_alt || "");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Unexpected error occurred while fetching product data.");
        }

        setLoading(false);
    };

    const handleDeleteGalleryImage = async (imgId) => {
        if (!confirm("Are you sure you want to delete this gallery image?")) return;

        const imgToDelete = galleryImages.find(img => img.id === imgId);
        if (!imgToDelete) return;

        try {
            // 1. Optional: Delete from storage
            const urlParts = imgToDelete.image_url.split('/product-images/');
            if (urlParts.length > 1) {
                const storagePath = urlParts[1];
                await supabase.storage.from("product-images").remove([storagePath]);
            }

            // 2. Delete from database
            const res = await fetch("/api/admin/product-images", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: imgId }),
            });
            const data = await res.json();
            if (data.success) {
                setGalleryImages(prev => prev.filter(img => img.id !== imgId));
            } else {
                throw new Error(data.error || "Failed to delete image");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Error deleting gallery image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            let finalMainImageUrl = mainImageUrl;

            // 1. Handle Main Image Update
            if (newMainImage) {
                if (mainImageUrl) {
                    const urlParts = mainImageUrl.split('/product-images/');
                    if (urlParts.length > 1) {
                        const oldPath = urlParts[1];
                        await supabase.storage.from("product-images").remove([oldPath]);
                    }
                }

                const fileName = `${id}/main-${Date.now()}`;
                const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, newMainImage);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
                finalMainImageUrl = data.publicUrl;
            }

            // 2. Update Product record via API
            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    description,
                    category_id: categoryId,
                    main_image: finalMainImageUrl,
                    meta_title: metaTitle,
                    meta_description: metaDescription,
                    meta_keywords: metaKeywords,
                    image_alt: imageAlt,
                }),
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error || "Failed to update product");

            // 3. Handle NEW Gallery Images
            if (newGalleryImages.length > 0) {
                const imageObjects = [];
                for (let file of newGalleryImages) {
                    const fileName = `${id}/gallery-${Date.now()}-${file.name}`;
                    const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
                    if (uploadError) throw uploadError;

                    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
                    imageObjects.push({
                        product_id: id,
                        image_url: data.publicUrl
                    });
                }

                if (imageObjects.length > 0) {
                    const galleryRes = await fetch("/api/admin/product-images", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(imageObjects),
                    });
                    const galleryData = await galleryRes.json();
                    if (!galleryData.success) throw new Error(galleryData.error || "Failed to save new gallery images");
                }
            }

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
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">Main Cover Image</label>
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
                                    <p className="mt-3 text-[11px] text-gray-400 font-medium italic">
                                        Replacing this replaces the primary thumbnail shown in the shop.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Management */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Product Gallery</label>

                            {/* Existing Gallery Images */}
                            {galleryImages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {galleryImages.map((img) => (
                                        <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                                            <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGalleryImage(img.id)}
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add New Gallery Images */}
                            <div className="p-4 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                                <div className="flex flex-col items-center gap-3">
                                    <input
                                        type="file"
                                        multiple
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 file:cursor-pointer transition-all"
                                        onChange={(e) => setNewGalleryImages(Array.from(e.target.files))}
                                    />
                                    <p className="text-[11px] text-gray-400 font-medium">Add more images to the product slider (Multiple files allowed)</p>
                                </div>
                                {newGalleryImages.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {newGalleryImages.map((file, idx) => (
                                            <span key={idx} className="bg-white px-2 py-1 rounded-md text-[10px] text-gray-500 border border-gray-100 truncate max-w-[100px]">
                                                {file.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="pt-10 border-t border-gray-100">
                            <h2 className="text-xl font-bold mb-8 text-gray-900 px-1">SEO Optimization</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Meta Title</label>
                                    <input
                                        type="text"
                                        placeholder="SEO Title (e.g. Elegant Diamond Studs | The Luxe Jewels)"
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium"
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Meta Description</label>
                                    <textarea
                                        placeholder="Brief description for search engines..."
                                        rows="3"
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium resize-none shadow-inner"
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Meta Keywords</label>
                                    <input
                                        type="text"
                                        placeholder="jewelry, diamond, luxury..."
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium"
                                        value={metaKeywords}
                                        onChange={(e) => setMetaKeywords(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Main Image Alt Text</label>
                                    <input
                                        type="text"
                                        placeholder="Description of the main image..."
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#E91E63] focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium"
                                        value={imageAlt}
                                        onChange={(e) => setImageAlt(e.target.value)}
                                    />
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
