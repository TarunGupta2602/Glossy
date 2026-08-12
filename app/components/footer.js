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
    { href: "/gifts/under-999", label: "Gifts under ₹999" },
    { href: "/gifts/under-499", label: "Gifts under ₹499" },
];

const HELP_LINKS = [
    { href: "/blog", label: "Blog" },
    { href: "/our-story", label: "Our story" },
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
        <footer className="relative bg-white border-t border-gray-100 pt-12 md:pt-16 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-10">
            <div className={SITE_CONTAINER}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-10 md:pb-12 border-b border-gray-100">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E91E63] mb-1.5">
                            Need help choosing?
                        </p>
                        <p className="font-playfair text-xl sm:text-2xl text-gray-900 tracking-tight">
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
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-200 px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-900 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                        >
                            Shop all
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 py-10 md:py-14 border-b border-gray-100">
                    <div className="md:col-span-5 lg:col-span-4">
                        <Link href="/" className="inline-block mb-5 group">
                            <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E91E63] mb-1">
                                The
                            </span>
                            <span className="font-playfair text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 group-hover:text-[#E91E63] transition-colors">
                                Luxe Jewels
                            </span>
                        </Link>

                        <p className="text-[14px] leading-relaxed text-gray-600 max-w-sm mb-3">
                            Anti-tarnish, waterproof jewellery made for everyday India —
                            lustrous pieces you can actually wear.
                        </p>
                        <p className="text-[12px] leading-relaxed text-gray-400 max-w-sm mb-6">
                            {SERVICE_AREA_LABEL}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-7">
                            {TRUST.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-gray-200 bg-[#faf7f8] px-3 py-1.5 text-[10px] font-medium tracking-wide text-gray-600"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-1">
                            <a
                                href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                                className="flex items-center gap-3 min-h-10 text-[13px] text-gray-700 hover:text-[#E91E63] transition-colors"
                            >
                                <span className="text-gray-400 w-16 shrink-0 text-[10px] uppercase tracking-wider">
                                    Call
                                </span>
                                {SUPPORT_PHONE}
                            </a>
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                className="flex items-center gap-3 min-h-10 text-[13px] text-gray-700 hover:text-[#E91E63] transition-colors break-all"
                            >
                                <span className="text-gray-400 w-16 shrink-0 text-[10px] uppercase tracking-wider">
                                    Email
                                </span>
                                {SUPPORT_EMAIL}
                            </a>
                            <p className="flex items-center gap-3 min-h-10 text-[13px] text-gray-500">
                                <span className="text-gray-400 w-16 shrink-0 text-[10px] uppercase tracking-wider">
                                    Hours
                                </span>
                                {BUSINESS_HOURS}
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
                                Shop
                            </h3>
                            <ul className="space-y-2.5">
                                {SHOP_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-gray-700 hover:text-[#E91E63] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
                                Help
                            </h3>
                            <ul className="space-y-2.5">
                                {HELP_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-gray-700 hover:text-[#E91E63] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
                                Follow
                            </h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed mb-4 max-w-[16rem]">
                                Styling tips, new drops, and customer looks on Instagram.
                            </p>
                            <a
                                href={INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-gray-200 bg-[#faf7f8] px-4 text-[13px] font-medium text-gray-900 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
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

                <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 order-2 md:order-1">
                        <p className="text-[12px] text-gray-500">
                            © {year} {BRAND_NAME}
                        </p>
                        <div className="hidden sm:block w-px h-3 bg-gray-200" aria-hidden />
                        <div className="flex items-center gap-4">
                            <Link
                                href="/privacy"
                                className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                Terms
                            </Link>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 flex flex-col items-start md:items-end gap-2.5">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Secure payments via Razorpay
                        </span>
                        <PaymentIcons />
                    </div>
                </div>
            </div>
        </footer>
    );
}
