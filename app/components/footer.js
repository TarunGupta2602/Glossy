"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    SUPPORT_EMAIL,
    SUPPORT_PHONE,
    BRAND_NAME,
    INSTAGRAM_URL,
    INSTAGRAM_HANDLE,
} from "@/lib/constants";
import PaymentIcons from "./PaymentIcons";
import BrandLogo from "./BrandLogo";
import Newsletter from "./newsletter";

const SHOP_LINKS = [
    { href: "/shop", label: "Shop all" },
    { href: "/earrings", label: "Earrings" },
    { href: "/necklaces", label: "Necklaces" },
    { href: "/bracelets", label: "Bracelets" },
    { href: "/rings", label: "Rings" },
];

const HELP_LINKS = [
    { href: "/shipping-returns", label: "Shipping & returns" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
    { href: "/our-story", label: "Our story" },
    { href: "/blog", label: "Blog" },
];

function LinkList({ title, links }) {
    return (
        <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-2.5">
                {title}
            </h3>
            <ul className="space-y-1">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="inline-flex min-h-7 items-center text-[13px] text-gray-700 hover:text-[#E91E63] transition-colors"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    const [year, setYear] = useState(2026);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="relative bg-white border-t border-gray-100 pt-8 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-6">
            <div className={SITE_CONTAINER}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
                    <div className="col-span-2 sm:col-span-1">
                        <BrandLogo href="/" size="md" className="mb-3" />
                        <p className="text-[13px] leading-snug text-gray-500 mb-3 max-w-[16rem]">
                            Anti-tarnish fashion jewellery, shipped pan-India.
                        </p>
                        <a
                            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                            className="block text-[13px] text-gray-700 hover:text-[#E91E63]"
                        >
                            {SUPPORT_PHONE}
                        </a>
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="mt-1 block text-[13px] text-gray-700 hover:text-[#E91E63] break-all"
                        >
                            {SUPPORT_EMAIL}
                        </a>
                        <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-[13px] text-gray-700 hover:text-[#E91E63]"
                        >
                            {INSTAGRAM_HANDLE}
                        </a>
                    </div>

                    <LinkList title="Shop" links={SHOP_LINKS} />
                    <LinkList title="Help" links={HELP_LINKS} />

                    <div>
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-2.5">
                            The list
                        </h3>
                        <Newsletter variant="footer" />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="text-[12px] text-gray-500">© {year} {BRAND_NAME}</p>
                        <Link href="/privacy" className="text-[11px] uppercase tracking-[0.12em] text-gray-400 hover:text-gray-900">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-[11px] uppercase tracking-[0.12em] text-gray-400 hover:text-gray-900">
                            Terms
                        </Link>
                    </div>
                    <PaymentIcons />
                </div>
            </div>
        </footer>
    );
}
