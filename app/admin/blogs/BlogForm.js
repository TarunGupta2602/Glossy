"use client";

import { useState } from "react";
import Image from "next/image";

export default function BlogForm({ initialData, onSubmit, submitLabel = "Publish Blog Post" }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [author, setAuthor] = useState(initialData?.author || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [datePosted, setDatePosted] = useState(initialData?.date_posted || new Date().toISOString().split("T")[0]);
    const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
    const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");
    const [metaKeywords, setMetaKeywords] = useState(initialData?.meta_keywords || "");
    const [faqs, setFaqs] = useState(initialData?.faqs || []);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);
    const [loading, setLoading] = useState(false);

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleTitleChange = (value) => {
        setTitle(value);
        if (!initialData?.slug) {
            setSlug(generateSlug(value));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // FAQ Management
    const addFaq = () => {
        setFaqs([...faqs, { question: "", answer: "" }]);
    };

    const updateFaq = (index, field, value) => {
        const updated = [...faqs];
        updated[index][field] = value;
        setFaqs(updated);
    };

    const removeFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = initialData?.image || "";

            // Upload image via server-side API to avoid StorageApiError
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                if (initialData?.image) {
                    formData.append("oldImageUrl", initialData.image);
                }

                const uploadRes = await fetch("/api/blogs/upload", {
                    method: "POST",
                    body: formData,
                });
                const uploadData = await uploadRes.json();

                if (!uploadData.success) {
                    throw new Error(uploadData.error || "Failed to upload image");
                }

                finalImageUrl = uploadData.url;
            }

            const blogData = {
                title,
                slug,
                author,
                description,
                content,
                date_posted: datePosted,
                meta_title: metaTitle,
                meta_description: metaDescription,
                meta_keywords: metaKeywords,
                faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
                image: finalImageUrl,
            };

            await onSubmit(blogData);
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Blog Title *
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. How to Choose the Perfect Necklace"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            URL Slug *
                        </label>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-400 mr-1">/blog/</span>
                            <input
                                type="text"
                                placeholder="your-blog-slug"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all font-mono text-sm"
                                value={slug}
                                onChange={(e) => setSlug(generateSlug(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Author *
                        </label>
                        <input
                            type="text"
                            placeholder="Author name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Date Posted
                    </label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                        value={datePosted}
                        onChange={(e) => setDatePosted(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Short Description
                    </label>
                    <textarea
                        placeholder="Brief summary of the blog post..."
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Blog Content
                    </label>
                    <p className="text-xs text-gray-400 mb-2 px-1">Supports HTML formatting. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.</p>
                    <textarea
                        placeholder="Write your blog content here... (HTML supported)"
                        rows="12"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-y font-mono text-sm"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>

            {/* Featured Image */}
            <div className="pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 px-1">Featured Image</h2>
                <div className="space-y-4">
                    {imagePreview && (
                        <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden bg-gray-100">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, 448px"
                                className="object-cover"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#E91E63] hover:file:bg-pink-100 transition-all cursor-pointer"
                        onChange={handleImageChange}
                    />
                </div>
            </div>

            {/* SEO Section */}
            <div className="pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 px-1">SEO Optimization</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            placeholder="SEO Title (e.g. How to Pick the Perfect Necklace | The Luxe Jewels Blog)"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1 px-1">{metaTitle.length}/60 characters recommended</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Meta Description
                        </label>
                        <textarea
                            placeholder="Brief description for search engines..."
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-none"
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1 px-1">{metaDescription.length}/160 characters recommended</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Meta Keywords
                        </label>
                        <input
                            type="text"
                            placeholder="jewelry tips, necklace guide, luxury jewelry..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                            value={metaKeywords}
                            onChange={(e) => setMetaKeywords(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* FAQs Section */}
            <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 px-1">FAQs</h2>
                        <p className="text-xs text-gray-400 mt-1 px-1">FAQs are rendered as structured data for SEO (FAQ Schema)</p>
                    </div>
                    <button
                        type="button"
                        onClick={addFaq}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add FAQ
                    </button>
                </div>

                {faqs.length === 0 ? (
                    <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm text-gray-400">No FAQs added yet. Click &quot;Add FAQ&quot; to start.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="p-5 bg-gray-50 rounded-xl border border-gray-100 relative">
                                <button
                                    type="button"
                                    onClick={() => removeFaq(index)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove FAQ"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="space-y-3 pr-8">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Question {index + 1}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. How do I maintain my jewelry?"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all text-sm"
                                            value={faq.question}
                                            onChange={(e) => updateFaq(index, "question", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Answer
                                        </label>
                                        <textarea
                                            placeholder="Write a detailed answer..."
                                            rows="3"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-none text-sm"
                                            value={faq.answer}
                                            onChange={(e) => updateFaq(index, "answer", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 mt-4"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </span>
                ) : (
                    submitLabel
                )}
            </button>
        </form>
    );
}
