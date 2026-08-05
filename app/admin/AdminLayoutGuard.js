"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminLayoutGuard({ children }) {
    const { user, profile, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin";

    useEffect(() => {
        if (loading || isLoginPage) return;
        if (!user || profile?.role !== "admin") {
            router.replace("/admin");
        }
    }, [user, profile, loading, isLoginPage, router]);

    if (isLoginPage) {
        return children;
    }

    if (loading || !user || profile?.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
                Verifying admin access...
            </div>
        );
    }

    return children;
}
