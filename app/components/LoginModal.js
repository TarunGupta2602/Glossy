import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Image from "next/image";

export default function LoginModal({ isOpen, onClose }) {
    const { user, googleClientId } = useAuth();

    useEffect(() => {
        if (isOpen && window.google) {
            window.google.accounts.id.renderButton(
                document.getElementById("google-button-div"),
                {
                    theme: "outline",
                    size: "large",
                    text: "signin_with",
                    shape: "pill",
                    width: document.getElementById("google-button-div")?.offsetWidth || 300,
                }
            );
        }
    }, [isOpen]);

    // Close modal automatically if user signs in
    useEffect(() => {
        if (user && isOpen) {
            onClose();
        }
    }, [user, isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center w-full h-full min-h-screen p-4 bg-black/40 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="absolute inset-0 w-full h-full" onClick={onClose}></div>

            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 z-10 overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-50 rounded-full blur-3xl opacity-50"></div>

                <div className="relative flex flex-col items-center text-center space-y-6">
                    {/* Logo instead of Icon */}
                    {/* Universal Text Logo */}
                    <div className="flex flex-col items-center leading-none mb-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E91E63] mb-1">THE</span>
                        <span className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                            LUXE <span className="font-light text-gray-500">JEWELS</span>
                        </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 font-medium px-4">Log in to track your orders, save favorites, and enjoy a faster checkout.</p>
                    </div>

                    {/* Official Google Button Container */}
                    <div id="google-button-div" className="w-full flex justify-center min-h-[44px]"></div>

                    {/* Close link */}
                    <button
                        onClick={onClose}
                        className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors pt-2"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}
