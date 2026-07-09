"use client";

import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function ReviewForm({ productId, productName, onSuccess }) {
    const { user, profile } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (images.length + files.length > 5) {
            setError("You can upload maximum 5 images");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("userId", user.id);

                const response = await fetch("/api/reviews/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Upload failed");

                return data.imageUrl;
            });

            const uploadedImages = await Promise.all(uploadPromises);
            setImages((prev) => [...prev, ...uploadedImages]);
        } catch (err) {
            setError(err.message || "Failed to upload images");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = async (index, imageUrl) => {
        try {
            // Extract path from URL for deletion
            const urlParts = imageUrl.split("/review-images/");
            if (urlParts.length > 1) {
                const path = urlParts[1];
                await fetch(`/api/reviews/upload?path=${encodeURIComponent(path)}`, {
                    method: "DELETE",
                });
            }

            setImages((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Failed to remove image:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!user) {
            setError("Please sign in to submit a review");
            return;
        }

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        if (comment.trim().length < 10) {
            setError("Review must be at least 10 characters long");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    user_id: user.id,
                    user_name: profile?.full_name || user.email?.split("@")[0] || "Anonymous",
                    user_email: user.email,
                    rating,
                    title: title.trim() || null,
                    comment: comment.trim(),
                    images,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            setSuccess(true);
            setRating(0);
            setTitle("");
            setComment("");
            setImages([]);

            if (onSuccess) {
                onSuccess(data.review);
            }

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-pink-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-gray-600 font-medium">
                        Please <span className="text-[#E91E63] font-bold">sign in</span> to submit a review
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-green-800 text-lg">Review Submitted!</p>
                        <p className="text-sm text-green-600 mt-1">Your review is pending approval and will be visible shortly.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write a Review
            </h3>
            
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Rating Stars */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="text-3xl transition-all hover:scale-125 focus:outline-none"
                        >
                            <svg
                                className={`w-10 h-10 ${
                                    star <= (hoverRating || rating)
                                        ? "fill-[#E91E63] stroke-[#E91E63]"
                                        : "fill-none stroke-gray-300"
                                }`}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            {/* Title (Optional) */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Review Title <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all"
                />
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={5}
                    maxLength={1000}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-2 text-right">
                    {comment.length}/1000 characters
                </p>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Upload Photos <span className="text-gray-400 font-normal">(max 5)</span>
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#E91E63] transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading || images.length >= 5}
                        className="hidden"
                        id="review-image-upload"
                    />
                    <label
                        htmlFor="review-image-upload"
                        className={`flex flex-col items-center justify-center cursor-pointer ${uploading || images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 font-medium">
                            {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP (max 5MB each)</p>
                    </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 mt-4">
                        {images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={imageUrl}
                                        alt={`Review image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index, imageUrl)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold rounded-xl hover:from-[#D81B60] hover:to-[#AD1457] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
            >
                {submitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit Review
                    </>
                )}
            </button>
        </form>
    );
}
