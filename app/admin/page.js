"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
    const { user, profile, loading: authLoading, signOut } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderCount, setOrderCount] = useState(0);

    // Fetch stats if user is an admin
    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch("/api/orders");
            const data = await response.json();
            if (data.success) {
                setOrderCount(data.totalCount || data.orders?.length || 0);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, []);

    useEffect(() => {
        if (profile?.role === 'admin') {
            fetchStats(); // eslint-disable-line react-hooks/set-state-in-effect
        }
    }, [profile, fetchStats]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoginLoading(true);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) {
                setError(signInError.message);
                setLoginLoading(false);
                return;
            }

            // The profile will be loaded via AuthContext automatically.
            // We just need to wait for it.
        } catch (err) {
            console.error("Login Error:", err);
            setError("An unexpected error occurred. Please try again.");
            setLoginLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || profile?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <Image
                                src="/logo.png"
                                alt="The luxe jewels Logo"
                                width={160}
                                height={64}
                                className="h-16 w-auto object-contain"
                            />
                        </div>
                        <p className="text-gray-500 text-sm">Admin Portal Access</p>
                        {user && profile?.role !== 'admin' && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                                    Your account is logged in but does not have administrator privileges.
                                </p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Admin Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all bg-gray-50"
                                placeholder="Enter admin email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all bg-gray-50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs font-medium text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-[#E91E63] text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-100 hover:bg-[#D81B60] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loginLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : "Sign In to Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-500">Welcome back, Administrator</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start md:self-center"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Manage Categories Card */}
                    <Link href="/admin/categories" className="group">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#E91E63] h-full flex flex-col">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-[#E91E63] mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Manage Categories</h2>
                            <p className="text-gray-500 text-sm flex-grow">View, edit, or delete existing collections. Organise your store&apos;s taxonomy efficiently.</p>
                            <div className="mt-6 flex items-center text-[#E91E63] font-semibold text-sm">
                                View All Categories
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Manage Products Card */}
                    <Link href="/admin/products" className="group">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-black h-full flex flex-col">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Manage Products</h2>
                            <p className="text-gray-500 text-sm flex-grow">Control your inventory. Add new items, update pricing, or manage product visibility.</p>
                            <div className="mt-6 flex items-center text-black font-semibold text-sm">
                                View All Products
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Manage Orders Card */}
                    <Link href="/admin/orders" className="group">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-600 h-full flex flex-col">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Manage Orders</h2>
                            <p className="text-gray-500 text-sm flex-grow">Track customer orders. View order history, payment statuses, and shipping details.</p>

                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-2xl font-black text-blue-600">{orderCount}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</span>
                            </div>

                            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm">
                                View All Orders
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Quick Stats or Info */}
                <div className="mt-12 p-6 bg-gray-100 rounded-2xl flex items-center space-x-4">
                    <div className="flex-shrink-0 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                        Images uploaded to the dashboard are stored securely in Supabase storage and linked automatically to your database.
                    </p>
                </div>
            </div>
        </div>
    );
}
