"use client";

import { useState, useEffect } from "react";

export default function ReviewList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/reviews/${productId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch reviews");
            }

            setReviews(data.reviews);
            setStats(data.stats);
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
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-5 h-5 ${
                    star <= rating
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
        ));
    };

    const openLightbox = (imageUrl, allImages, index) => {
        setLightboxImage(imageUrl);
        setLightboxImages(allImages);
        setLightboxIndex(index);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxImage(null);
        setLightboxImages([]);
        document.body.style.overflow = "auto";
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

    const handleKeyDown = (e) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
    };

    useEffect(() => {
        if (lightboxImage) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [lightboxImage, lightboxIndex]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex gap-8">
                        <div className="h-24 bg-gray-200 rounded w-24"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600 font-medium">Failed to load reviews: {error}</p>
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 border border-gray-200 text-center">
                <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <p className="text-gray-600 font-bold text-lg mb-2">No reviews yet</p>
                <p className="text-sm text-gray-500">Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[16px] font-bold text-gray-900">Customer Reviews</h2>
                    {stats && (
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""} · {stats.avgRating.toFixed(1)} average
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#E91E63] hover:text-[#C2185B] transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                            Hide
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            Show
                        </>
                    )}
                </button>
            </div>

            {isExpanded && (
                <>
                    {/* Rating Summary - Compact */}
                    {stats && (
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                {/* Average Rating */}
                                <div className="flex-shrink-0 text-center">
                                    <div className="flex items-baseline gap-1 justify-center">
                                        <span className="text-3xl font-black text-gray-900">
                                            {stats.avgRating.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex gap-0.5 mt-1 justify-center">
                                        {renderStars(Math.round(stats.avgRating))}
                                    </div>
                                </div>

                                {/* Rating Breakdown - Compact */}
                                <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = stats.ratingCounts[star] || 0;
                                        const percentage = stats.totalReviews > 0
                                            ? (count / stats.totalReviews) * 100
                                            : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-gray-700 w-3">
                                                    {star}
                                                </span>
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#E91E63] rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-gray-500 w-5 text-right">
                                                    {count}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews List - Compact */}
                    <div className="space-y-2">
                        {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, index) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                            >
                                {/* Review Header */}
                                <div className="flex items-center gap-2 mb-1.5">
                                    {/* Avatar */}
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[10px] font-bold text-[#E91E63]">
                                            {review.user_name?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="font-semibold text-gray-900 text-xs truncate">
                                                {review.user_name}
                                            </p>
                                            {review.is_verified_purchase && (
                                                <span className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-bold text-green-700 bg-green-50 border border-green-200 flex-shrink-0">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="flex gap-0.5">
                                                {renderStars(review.rating)}
                                            </div>
                                            <span className="text-[10px] text-gray-400">
                                                {formatDate(review.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                {review.title && (
                                    <h4 className="font-semibold text-gray-900 text-xs mb-0.5">
                                        {review.title}
                                    </h4>
                                )}
                                <p className="text-gray-600 text-xs leading-relaxed mb-1.5 line-clamp-2">
                                    {review.comment}
                                </p>

                                {/* Review Images - Tiny thumbnails */}
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-1.5">
                                        {review.images.slice(0, 3).map((imageUrl, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                className="w-8 h-8 rounded overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer hover:border-[#E91E63] transition-colors"
                                                onClick={() => openLightbox(imageUrl, review.images, imgIndex)}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={`Review ${imgIndex + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {review.images.length > 3 && (
                                            <span 
                                                className="text-[10px] text-gray-400 self-center cursor-pointer hover:text-[#E91E63]"
                                                onClick={() => openLightbox(review.images[3], review.images, 3)}
                                            >
                                                +{review.images.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Show More Button */}
                        {reviews.length > 3 && !showAllReviews && (
                            <button
                                onClick={() => setShowAllReviews(true)}
                                className="w-full py-2 text-[11px] font-bold uppercase tracking-wider text-[#E91E63] hover:text-[#C2185B] transition-colors border border-gray-200 rounded-lg hover:border-[#E91E63]"
                            >
                                Show All {reviews.length} Reviews
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Previous Button */}
                    {lightboxImages.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div 
                        className="max-w-[90vw] max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightboxImage}
                            alt="Review image"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        />
                        {lightboxImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                                {lightboxIndex + 1} / {lightboxImages.length}
                            </div>
                        )}
                    </div>

                    {/* Next Button */}
                    {lightboxImages.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
