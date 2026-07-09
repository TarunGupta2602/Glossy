"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ReviewsListPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, pending, approved
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== 'admin') {
                router.push("/admin");
            } else {
                fetchReviews();
            }
        }
    }, [user, profile, authLoading, router, filter]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                Verifying authorization...
            </div>
        );
    }

    if (!user || profile?.role !== 'admin') return null;

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const statusParam = filter === "all" ? "" : `status=${filter}`;
            const response = await fetch(`/api/reviews/admin?${statusParam}`);
            const data = await response.json();
            if (data.success) {
                setReviews(data.reviews || []);
            } else {
                console.error("Error fetching reviews:", data.error);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
        setLoading(false);
    };

    const handleApprove = async (reviewId) => {
        if (!confirm("Are you sure you want to approve this review?")) return;

        setActionLoading(reviewId);
        try {
            const response = await fetch("/api/reviews/admin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId, action: "approve" }),
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.error || "Failed to approve review");

            alert("Review approved successfully");
            fetchReviews();
        } catch (err) {
            console.error("Error approving review:", err);
            alert("Error approving review");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (reviewId) => {
        if (!confirm("Are you sure you want to reject this review?")) return;

        setActionLoading(reviewId);
        try {
            const response = await fetch("/api/reviews/admin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId, action: "reject" }),
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.error || "Failed to reject review");

            alert("Review rejected successfully");
            fetchReviews();
        } catch (err) {
            console.error("Error rejecting review:", err);
            alert("Error rejecting review");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

        setActionLoading(reviewId);
        try {
            const response = await fetch(`/api/reviews/admin?reviewId=${reviewId}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.error || "Failed to delete review");

            alert("Review deleted successfully");
            fetchReviews();
        } catch (err) {
            console.error("Error deleting review:", err);
            alert("Error deleting review");
        } finally {
            setActionLoading(null);
        }
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-4 h-4 ${
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const pendingCount = reviews.filter(r => !r.is_approved).length;
    const approvedCount = reviews.filter(r => r.is_approved).length;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <Link href="/admin" className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Reviews</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === "all"
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            All ({reviews.length})
                        </button>
                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === "pending"
                                    ? "bg-amber-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Pending ({pendingCount})
                        </button>
                        <button
                            onClick={() => setFilter("approved")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === "approved"
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Approved ({approvedCount})
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {filter === "pending" ? "No pending reviews to review." : "No reviews found yet."}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Product</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Reviewer</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Rating</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Review</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {review.products?.name || "Unknown Product"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">{review.user_name}</div>
                                                    <div className="text-xs text-gray-500">{review.user_email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-0.5">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="text-sm text-gray-600">
                                                    {review.title && (
                                                        <div className="font-medium text-gray-900 mb-1">{review.title}</div>
                                                    )}
                                                    <div className="line-clamp-2">{review.comment}</div>
                                                    {review.images && review.images.length > 0 && (
                                                        <div className="mt-2 flex gap-1">
                                                            {review.images.slice(0, 3).map((img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={img}
                                                                    alt={`Review ${idx + 1}`}
                                                                    className="w-8 h-8 rounded object-cover border border-gray-200"
                                                                />
                                                            ))}
                                                            {review.images.length > 3 && (
                                                                <span className="text-xs text-gray-500 self-center">+{review.images.length - 3}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(review.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {review.is_approved ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                        Pending
                                                    </span>
                                                )}
                                                {review.is_verified_purchase && (
                                                    <div className="mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">
                                                            ✓ Verified
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {!review.is_approved && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(review.id)}
                                                            disabled={actionLoading === review.id}
                                                            className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {actionLoading === review.id ? "..." : "Approve"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(review.id)}
                                                            disabled={actionLoading === review.id}
                                                            className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {actionLoading === review.id ? "..." : "Reject"}
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    disabled={actionLoading === review.id}
                                                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === review.id ? "..." : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
