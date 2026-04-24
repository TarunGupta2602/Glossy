"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import BlogForm from "../BlogForm";

export default function NewBlogPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!user || profile?.role !== "admin") {
                router.push("/admin");
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

    const handleCreate = async (blogData) => {
        const res = await fetch("/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blogData),
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.error || "Failed to create blog");

        alert("Blog published successfully 🚀");
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
                    <h1 className="text-2xl font-bold mb-8 text-gray-900">New Blog Post</h1>
                    <BlogForm onSubmit={handleCreate} submitLabel="Publish Blog Post" />
                </div>
            </div>
        </div>
    );
}
