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
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                <p className="text-xs text-gray-600">
                    Please <span className="text-[#E91E63] font-bold">sign in</span> to submit a review
                </p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
                <p className="text-xs font-bold text-green-700">Review submitted successfully!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Write a Review</h3>
            
            {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600">
                    {error}
                </div>
            )}

            {/* Rating Stars */}
            <div className="mb-3">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                        >
                            <svg
                                className={`w-5 h-5 ${
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

            {/* Comment */}
            <div className="mb-3">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#E91E63] resize-none"
                />
            </div>

            {/* Image Upload - Compact */}
            <div className="mb-3">
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
                    className={`flex items-center justify-center gap-2 border border-dashed border-gray-200 rounded-lg p-2 cursor-pointer hover:border-[#E91E63] transition-colors ${uploading || images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-500">
                        {uploading ? "Uploading..." : `Add photos (${images.length}/5)`}
                    </span>
                </label>

                {/* Image Previews - Compact */}
                {images.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                                <div className="w-12 h-12 rounded overflow-hidden border border-gray-200">
                                    <img
                                        src={imageUrl}
                                        alt={`Review image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index, imageUrl)}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full py-2 bg-[#E91E63] text-white font-bold rounded-lg text-xs hover:bg-[#C2185B] transition-all disabled:opacity-50"
            >
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
}
