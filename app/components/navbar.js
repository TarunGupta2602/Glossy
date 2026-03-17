"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-[#E91E63]">
                        GLOSSY.
                    </Link>
                </div>

                {/* Center: Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/shop" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider">
                        Shop All
                    </Link>
                    <Link href="/earrings" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider">
                        Earrings
                    </Link>
                    <Link href="/necklaces" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider">
                        Necklaces
                    </Link>
                    <Link href="/our-story" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider">
                        Our Story
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-5">
                    {/* Search Icon */}
                    <button className="text-gray-800 hover:text-gray-500 transition-colors" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>

                    {/* User Icon */}
                    <button className="hidden sm:block text-gray-800 hover:text-gray-500 transition-colors" aria-label="User profile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>

                    {/* Bag Icon with Badge */}
                    <Link href="/cart" className="relative text-gray-800 hover:text-gray-500 transition-colors" aria-label="Shopping bag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span className="absolute -top-1.5 -right-2 bg-[#E91E63] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            0
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-800 hover:text-gray-500 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 bg-white space-y-4 flex flex-col items-center">
                    <Link href="/shop" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider py-2" onClick={() => setIsMenuOpen(false)}>
                        Shop All
                    </Link>
                    <Link href="/earrings" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider py-2" onClick={() => setIsMenuOpen(false)}>
                        Earrings
                    </Link>
                    <Link href="/necklaces" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider py-2" onClick={() => setIsMenuOpen(false)}>
                        Necklaces
                    </Link>
                    <Link href="/our-story" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider py-2" onClick={() => setIsMenuOpen(false)}>
                        Our Story
                    </Link>
                    <Link href="/profile" className="sm:hidden text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider py-2" onClick={() => setIsMenuOpen(false)}>
                        My Account
                    </Link>
                </div>
            )}
        </nav>
    );
}
