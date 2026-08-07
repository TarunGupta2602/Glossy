"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOverlayOpen } from "../context/OverlayContext";

export default function LoginModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const buttonRef = useRef(null);

    useBodyScrollLock(isOpen);
    useOverlayOpen(isOpen);

    useEffect(() => {
        if (!isOpen || !window.google || !buttonRef.current) return;

        const render = () => {
            const el = buttonRef.current;
            if (!el || !window.google?.accounts?.id) return;
            el.innerHTML = "";
            const width = Math.max(240, Math.min(el.offsetWidth || 300, 360));
            window.google.accounts.id.renderButton(el, {
                theme: "outline",
                size: "large",
                text: "signin_with",
                shape: "pill",
                width,
            });
        };

        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(render);
        });

        return () => cancelAnimationFrame(frame);
    }, [isOpen]);

    useEffect(() => {
        if (user && isOpen) {
            onClose();
        }
    }, [user, isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center w-full h-full min-h-screen p-4 bg-black/40 backdrop-blur-sm">
            <div className="absolute inset-0 w-full h-full" onClick={onClose} aria-hidden />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-title"
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>

                <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-50 rounded-full blur-3xl opacity-50" />

                <div className="relative flex flex-col items-center text-center space-y-6">
                    <div className="flex flex-col items-center leading-none mb-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E91E63] mb-1">THE</span>
                        <span id="login-modal-title" className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                            LUXE <span className="font-light text-gray-500">JEWELS</span>
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 font-medium px-2">
                        Log in to track your orders, save favorites, and enjoy a faster checkout.
                    </p>

                    <div ref={buttonRef} className="w-full flex justify-center min-h-[44px]" />

                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-11 px-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}
