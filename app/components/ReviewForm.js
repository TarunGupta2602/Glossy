"use client";

import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "@/lib/adminApi";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function ReviewForm({ productId, productName, onSuccess, onCancel }) {
    const { user, profile, signInWithGoogle } = useAuth();
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

    const activeRating = hoverRating || rating;

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (images.length + files.length > 5) {
            setError("You can upload a maximum of 5 photos");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const response = await authFetch("/api/reviews/upload", {
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
            setError(err.message || "Failed to upload photos");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = async (index, imageUrl) => {
        try {
            const urlParts = imageUrl.split("/review-images/");
            if (urlParts.length > 1) {
                const path = urlParts[1];
                await authFetch(`/api/reviews/upload?path=${encodeURIComponent(path)}`, {
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
            setError("Please select a star rating");
            return;
        }

        if (comment.trim().length < 10) {
            setError("Your review must be at least 10 characters");
            return;
        }

        setSubmitting(true);

        try {
            const response = await authFetch("/api/reviews", {
                method: "POST",
                body: JSON.stringify({
                    product_id: productId,
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
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8 text-center">
                <p className="text-sm font-semibold text-gray-900 mb-1">Share your experience</p>
                <p className="text-sm text-gray-500 mb-5">
                    Sign in to leave a review for {productName || "this product"}.
                </p>
                <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 md:p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p className="text-base font-bold text-green-800 mb-1">Thank you for your review!</p>
                <p className="text-sm text-green-700">
                    It will appear on this page once our team approves it.
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-[0_8px_30px_-20px_rgba(31,38,135,0.12)]"
        >
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <h3 className="text-base font-black text-gray-900">Write a review</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Help others choose {productName ? `"${productName}"` : "this piece"}.
                    </p>
                </div>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Your rating
                </label>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E63]/40 rounded"
                                aria-label={`Rate ${star} out of 5`}
                            >
                                <svg
                                    className={`w-7 h-7 fill-current transition-colors ${
                                        star <= activeRating ? "text-amber-400" : "text-gray-200"
                                    }`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    {activeRating > 0 && (
                        <span className="text-sm font-semibold text-gray-600">
                            {RATING_LABELS[activeRating]}
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="review-title" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Headline <span className="font-medium normal-case tracking-normal text-gray-400">(optional)</span>
                </label>
                <input
                    id="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/10"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="review-comment" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Your review
                </label>
                <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love? How does it fit or feel?"
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/10 resize-none leading-relaxed"
                />
                <p className="mt-1.5 text-xs text-gray-400 text-right tabular-nums">
                    {comment.length}/500
                </p>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Photos <span className="font-medium normal-case tracking-normal text-gray-400">(optional)</span>
                </label>
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
                    className={`flex items-center justify-center gap-2 border border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#E91E63]/50 hover:bg-[#FFF5F8]/50 transition-colors ${
                        uploading || images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500">
                        {uploading ? "Uploading…" : `Add photos (${images.length}/5)`}
                    </span>
                </label>

                {images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={imageUrl}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index, imageUrl)}
                                    className="absolute -top-2 -right-2 w-8 h-8 min-w-8 min-h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm"
                                    aria-label="Remove photo"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-3.5 rounded-xl bg-[#E91E63] text-white text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#C2185B] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? "Submitting…" : "Submit review"}
            </button>
        </form>
    );
}
