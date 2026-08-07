"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { WHATSAPP_URL, SUPPORT_EMAIL, SUPPORT_PHONE, BRAND_NAME } from "@/lib/constants";
import PaymentIcons from "./PaymentIcons";

export default function Footer() {
    const [year, setYear] = useState(2026);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="relative bg-gradient-to-b from-white via-[#fffafa] to-[#f9f9fb] border-t border-gray-100/50 pt-14 md:pt-24 pb-10 md:pb-12 overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1480px] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className={SITE_CONTAINER}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 pb-12 md:pb-20 border-b border-gray-100">

                    {/* Brand Identity Section */}
                    <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="mb-8 group block focus:outline-none">
                            <div className="flex flex-col items-center md:items-start leading-none gap-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#E91E63]">THE</span>
                                <span className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 uppercase">
                                    LUXE <span className="font-light text-gray-500">JEWELS</span>
                                </span>
                            </div>
                        </Link>

                        <p className="text-gray-500 text-base leading-relaxed max-w-sm font-medium mb-8">
                            Curating the finest anti-tarnish, waterproof jewellery that celebrates your unique sparkle. Modern luxury designed for every day.
                        </p>

                        <div className="space-y-3">
                            <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-3 text-gray-600 hover:text-[#E91E63] transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm font-medium">{SUPPORT_PHONE}</span>
                            </a>
                            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 text-gray-600 hover:text-[#E91E63] transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">{SUPPORT_EMAIL}</span>
                            </a>
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-[#25D366] transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span className="text-sm font-medium">WhatsApp Support</span>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">

                        {/* Shop Section */}
                        <div className="flex flex-col items-center md:items-start">
                            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-5 md:mb-8">Shop</h3>
                            <ul className="flex flex-col gap-3 md:gap-4 text-sm font-bold text-gray-600 group-links">
                                <li><Link href="/shop" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Shop All</Link></li>
                                <li><Link href="/earrings" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Earrings</Link></li>
                                <li><Link href="/necklaces" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Necklaces</Link></li>
                                <li><Link href="/collection" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Featured Collections</Link></li>
                            </ul>
                        </div>

                        {/* Experience Section */}
                        <div className="flex flex-col items-center md:items-start">
                            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-5 md:mb-8">Experience</h3>
                            <ul className="flex flex-col gap-3 md:gap-4 text-sm font-bold text-gray-600">
                                <li><Link href="/our-story" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Our Story</Link></li>
                                <li><Link href="/shipping-returns" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Shipping Policy</Link></li>
                                <li><Link href="/contact" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Contact Us</Link></li>
                                <li><Link href="/faqs" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">FAQs</Link></li>
                            </ul>
                        </div>

                        {/* Connection Section */}
                        <div className="flex flex-col items-center md:items-start col-span-2 lg:col-span-1 border-t md:border-t-0 pt-8 md:pt-0 border-gray-100">
                            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-5 md:mb-8">Connect</h3>
                            <p className="text-gray-600 text-sm font-medium mb-6 text-center md:text-left">
                                Join our community on Instagram for styling tips and exclusive updates.
                            </p>
                            <div className="flex items-center gap-4">
                                <a
                                    href="https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 text-gray-900 hover:bg-[#E91E63] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm font-bold text-sm"
                                    aria-label="Instagram"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    Instagram
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Copyright & Links */}
                    <div className="flex flex-col items-center md:items-start gap-3 order-2 md:order-1">
                        <p className="text-[13px] font-bold text-gray-900 tracking-tight">
                            © {year} {BRAND_NAME}. <span className="text-gray-600 font-medium">Crafted for the modern muse.</span>
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-[11px] font-black uppercase tracking-wide text-gray-600 hover:text-gray-900 transition-colors">Privacy</Link>
                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                            <Link href="/terms" className="text-[11px] font-black uppercase tracking-wide text-gray-600 hover:text-gray-900 transition-colors">Terms</Link>
                        </div>
                    </div>

                    {/* Payment Indicators */}
                    <div className="flex items-center gap-6 order-1 md:order-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex flex-col items-center md:items-end gap-3">
                            <span className="text-[9px] font-black text-black uppercase tracking-[0.25em]">Secure Payments via Razorpay</span>
                            <PaymentIcons />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

