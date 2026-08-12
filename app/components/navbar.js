"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
import { PROMO_LABEL } from "@/lib/promo";

const PRIMARY_LINKS = [
    { href: "/shop", label: "Shop" },
    { href: "/earrings", label: "Earrings" },
    { href: "/necklaces", label: "Necklaces" },
    { href: "/gifts/under-999", label: "Gifts" },
    { href: "/collection", label: "Collections" },
    { href: "/blog", label: "Blog" },
];

const QUICK_LINKS = [
    { href: "/earrings", label: "Earrings", hint: "Studs, hoops & drops" },
    { href: "/necklaces", label: "Necklaces", hint: "Chains & pendants" },
    { href: "/gifts/under-999", label: "Gifts ₹999", hint: "Ready to gift" },
    { href: "/gifts/under-499", label: "Gifts ₹499", hint: "Light & lovely" },
];

function IconBtn({ as: Comp = "button", className = "", children, ...props }) {
    return (
        <Comp
            className={`relative inline-flex items-center justify-center min-w-10 min-h-10 sm:min-w-11 sm:min-h-11 rounded-full text-gray-800 hover:text-[#E91E63] hover:bg-[#faf7f8] transition-colors duration-200 ${className}`}
            {...props}
        >
            {children}
        </Comp>
    );
}

function NavBadge({ count }) {
    if (!count) return null;
    return (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#E91E63] text-white text-[9px] font-bold leading-4 text-center shadow-sm">
            {count > 99 ? "99+" : count}
        </span>
    );
}

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
    const [scrolled, setScrolled] = useState(false);
    const shopMenuTimer = useRef(null);
    const { cartCount, openCart } = useCart();
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

    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        setIsShopMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const submitSearch = () => {
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        setIsMenuOpen(false);
        setSearchQuery("");
    };

    const openShopMenu = () => {
        if (shopMenuTimer.current) clearTimeout(shopMenuTimer.current);
        setIsShopMenuOpen(true);
    };

    const closeShopMenu = () => {
        shopMenuTimer.current = setTimeout(() => setIsShopMenuOpen(false), 120);
    };

    return (
        <>
            <nav
                className={`sticky top-0 z-50 w-full transition-[background,box-shadow,border-color] duration-300 ${
                    scrolled
                        ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_8px_30px_-18px_rgba(26,18,20,0.35)]"
                        : "bg-white/90 backdrop-blur-sm border-b border-transparent"
                }`}
            >
                <div className={`${SITE_CONTAINER} flex items-center justify-between gap-3 h-14 sm:h-16 md:h-[4.25rem]`}>
                    {/* Brand */}
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="group flex-shrink-0 min-w-0 focus:outline-none"
                        aria-label="The Luxe Jewels home"
                    >
                        <div className="leading-none">
                            <span className="block text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E91E63] mb-0.5">
                                The
                            </span>
                            <span className="font-playfair text-[1.05rem] sm:text-xl md:text-[1.35rem] font-semibold tracking-tight text-gray-900 whitespace-nowrap">
                                Luxe Jewels
                            </span>
                        </div>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
                        {PRIMARY_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                                    isActive(link.href)
                                        ? "text-[#E91E63]"
                                        : "text-gray-800 hover:text-[#E91E63]"
                                }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute left-3 right-3 -bottom-0.5 h-px bg-[#E91E63] transition-opacity ${
                                        isActive(link.href) ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            </Link>
                        ))}

                        <div
                            className="relative"
                            onMouseEnter={openShopMenu}
                            onMouseLeave={closeShopMenu}
                        >
                            <button
                                type="button"
                                className={`inline-flex items-center gap-1 px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                                    isShopMenuOpen ? "text-[#E91E63]" : "text-gray-800 hover:text-[#E91E63]"
                                }`}
                                aria-expanded={isShopMenuOpen}
                                aria-haspopup="true"
                            >
                                Categories
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    className={`transition-transform duration-200 ${isShopMenuOpen ? "rotate-180" : ""}`}
                                    aria-hidden
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            <div
                                className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
                                    isShopMenuOpen
                                        ? "opacity-100 visible translate-y-0"
                                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                                }`}
                            >
                                <div className="w-[22rem] rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_24px_60px_-28px_rgba(26,18,20,0.45)]">
                                    <div className="grid grid-cols-2 gap-1">
                                        {categories.slice(0, 8).map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={getCategoryHref(cat)}
                                                className="rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-[#fdf2f6] hover:text-[#E91E63] transition-colors truncate"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-2 border-t border-gray-50 pt-2 px-1 space-y-1.5">
                                        <Link
                                            href="/gifts/under-999"
                                            className="block rounded-lg px-2 py-1.5 text-[12px] font-semibold text-gray-800 hover:bg-[#fdf2f6] hover:text-[#E91E63]"
                                        >
                                            Gifts under ₹999
                                        </Link>
                                        <Link
                                            href="/gifts/under-499"
                                            className="block rounded-lg px-2 py-1.5 text-[12px] font-semibold text-gray-800 hover:bg-[#fdf2f6] hover:text-[#E91E63]"
                                        >
                                            Gifts under ₹499
                                        </Link>
                                        <Link
                                            href="/collection"
                                            className="inline-flex items-center gap-1.5 px-2 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#E91E63] hover:text-[#c2185b]"
                                        >
                                            View all collections
                                            <span aria-hidden>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/our-story"
                            className={`relative px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                                isActive("/our-story")
                                    ? "text-[#E91E63]"
                                    : "text-gray-800 hover:text-[#E91E63]"
                            }`}
                        >
                            Story
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        {/* Desktop search pill */}
                        <form
                            className="hidden md:flex items-center w-40 lg:w-48 xl:w-56 rounded-full border border-gray-200 bg-[#faf7f8] px-3 focus-within:border-gray-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/5 transition-all"
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitSearch();
                            }}
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-gray-400 shrink-0"
                                aria-hidden
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="search"
                                enterKeyHint="search"
                                placeholder="Search…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent py-2 pl-2 text-[13px] text-gray-800 placeholder:text-gray-400 outline-none focus:outline-none focus-visible:outline-none"
                                aria-label="Search jewellery"
                            />
                        </form>

                        {/* Mobile search toggle */}
                        <IconBtn
                            type="button"
                            className="md:hidden"
                            aria-label="Search"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </IconBtn>

                        <div className="relative hidden sm:block">
                            {user ? (
                                <>
                                    <IconBtn
                                        type="button"
                                        onClick={() => setIsUserMenuOpen((v) => !v)}
                                        aria-label="Account menu"
                                        aria-expanded={isUserMenuOpen}
                                    >
                                        <span className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-200">
                                            <Image
                                                src={
                                                    profile?.avatar ||
                                                    user.user_metadata?.avatar_url ||
                                                    "/logo.png"
                                                }
                                                alt=""
                                                fill
                                                sizes="28px"
                                                className="object-cover"
                                            />
                                        </span>
                                        {profile?.role === "admin" && (
                                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full" />
                                        )}
                                    </IconBtn>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl z-[60]">
                                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                                <p className="text-xs font-semibold text-gray-900 truncate">
                                                    {profile?.name ||
                                                        user.user_metadata?.full_name ||
                                                        "Account"}
                                                </p>
                                                <p className="text-[10px] text-gray-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#faf7f8] hover:text-[#E91E63]"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My profile
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    signOut();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#faf7f8] hover:text-[#E91E63]"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <IconBtn
                                    type="button"
                                    onClick={() => setIsLoginModalOpen(true)}
                                    aria-label="Sign in"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </IconBtn>
                            )}
                        </div>

                        <IconBtn as={Link} href="/wishlist" aria-label="Wishlist">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                            <NavBadge count={wishlist.length} />
                        </IconBtn>

                        <IconBtn type="button" onClick={openCart} aria-label="Shopping bag">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <NavBadge count={cartCount} />
                        </IconBtn>

                        <IconBtn
                            type="button"
                            className="lg:hidden"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={isMenuOpen}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="17" x2="14" y2="17" />
                            </svg>
                        </IconBtn>
                    </div>
                </div>

                {/* Mobile search overlay bar */}
                {isSearchOpen && (
                    <div className="md:hidden absolute inset-x-0 top-0 z-[60] h-14 bg-white border-b border-gray-100 shadow-sm">
                        <div className={`${SITE_CONTAINER} h-full flex items-center gap-2`}>
                            <div className="flex-1 flex items-center rounded-full border border-gray-200 bg-[#faf7f8] px-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0" aria-hidden>
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="search"
                                    enterKeyHint="search"
                                    autoFocus
                                    placeholder="Search jewellery…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") submitSearch();
                                        if (e.key === "Escape") setIsSearchOpen(false);
                                    }}
                                    className="flex-1 min-w-0 bg-transparent py-2.5 pl-2 text-base text-gray-900 outline-none focus:outline-none focus-visible:outline-none"
                                    aria-label="Search jewellery"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={submitSearch}
                                className="min-h-11 px-2 text-[11px] font-bold uppercase tracking-wider text-[#E91E63]"
                            >
                                Go
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="min-w-11 min-h-11 text-gray-500"
                                aria-label="Close search"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile / tablet drawer */}
            <div
                className={`lg:hidden fixed inset-0 z-[80] ${
                    isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
                aria-hidden={!isMenuOpen}
            >
                <button
                    type="button"
                    className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${
                        isMenuOpen ? "opacity-100" : "opacity-0"
                    }`}
                    aria-label="Close menu"
                    onClick={closeMenu}
                />

                <div
                    className={`absolute inset-y-0 right-0 w-[min(100%,22.5rem)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu"
                >
                    <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-gray-100">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E91E63]">
                                The Luxe Jewels
                            </p>
                            <p className="font-playfair text-xl font-semibold text-gray-900 mt-0.5">
                                Menu
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeMenu}
                            className="w-11 h-11 rounded-full bg-[#faf7f8] text-gray-600 inline-flex items-center justify-center"
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                        <Link
                            href="/shop?sort=popular"
                            onClick={closeMenu}
                            className="mb-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#fdf2f6] to-[#fff7f9] border border-[#E91E63]/15 px-4 py-4 active:scale-[0.99] transition-transform"
                        >
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E91E63]">
                                    {PROMO_LABEL}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    Unlock a free gift today
                                </p>
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E91E63]">
                                Shop →
                            </span>
                        </Link>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2.5">
                            Explore
                        </p>
                        <div className="grid grid-cols-2 gap-2.5 mb-6">
                            {QUICK_LINKS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className="rounded-2xl border border-gray-100 bg-[#fafafa] p-3.5 active:bg-[#fdf2f6] transition-colors"
                                >
                                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">{item.hint}</p>
                                </Link>
                            ))}
                        </div>

                        {categories.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2.5">
                                    Categories
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {categories.slice(0, 10).map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={getCategoryHref(cat)}
                                            onClick={closeMenu}
                                            className="rounded-full border border-gray-200 bg-white px-3.5 py-2 text-[12px] font-medium text-gray-800 active:border-[#E91E63] active:text-[#E91E63]"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/collection"
                                        onClick={closeMenu}
                                        className="rounded-full border border-[#E91E63]/25 bg-[#fdf2f6] px-3.5 py-2 text-[12px] font-semibold text-[#E91E63]"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                        )}

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2.5">
                            More
                        </p>
                        <div className="rounded-2xl border border-gray-100 overflow-hidden mb-6">
                            {[
                                { href: "/blog", label: "Blog — all articles" },
                                { href: "/gifts/under-999", label: "Gifts under ₹999" },
                                { href: "/gifts/under-499", label: "Gifts under ₹499" },
                                { href: "/our-story", label: "Our story" },
                                {
                                    href: "/wishlist",
                                    label: wishlist.length
                                        ? `Wishlist (${wishlist.length})`
                                        : "Wishlist",
                                },
                                { href: "/faqs", label: "FAQs" },
                                { href: "/contact", label: "Contact" },
                            ].map((item, idx) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-800 active:bg-[#fdf2f6] ${
                                        idx > 0 ? "border-t border-gray-50" : ""
                                    }`}
                                >
                                    {item.label}
                                    <span className="text-gray-300" aria-hidden>
                                        ›
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-2.5">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={closeMenu}
                                        className="flex min-h-12 items-center justify-center rounded-full border border-gray-200 text-sm font-semibold text-gray-900"
                                    >
                                        My profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            signOut();
                                            closeMenu();
                                        }}
                                        className="w-full min-h-11 text-sm font-medium text-gray-500"
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
                                    className="w-full min-h-12 rounded-full bg-[#E91E63] text-sm font-bold uppercase tracking-[0.14em] text-white active:bg-[#C2185B]"
                                >
                                    Sign in
                                </button>
                            )}

                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/35 bg-[#F0FFF4] text-sm font-semibold text-[#128C7E]"
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
