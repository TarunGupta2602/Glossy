"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext";
import BlogForm from "../../BlogForm";

export default function EditBlogPage({ params }) {
    const { id } = use(params);
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== "admin") {
                router.push("/admin");
            } else {
                fetchBlog();
            }
        }
    }, [user, profile, authLoading, router]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/${id}`);
            const data = await res.json();
            if (data.success) {
                setBlog(data.blog);
            } else {
                alert("Blog not found");
                router.push("/admin/blogs");
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
            alert("Error loading blog");
            router.push("/admin/blogs");
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading blog...</p>
                </div>
            </div>
        );
    }

    if (!user || profile?.role !== "admin") return null;
    if (!blog) return null;

    const handleUpdate = async (blogData) => {
        const res = await fetch(`/api/blogs/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blogData),
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.error || "Failed to update blog");

        alert("Blog updated successfully ✅");
        router.push("/admin/blogs");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/admin/blogs"
                    className="text-sm text-gray-500 hover:text-[#E91E63] flex items-center mb-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blogs
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-2xl font-bold mb-8 text-gray-900">Edit Blog Post</h1>
                    <BlogForm
                        initialData={blog}
                        onSubmit={handleUpdate}
                        submitLabel="Update Blog Post"
                    />
                </div>
            </div>
        </div>
    );
}
