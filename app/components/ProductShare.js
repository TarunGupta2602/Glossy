"use client";

import { useEffect, useRef, useState } from "react";

function ShareIcon({ className = "w-[18px] h-[18px]" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
        </svg>
    );
}

export default function ProductShare({ name, price, variant = "icon" }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onPointer = (event) => {
            if (!rootRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const onKey = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("mousedown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    const getSharePayload = () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        const priceLabel = price
            ? `₹${Number(price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
            : "";
        const text = priceLabel
            ? `${name} — ${priceLabel} from The Luxe Jewels`
            : `${name} from The Luxe Jewels`;
        return { title: name, text, url };
    };

    const copyLink = async () => {
        const { url } = getSharePayload();
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            window.prompt("Copy this product link", url);
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
        setMenuOpen(false);
    };

    const shareWhatsApp = () => {
        const { text, url } = getSharePayload();
        window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
            "_blank",
            "noopener,noreferrer"
        );
        setMenuOpen(false);
    };

    const handleShare = async () => {
        const payload = getSharePayload();
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                await navigator.share(payload);
                return;
            } catch (error) {
                if (error?.name === "AbortError") return;
            }
        }
        setMenuOpen((open) => !open);
    };

    const buttonClass =
        variant === "row"
            ? "relative w-full h-12 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase border border-[#efeae4] text-[#2a2724] bg-white flex items-center justify-center gap-2 hover:border-[#E91E63]/50 hover:text-[#E91E63] transition-all duration-200"
            : "relative h-12 w-12 shrink-0 rounded-full border border-[#efeae4] text-[#2a2724] bg-white flex items-center justify-center hover:border-[#E91E63]/50 hover:text-[#E91E63] transition-all duration-200";

    return (
        <div ref={rootRef} className={variant === "row" ? "relative w-full" : "relative shrink-0"}>
            <button
                type="button"
                onClick={handleShare}
                aria-label={`Share ${name}`}
                aria-expanded={menuOpen}
                className={buttonClass}
            >
                <ShareIcon className={variant === "row" ? "w-4 h-4" : "w-[18px] h-[18px]"} />
                {variant === "row" ? (copied ? "Link copied" : "Share") : null}
            </button>

            {menuOpen && (
                <div
                    role="menu"
                    className="absolute right-0 bottom-full mb-2 z-30 min-w-[11.5rem] rounded-2xl border border-[#efeae4] bg-white p-1.5 shadow-[0_12px_40px_rgba(42,39,36,0.12)]"
                >
                    <button
                        type="button"
                        role="menuitem"
                        onClick={shareWhatsApp}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-[#2a2724] hover:bg-[#fdfbf7]"
                    >
                        WhatsApp
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={copyLink}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-[#2a2724] hover:bg-[#fdfbf7]"
                    >
                        {copied ? "Link copied" : "Copy link"}
                    </button>
                </div>
            )}
        </div>
    );
}
