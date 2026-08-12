"use client";

import Link from "next/link";
import { useToast } from "../context/ToastContext";

export default function ToastHost() {
    const { toast, hideToast } = useToast();

    if (!toast) return null;

    return (
        <div
            className="fixed left-1/2 z-[120] -translate-x-1/2 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] md:bottom-8 w-[min(92vw,380px)] animate-fade-in-up"
            role="status"
            aria-live="polite"
        >
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-md px-4 py-3.5 shadow-[0_18px_50px_-20px_rgba(26,18,20,0.45)]">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        toast.tone === "pink" ? "bg-[#fce4ec] text-[#E91E63]" : "bg-gray-900 text-white"
                    }`}
                    aria-hidden
                >
                    ✓
                </span>
                <p className="flex-1 text-[13px] font-medium text-gray-900 leading-snug">
                    {toast.message}
                </p>
                {toast.href ? (
                    <Link
                        href={toast.href}
                        onClick={hideToast}
                        className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#E91E63]"
                    >
                        {toast.hrefLabel}
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={hideToast}
                        className="shrink-0 text-[11px] font-semibold text-gray-400"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
