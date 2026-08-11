"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { adminFetch } from "@/lib/adminApi";
import { normalizeBlogSlug } from "@/lib/seo";

export default function AdminBlogsPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [normalizing, setNormalizing] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== "admin") {
                router.push("/admin");
            } else {
                fetchBlogs();
            }
        }
    }, [user, profile, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                Verifying authorization...
            </div>
        );
    }

    if (!user || profile?.role !== "admin") return null;

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await adminFetch("/api/blogs");
            const data = await response.json();
            if (data.success) {
                setBlogs(data.blogs || []);
            } else {
                console.error("Error fetching blogs:", data.error);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
        setLoading(false);
    };

    const dirtySlugCount = blogs.filter((blog) => {
        const clean = normalizeBlogSlug(blog.slug || "");
        return blog.slug && clean !== blog.slug;
    }).length;

    const longMetaCount = blogs.filter(
        (blog) => String(blog.meta_description || "").length > 160
    ).length;

    const missingKeywordsCount = blogs.filter(
        (blog) => !String(blog.meta_keywords || "").trim()
    ).length;

    const handleNormalizeSlugs = async () => {
        const message = [
            "Fix SEO issues on all blog posts?",
            "",
            "This will:",
            "• Clean messy URL slugs (old URLs still redirect)",
            "• Strip brand from meta titles",
            "• Trim long meta descriptions at a word boundary",
            "• Convert markdown # H1 headings to ## H2",
            "",
            "Keywords/tags are not auto-filled — edit posts that still need them.",
            dirtySlugCount || longMetaCount
                ? `\nDetected now: ${dirtySlugCount} messy slug(s), ${longMetaCount} long meta description(s), ${missingKeywordsCount} missing keywords.`
                : `\n${missingKeywordsCount} post(s) are missing keywords (you'll still need to add those manually).`,
        ].join("\n");

        if (!confirm(message)) return;

        setNormalizing(true);
        try {
            const res = await adminFetch("/api/blogs/normalize-slugs", {
                method: "POST",
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Normalize failed");
            }

            const lines = [
                `Scanned: ${data.scanned}`,
                `Updated: ${data.updated}`,
                `Already clean: ${data.skipped}`,
            ];

            if (data.missingKeywords > 0) {
                lines.push(
                    `Still missing keywords: ${data.missingKeywords} (add in Edit for tag pages)`
                );
            }

            if (data.changes?.length) {
                lines.push("", "Changes:");
                data.changes.slice(0, 12).forEach((change) => {
                    const bits = [];
                    if (change.fixes?.slug) bits.push("slug");
                    if (change.fixes?.metaTitle) bits.push("title");
                    if (change.fixes?.metaDescription) bits.push("desc");
                    if (change.fixes?.headings) bits.push("H1→H2");
                    lines.push(
                        `• ${change.title}: ${change.fromSlug} → ${change.toSlug} [${bits.join(", ") || "updated"}]`
                    );
                });
                if (data.changes.length > 12) {
                    lines.push(`…and ${data.changes.length - 12} more`);
                }
            }

            if (data.failures?.length) {
                lines.push("", `Failed: ${data.failures.length}`);
            }

            alert(lines.join("\n"));
            await fetchBlogs();
        } catch (err) {
            console.error("Normalize SEO error:", err);
            alert("Error: " + (err.message || "Could not fix SEO issues"));
        }
        setNormalizing(false);
    };

    const handleDelete = async (id, imageUrl) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;

        try {
            const url = imageUrl
                ? `/api/blogs/${id}?imageUrl=${encodeURIComponent(imageUrl)}`
                : `/api/blogs/${id}`;
            const res = await adminFetch(url, { method: "DELETE" });
            const data = await res.json();

            if (!data.success) throw new Error(data.error || "Failed to delete blog");

            alert("Blog deleted successfully");
            fetchBlogs();
        } catch (err) {
            console.error("Error deleting blog:", err);
            alert("Error deleting blog");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isDirtySlug = (slug) => {
        const clean = normalizeBlogSlug(slug || "");
        return Boolean(slug) && clean !== slug;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <Link
                            href="/admin"
                            className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {blogs.length} blog post{blogs.length !== 1 ? "s" : ""}
                            {dirtySlugCount > 0 ? (
                                <span className="text-amber-600 font-medium">
                                    {" "}· {dirtySlugCount} messy slug{dirtySlugCount === 1 ? "" : "s"}
                                </span>
                            ) : null}
                            {longMetaCount > 0 ? (
                                <span className="text-amber-600 font-medium">
                                    {" "}· {longMetaCount} long meta desc
                                </span>
                            ) : null}
                            {missingKeywordsCount > 0 ? (
                                <span className="text-amber-600 font-medium">
                                    {" "}· {missingKeywordsCount} missing keywords
                                </span>
                            ) : null}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleNormalizeSlugs}
                            disabled={normalizing || loading || blogs.length === 0}
                            className="px-5 py-3 bg-white border border-gray-200 text-gray-800 font-bold rounded-xl hover:border-[#E91E63] hover:text-[#E91E63] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {normalizing ? "Fixing SEO…" : "Fix all SEO issues"}
                        </button>
                        <Link
                            href="/admin/blogs/new"
                            className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Blog Post
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            Loading blogs...
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No blog posts yet</p>
                            <p className="text-sm text-gray-400 mt-1">Start by creating your first blog post!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Post</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest hidden md:table-cell">Author</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest hidden md:table-cell">Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Slug</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {blogs.map((blog) => {
                                        const liveSlug = normalizeBlogSlug(blog.slug) || blog.slug;
                                        const dirty = isDirtySlug(blog.slug);
                                        return (
                                        <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {blog.image ? (
                                                            <div className="relative w-full h-full">
                                                                <Image
                                                                    src={blog.image}
                                                                    alt={blog.title}
                                                                    fill
                                                                    sizes="64px"
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-gray-900 truncate max-w-xs">{blog.title}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{blog.description || "No description"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm text-gray-600">{blog.author}</span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm text-gray-600">{formatDate(blog.date_posted)}</span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium max-w-[220px] truncate ${
                                                        dirty
                                                            ? "bg-amber-50 text-amber-800"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                    title={dirty ? `Will become /${liveSlug}` : undefined}
                                                >
                                                    /{blog.slug}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <Link
                                                        href={`/blog/${liveSlug}`}
                                                        target="_blank"
                                                        className="text-gray-400 hover:text-gray-600 text-sm"
                                                        title="View live"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/blogs/edit/${blog.id}`}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(blog.id, blog.image)}
                                                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
