"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    WHATSAPP_URL,
    SUPPORT_EMAIL,
    SUPPORT_PHONE,
    BRAND_NAME,
    SERVICE_AREA_LABEL,
    INSTAGRAM_URL,
    INSTAGRAM_HANDLE,
    BUSINESS_HOURS,
} from "@/lib/constants";
import { PROMO_LABEL } from "@/lib/promo";
import PaymentIcons from "./PaymentIcons";

const SHOP_LINKS = [
    { href: "/shop", label: "Shop all" },
    { href: "/earrings", label: "Earrings" },
    { href: "/necklaces", label: "Necklaces" },
    { href: "/collection", label: "Collections" },
    { href: "/shop?sort=newest", label: "New arrivals" },
];

const HELP_LINKS = [
    { href: "/our-story", label: "Our story" },
    { href: "/blog", label: "Journal" },
    { href: "/shipping-returns", label: "Shipping & returns" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
];

const TRUST = [
    "Anti-tarnish",
    "Waterproof",
    "Free shipping over ₹1000",
    PROMO_LABEL,
];

export default function Footer() {
    const [year, setYear] = useState(2026);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="relative bg-[#1a1214] text-white pt-12 md:pt-16 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-10 overflow-hidden">
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 50% at 10% 0%, rgba(233,30,99,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(233,30,99,0.12), transparent 50%)",
                }}
                aria-hidden
            />

            <div className={`relative ${SITE_CONTAINER}`}>
                {/* Top CTA strip */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-10 md:pb-12 border-b border-white/10">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FF80AB] mb-1.5">
                            Need help choosing?
                        </p>
                        <p className="font-playfair text-xl sm:text-2xl text-white tracking-tight">
                            We&apos;re here on WhatsApp
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-white hover:brightness-105 active:scale-[0.98] transition-all"
                        >
                            Chat now
                        </a>
                        <Link
                            href="/shop"
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-gray-900 transition-colors"
                        >
                            Shop all
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 py-10 md:py-14 border-b border-white/10">
                    {/* Brand */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <Link href="/" className="inline-block mb-5 group">
                            <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#FF80AB] mb-1">
                                The
                            </span>
                            <span className="font-playfair text-2xl sm:text-3xl font-semibold tracking-tight text-white group-hover:text-[#FF80AB] transition-colors">
                                Luxe Jewels
                            </span>
                        </Link>

                        <p className="text-[14px] leading-relaxed text-white/65 max-w-sm mb-3">
                            Anti-tarnish, waterproof jewellery made for everyday India —
                            lustrous pieces you can actually wear.
                        </p>
                        <p className="text-[12px] leading-relaxed text-white/45 max-w-sm mb-6">
                            {SERVICE_AREA_LABEL}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-7">
                            {TRUST.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/70"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-1">
                            <a
                                href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                                className="flex items-center gap-3 min-h-10 text-[13px] text-white/70 hover:text-white transition-colors"
                            >
                                <span className="text-white/40 w-16 shrink-0 text-[10px] uppercase tracking-wider">
                                    Call
                                </span>
                                {SUPPORT_PHONE}
                            </a>
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                className="flex items-center gap-3 min-h-10 text-[13px] text-white/70 hover:text-white transition-colors break-all"
                            >
                                <span className="text-white/40 w-16 shrink-0 text-[10px] uppercase tracking-wider">
                                    Email
                                </span>
                                {SUPPORT_EMAIL}
                            </a>
                            <p className="flex items-center gap-3 min-h-10 text-[13px] text-white/55">
                                <span className="text-white/40 w-16 shrink-0 text-[10px] uppercase tracking-wider">
                                    Hours
                                </span>
                                {BUSINESS_HOURS}
                            </p>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-4">
                                Shop
                            </h3>
                            <ul className="space-y-2.5">
                                {SHOP_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-white/75 hover:text-[#FF80AB] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-4">
                                Help
                            </h3>
                            <ul className="space-y-2.5">
                                {HELP_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-white/75 hover:text-[#FF80AB] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-4">
                                Follow
                            </h3>
                            <p className="text-[13px] text-white/55 leading-relaxed mb-4 max-w-[16rem]">
                                Styling tips, new drops, and customer looks on Instagram.
                            </p>
                            <a
                                href={INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 text-[13px] font-medium text-white hover:bg-[#E91E63] hover:border-[#E91E63] transition-colors"
                                aria-label="Instagram"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                                {INSTAGRAM_HANDLE}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 order-2 md:order-1">
                        <p className="text-[12px] text-white/50">
                            © {year} {BRAND_NAME}
                        </p>
                        <div className="hidden sm:block w-px h-3 bg-white/15" aria-hidden />
                        <div className="flex items-center gap-4">
                            <Link
                                href="/privacy"
                                className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 hover:text-white transition-colors"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 hover:text-white transition-colors"
                            >
                                Terms
                            </Link>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 flex flex-col items-start md:items-end gap-2.5">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                            Secure payments via Razorpay
                        </span>
                        <div className="opacity-80">
                            <PaymentIcons />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
