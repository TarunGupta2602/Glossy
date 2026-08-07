"use client";

import { useState, useEffect, useRef } from "react";
import { getInitials } from "@/lib/featuredReviews";
import { useOverlayOpen } from "../context/OverlayContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

function StarRating({ rating, size = "md" }) {
    const sizeClass = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`${sizeClass} fill-current ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
                    viewBox="0 0 20 20"
                    aria-hidden
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function ReviewList({ productId, refreshKey = 0 }) {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const touchStartX = useRef(null);

    useOverlayOpen(Boolean(lightboxImage));
    useBodyScrollLock(Boolean(lightboxImage));

    useEffect(() => {
        fetchReviews();
    }, [productId, refreshKey]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(`/api/reviews/${productId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch reviews");
            }

            setReviews(data.reviews);
            setStats(data.stats);
            setShowAllReviews(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? "" : "s"} ago`;

        return date.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const openLightbox = (imageUrl, allImages, index) => {
        setLightboxImage(imageUrl);
        setLightboxImages(allImages);
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxImage(null);
        setLightboxImages([]);
    };

    const goToPrevious = () => {
        const newIndex = lightboxIndex > 0 ? lightboxIndex - 1 : lightboxImages.length - 1;
        setLightboxIndex(newIndex);
        setLightboxImage(lightboxImages[newIndex]);
    };

    const goToNext = () => {
        const newIndex = lightboxIndex < lightboxImages.length - 1 ? lightboxIndex + 1 : 0;
        setLightboxIndex(newIndex);
        setLightboxImage(lightboxImages[newIndex]);
    };

    useEffect(() => {
        if (!lightboxImage) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxImage, lightboxIndex, lightboxImages]);

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-40 space-y-3">
                            <div className="h-12 bg-gray-200 rounded-lg w-24 mx-auto md:mx-0" />
                            <div className="h-4 bg-gray-200 rounded w-32 mx-auto md:mx-0" />
                        </div>
                        <div className="flex-1 space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-2 bg-gray-200 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
                {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 p-6 space-y-4">
                        <div className="flex gap-3">
                            <div className="w-11 h-11 rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                            </div>
                        </div>
                        <div className="h-16 bg-gray-100 rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-red-50 p-6 border border-red-100">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-red-700">Couldn&apos;t load reviews</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                        <button
                            type="button"
                            onClick={fetchReviews}
                            className="mt-3 text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gradient-to-br from-[#FFF5F8] to-white p-10 md:p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[#E91E63]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </div>
                <p className="text-lg font-black text-gray-900 mb-2">No reviews yet</p>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Be the first to share your experience with this piece.
                </p>
            </div>
        );
    }

    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4);

    return (
        <div className="space-y-6">
            {stats && (
                <div className="rounded-2xl bg-gradient-to-br from-[#FFF5F8] to-white border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="text-center md:text-left md:min-w-[140px]">
                            <p className="text-5xl font-black text-gray-900 leading-none tracking-tight">
                                {stats.avgRating.toFixed(1)}
                            </p>
                            <div className="mt-3 flex justify-center md:justify-start">
                                <StarRating rating={Math.round(stats.avgRating)} size="lg" />
                            </div>
                            <p className="mt-2 text-sm font-semibold text-gray-500">
                                Based on {stats.totalReviews} review{stats.totalReviews === 1 ? "" : "s"}
                            </p>
                        </div>

                        <div className="flex-1 space-y-2.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.ratingCounts[star] || 0;
                                const percentage = stats.totalReviews > 0
                                    ? (count / stats.totalReviews) * 100
                                    : 0;

                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-600 w-8 tabular-nums">{star} ★</span>
                                        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#E91E63] to-[#FF80AB] rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 w-6 text-right tabular-nums">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {visibleReviews.map((review) => {
                    const initials = getInitials(review.user_name);

                    return (
                        <article
                            key={review.id}
                            className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-[0_8px_30px_-20px_rgba(31,38,135,0.12)] hover:border-gray-200 transition-colors"
                        >
                            <div className="flex gap-4">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF80AB] flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-md shadow-[#FF80AB]/20">
                                    {initials || "★"}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    {review.user_name}
                                                </h3>
                                                {review.is_verified_purchase && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700 border border-green-100">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <StarRating rating={review.rating} size="sm" />
                                                <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {review.title && (
                                        <p className="text-sm font-bold text-gray-900 mb-2">{review.title}</p>
                                    )}

                                    <p className="text-[14px] text-gray-600 leading-relaxed">
                                        {review.comment}
                                    </p>

                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mt-4 flex-wrap">
                                            {review.images.slice(0, 5).map((imageUrl, imgIndex) => (
                                                <button
                                                    key={imgIndex}
                                                    type="button"
                                                    className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 hover:border-[#E91E63] hover:ring-2 hover:ring-[#E91E63]/20 transition-all"
                                                    onClick={() => openLightbox(imageUrl, review.images, imgIndex)}
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Review photo ${imgIndex + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {reviews.length > 4 && !showAllReviews && (
                <button
                    type="button"
                    onClick={() => setShowAllReviews(true)}
                    className="w-full py-3.5 rounded-xl border border-gray-200 text-[12px] font-bold uppercase tracking-[0.15em] text-gray-700 hover:text-[#E91E63] hover:border-[#E91E63]/40 transition-colors bg-white"
                >
                    Show all {reviews.length} reviews
                </button>
            )}

            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
                    onClick={closeLightbox}
                    onTouchStart={(e) => {
                        touchStartX.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                        if (touchStartX.current == null || lightboxImages.length < 2) return;
                        const dx = e.changedTouches[0].clientX - touchStartX.current;
                        if (Math.abs(dx) > 40) {
                            if (dx < 0) goToNext();
                            else goToPrevious();
                        }
                        touchStartX.current = null;
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        onClick={closeLightbox}
                        className="absolute top-[calc(1rem+env(safe-area-inset-top,0px))] right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {lightboxImages.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute left-3 md:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    <div
                        className="max-w-[95vw] max-h-[95vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightboxImage}
                            alt="Review"
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                            draggable={false}
                        />
                        {lightboxImages.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                                {lightboxIndex + 1} / {lightboxImages.length}
                            </div>
                        )}
                    </div>

                    {lightboxImages.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute right-3 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
