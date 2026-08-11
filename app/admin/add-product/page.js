"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { adminFetch } from "@/lib/adminApi";
import { getProductFormAutofill } from "@/lib/productDefaults";

export default function AddProductPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");
    const [imageAlt, setImageAlt] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [isBestseller, setIsBestseller] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [material, setMaterial] = useState("");
    const [plating, setPlating] = useState("");
    const [careInstructions, setCareInstructions] = useState("");
    const [stockCount, setStockCount] = useState("");
    const [weight, setWeight] = useState("");
    const [sizeInfo, setSizeInfo] = useState("");

    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleAutofill = () => {
        if (!name.trim() || !price) {
            alert("Enter Product Name and Price first — autofill uses them to suggest the best values.");
            return;
        }
        const categoryName = categories.find((c) => c.id === categoryId)?.name || "";
        const { values, filled, kind } = getProductFormAutofill(
            {
                name,
                price,
                description,
                material,
                plating,
                careInstructions,
                weight,
                sizeInfo,
                stockCount,
                originalPrice,
                isBestseller,
                isNew,
            },
            categoryName
        );

        if (!filled.length) {
            alert("All detail fields already look filled.");
            return;
        }

        if (values.originalPrice != null && !originalPrice) setOriginalPrice(values.originalPrice);
        if (values.stockCount != null && stockCount === "") setStockCount(values.stockCount);
        if (values.material && !material) setMaterial(values.material);
        if (values.plating && !plating) setPlating(values.plating);
        if (values.careInstructions && !careInstructions) setCareInstructions(values.careInstructions);
        if (values.weight && !weight) setWeight(values.weight);
        if (values.sizeInfo && !sizeInfo) setSizeInfo(values.sizeInfo);
        if (values.description && !description.trim()) setDescription(values.description);
        if (values.isNew === true) setIsNew(true);
        if (values.isBestseller === true) setIsBestseller(true);

        alert(
            `Filled: ${filled.join(", ")}\n\nDetected type: ${kind}\nReview the values, then save.`
        );
    };

    // Check session on mount
    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== 'admin') {
                router.push("/admin");
            } else {
                fetchCategories();
            }
        }
    }, [user, profile, authLoading, router]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await adminFetch("/api/categories");
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert product record via API
            const productRes = await adminFetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price,
                    description,
                    category_id: categoryId,
                    meta_title: metaTitle,
                    meta_description: metaDescription,
                    meta_keywords: metaKeywords,
                    image_alt: imageAlt,
                    original_price: originalPrice ? parseFloat(originalPrice) : null,
                    is_bestseller: isBestseller,
                    is_new: isNew,
                    material: material || null,
                    plating: plating || null,
                    care_instructions: careInstructions || null,
                    stock_count: stockCount !== "" ? parseInt(stockCount, 10) : null,
                    weight: weight || null,
                    size_info: sizeInfo || null,
                }),
            });
            const productData = await productRes.json();

            if (!productData.success) throw new Error(productData.error || "Failed to create product");
            const product = productData.product;

            let finalMainImageUrl = "";

            // 2. Upload main image via server-side API (bypasses client StorageApiError)
            if (mainImage) {
                const formData = new FormData();
                formData.append("file", mainImage);
                formData.append("path", `${product.id}/main-${Date.now()}`);

                const uploadRes = await adminFetch("/api/products/upload", {
                    method: "POST",
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                if (!uploadData.success) throw new Error(uploadData.error || "Failed to upload main image");

                finalMainImageUrl = uploadData.url;

                // Update product with main image via API
                await adminFetch(`/api/products/${product.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ main_image: finalMainImageUrl }),
                });
            }

            // 3. Upload other images
            const imageObjects = [];
            for (let file of otherImages) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("path", `${product.id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`);

                const uploadRes = await adminFetch("/api/products/upload", {
                    method: "POST",
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                if (!uploadData.success) throw new Error(uploadData.error || "Failed to upload gallery image");

                imageObjects.push({
                    product_id: product.id,
                    image_url: uploadData.url,
                });
            }

            // Save gallery images via API
            if (imageObjects.length > 0) {
                const galleryRes = await adminFetch("/api/admin/product-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(imageObjects),
                });
                const galleryData = await galleryRes.json();
                if (!galleryData.success) throw new Error(galleryData.error || "Failed to save gallery images");
            }

            alert("Product added successfully 🚀");
            router.push("/admin/products");
        } catch (err) {
            console.error(err);
            alert("Error adding product");
        }

        setLoading(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                Verifying authorization...
            </div>
        );
    }

    if (!user || profile?.role !== 'admin') return null;

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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                        <button
                            type="button"
                            onClick={handleAutofill}
                            className="px-4 py-2.5 text-sm font-bold rounded-xl border border-gray-200 bg-white text-gray-800 hover:border-[#E91E63] hover:text-[#E91E63] transition-all"
                        >
                            Auto-fill empty fields
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 -mt-4 mb-8">
                        Enter name, price, and category, then click Auto-fill for MRP, stock, material, plating, care, weight, and size.
                    </p>

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
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Price (₹)</label>
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

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Original Price (MRP)</label>
                                <input
                                    type="number"
                                    placeholder="Leave empty if no discount"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Stock Count</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Optional"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                    value={stockCount}
                                    onChange={(e) => setStockCount(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2 flex flex-wrap gap-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />
                                    Best Seller
                                </label>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                                    New Arrival
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Material</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Brass, Recycled Silver"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Plating</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 18k Gold Plated"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                    value={plating}
                                    onChange={(e) => setPlating(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Care Instructions</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Avoid harsh chemicals"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                    value={careInstructions}
                                    onChange={(e) => setCareInstructions(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Weight</label>
                                <input type="text" placeholder="e.g. 4g per pair" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] outline-none transition-all" value={weight} onChange={(e) => setWeight(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Size</label>
                                <input type="text" placeholder="e.g. 1.2 cm diameter" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] outline-none transition-all" value={sizeInfo} onChange={(e) => setSizeInfo(e.target.value)} />
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

                        {/* SEO Section */}
                        <div className="pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 px-1">SEO Optimization</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Meta Title</label>
                                    <input
                                        type="text"
                                        placeholder="SEO Title (e.g. Elegant Diamond Studs | The Luxe Jewels)"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Meta Description</label>
                                    <textarea
                                        placeholder="Brief description for search engines..."
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-none"
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Meta Keywords</label>
                                    <input
                                        type="text"
                                        placeholder="jewellery, diamond, luxury..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                        value={metaKeywords}
                                        onChange={(e) => setMetaKeywords(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Main Image Alt Text</label>
                                    <input
                                        type="text"
                                        placeholder="Description of the main image..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                                        value={imageAlt}
                                        onChange={(e) => setImageAlt(e.target.value)}
                                    />
                                </div>
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