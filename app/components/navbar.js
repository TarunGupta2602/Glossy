"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import LoginModal from "./LoginModal";
import { getCategoryHref } from "@/lib/categoryLanding";
import { useOverlayOpen } from "../context/OverlayContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { WHATSAPP_URL } from "@/lib/constants";

const QUICK_LINKS = [
    { href: "/earrings", label: "Earrings", hint: "Studs, hoops & drops" },
    { href: "/necklaces", label: "Necklaces", hint: "Chains & pendants" },
    { href: "/shop", label: "Shop all", hint: "Full catalogue" },
    { href: "/collection", label: "Collections", hint: "Shop by style" },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useOverlayOpen(isMenuOpen);
    useBodyScrollLock(isMenuOpen);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const { user, profile, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCategories(data.categories || []);
            })
            .catch(() => {});
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
    }, [pathname]);

    const closeMenu = () => setIsMenuOpen(false);

    const submitSearch = () => {
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        setIsMenuOpen(false);
        setSearchQuery("");
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") submitSearch();
    };

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-gray-50/50 bg-white/95 backdrop-blur-md py-2 md:py-4">
                <div className={`${SITE_CONTAINER} flex items-center justify-between gap-2`}>
                    <div className="flex-shrink-0 min-w-0">
                        <Link
                            href="/"
                            className="group block focus:outline-none"
                            onClick={closeMenu}
                        >
                            <div className="flex flex-col items-start leading-none pr-1 sm:pr-4">
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-[#E91E63] mb-0.5 md:mb-1">
                                    THE
                                </span>
                                <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-gray-900 uppercase whitespace-nowrap">
                                    LUXE <span className="font-light text-gray-500">JEWELS</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/collection"
                            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider"
                        >
                            Collections
                        </Link>
                        <Link
                            href="/shop"
                            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider"
                        >
                            Shop All
                        </Link>
                        <div
                            className="relative"
                            onMouseEnter={() => setIsShopMenuOpen(true)}
                            onMouseLeave={() => setIsShopMenuOpen(false)}
                        >
                            <button className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider">
                                Categories ▾
                            </button>
                            {isShopMenuOpen && categories.length > 0 && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl py-3 z-[70]">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={getCategoryHref(cat)}
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#E91E63] transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                    <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                                        <Link
                                            href="/collection"
                                            className="text-xs font-bold uppercase tracking-widest text-[#E91E63]"
                                        >
                                            View All Collections →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link
                            href="/earrings"
                            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider"
                        >
                            Earrings
                        </Link>
                        <Link
                            href="/necklaces"
                            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider"
                        >
                            Necklaces
                        </Link>
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/our-story"
                            className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider"
                        >
                            Our Story
                        </Link>
                    </div>

                    <div className="flex items-center gap-0.5 sm:gap-3 md:gap-5 flex-shrink-0">
                        <div className="flex items-center">
                            <div
                                className={`flex items-center transition-all duration-300 overflow-hidden ${
                                    isSearchOpen
                                        ? "fixed inset-x-0 top-0 h-[64px] sm:h-[72px] bg-white px-3 sm:px-4 z-[60] shadow-sm md:relative md:inset-auto md:h-auto md:w-48 lg:w-64 md:opacity-100 md:bg-transparent md:shadow-none"
                                        : "w-0 opacity-0 md:w-0"
                                }`}
                            >
                                <div className={`${SITE_CONTAINER} flex items-center w-full gap-2 sm:gap-3`}>
                                    <input
                                        type="search"
                                        enterKeyHint="search"
                                        placeholder="Search jewellery..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-full py-2.5 md:py-1.5 px-4 text-base md:text-sm focus:outline-none focus:border-[#E91E63] text-gray-800"
                                        autoFocus={isSearchOpen}
                                        aria-label="Search jewellery"
                                    />
                                    <button
                                        type="button"
                                        onClick={submitSearch}
                                        className="md:hidden min-h-11 px-3 text-xs font-bold uppercase tracking-wider text-[#E91E63]"
                                    >
                                        Go
                                    </button>
                                    {isSearchOpen && (
                                        <button
                                            type="button"
                                            onClick={() => setIsSearchOpen(false)}
                                            className="md:hidden p-2 text-gray-400 hover:text-gray-900 flex-shrink-0 min-w-11 min-h-11 inline-flex items-center justify-center"
                                            aria-label="Close search"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 6 6 18M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!isSearchOpen && (
                                <button
                                    type="button"
                                    className="text-gray-800 hover:text-[#E91E63] transition-colors min-w-11 min-h-11 inline-flex items-center justify-center"
                                    aria-label="Search"
                                    onClick={() => setIsSearchOpen(true)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="md:w-[22px] md:h-[22px]"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="relative hidden sm:flex items-center">
                            {user ? (
                                <div className="relative leading-none">
                                    <button
                                        type="button"
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 focus:outline-none group"
                                        aria-label="User menu"
                                    >
                                        <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-gray-100 group-hover:border-[#E91E63] transition-colors">
                                            <Image
                                                src={
                                                    profile?.avatar ||
                                                    user.user_metadata?.avatar_url ||
                                                    "/logo.png"
                                                }
                                                alt={
                                                    profile?.name ||
                                                    user.user_metadata?.full_name ||
                                                    "User"
                                                }
                                                fill
                                                sizes="32px"
                                                className="object-cover"
                                            />
                                        </div>
                                        {profile?.role === "admin" && (
                                            <span
                                                className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full"
                                                title="Admin Access"
                                            />
                                        )}
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[60]">
                                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                                <p className="text-xs font-bold text-gray-900 truncate flex items-center gap-2">
                                                    {profile?.name ||
                                                        user.user_metadata?.full_name ||
                                                        "Account"}
                                                    {profile?.role === "admin" && (
                                                        <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                            Admin
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-gray-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E91E63] transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    signOut();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E91E63] transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="text-gray-800 hover:text-[#E91E63] transition-colors p-1.5 min-w-11 min-h-11 inline-flex items-center justify-center"
                                    aria-label="Sign in"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="md:w-[22px] md:h-[22px]"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <Link
                            href="/wishlist"
                            className="relative text-gray-800 hover:text-[#E91E63] transition-colors min-w-11 min-h-11 inline-flex items-center justify-center"
                            aria-label="Wishlist"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-[22px] md:h-[22px]"
                            >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                            {wishlist.length > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-[#E91E63] text-white text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center shadow-sm">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/cart"
                            className="relative text-gray-800 hover:text-[#E91E63] transition-colors min-w-11 min-h-11 inline-flex items-center justify-center"
                            aria-label="Shopping bag"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-[22px] md:h-[22px]"
                            >
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-[#E91E63] text-white text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            className="md:hidden text-gray-800 hover:text-gray-500 transition-colors min-w-11 min-h-11 inline-flex items-center justify-center -mr-1"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {isMenuOpen ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile full-screen drawer */}
            <div
                className={`md:hidden fixed inset-0 z-[80] ${
                    isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
                aria-hidden={!isMenuOpen}
            >
                <button
                    type="button"
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                        isMenuOpen ? "opacity-100" : "opacity-0"
                    }`}
                    aria-label="Close menu"
                    onClick={closeMenu}
                />

                <div
                    className={`absolute inset-y-0 right-0 w-[min(100%,22rem)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                >
                    <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b border-gray-100">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E91E63]">
                                Menu
                            </p>
                            <p className="text-sm font-bold text-gray-900">Shop The Luxe Jewels</p>
                        </div>
                        <button
                            type="button"
                            onClick={closeMenu}
                            className="min-w-11 min-h-11 inline-flex items-center justify-center text-gray-500"
                            aria-label="Close menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                        <form
                            className="mb-5"
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitSearch();
                            }}
                        >
                            <label className="sr-only" htmlFor="mobile-nav-search">
                                Search jewellery
                            </label>
                            <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-gray-400 flex-shrink-0"
                                    aria-hidden="true"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    id="mobile-nav-search"
                                    type="search"
                                    enterKeyHint="search"
                                    placeholder="Search earrings, necklaces…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 min-w-0 bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                />
                            </div>
                        </form>

                        <Link
                            href="/shop?sort=popular"
                            onClick={closeMenu}
                            className="mb-5 flex items-center justify-between rounded-2xl bg-[#FFF0F5] border border-pink-100 px-4 py-3.5 active:scale-[0.99] transition-transform"
                        >
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#E91E63]">
                                    Offer
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                    Buy 2, get 1 free
                                </p>
                            </div>
                            <span className="text-xs font-bold text-[#E91E63]">Shop →</span>
                        </Link>

                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5">
                            Shop
                        </p>
                        <div className="grid grid-cols-2 gap-2.5 mb-6">
                            {QUICK_LINKS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className="rounded-2xl border border-gray-100 bg-white p-3.5 active:bg-pink-50 transition-colors"
                                >
                                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">{item.hint}</p>
                                </Link>
                            ))}
                        </div>

                        {categories.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5">
                                    Categories
                                </p>
                                <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden">
                                    {categories.slice(0, 8).map((cat, idx) => (
                                        <Link
                                            key={cat.id}
                                            href={getCategoryHref(cat)}
                                            onClick={closeMenu}
                                            className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-800 active:bg-pink-50 ${
                                                idx > 0 ? "border-t border-gray-50" : ""
                                            }`}
                                        >
                                            <span className="truncate">{cat.name}</span>
                                            <span className="text-gray-300" aria-hidden>
                                                ›
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2.5">
                            More
                        </p>
                        <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden mb-6">
                            {[
                                { href: "/blog", label: "Blog / Journal" },
                                { href: "/our-story", label: "Our Story" },
                                { href: "/wishlist", label: `Wishlist${wishlist.length ? ` (${wishlist.length})` : ""}` },
                                { href: "/faqs", label: "FAQs" },
                                { href: "/contact", label: "Contact" },
                            ].map((item, idx) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`px-4 py-3.5 text-sm font-medium text-gray-800 active:bg-pink-50 ${
                                        idx > 0 ? "border-t border-gray-50" : ""
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-2.5">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={closeMenu}
                                        className="flex min-h-12 items-center justify-center rounded-xl border border-gray-200 text-sm font-bold text-gray-900"
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            signOut();
                                            closeMenu();
                                        }}
                                        className="w-full min-h-12 rounded-xl text-sm font-semibold text-gray-500"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoginModalOpen(true);
                                        closeMenu();
                                    }}
                                    className="w-full min-h-12 rounded-xl bg-[#E91E63] text-sm font-bold uppercase tracking-widest text-white active:bg-[#C2185B]"
                                >
                                    Sign in
                                </button>
                            )}

                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#F0FFF4] text-sm font-bold text-[#128C7E]"
                            >
                                WhatsApp support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
}
