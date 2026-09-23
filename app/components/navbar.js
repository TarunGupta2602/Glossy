"use client";

import { HOME_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import LoginModal from "./LoginModal";
import { useOverlayOpen } from "../context/OverlayContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { WHATSAPP_URL } from "@/lib/constants";
import { PROMO_LABEL } from "@/lib/promo";
import { getProductPath } from "@/lib/seo";
import BrandLogo from "./BrandLogo";

const SHOP_LINKS = [
    { href: "/shop", label: "Shop all" },
    { href: "/earrings", label: "Earrings" },
    { href: "/necklaces", label: "Necklaces" },
    { href: "/bracelets", label: "Bracelets" },
    { href: "/rings", label: "Rings" },
];

const SHOP_EXTRAS = [
    { href: "/shop?sort=newest", label: "New arrivals" },
    { href: "/shop?sort=popular", label: "Bestsellers" },
];

const GIFT_LINKS = [
    { href: "/gifts/under-999", label: "Gifts under ₹999", hint: "Gift-ready" },
    { href: "/gifts/under-499", label: "Gifts under ₹499", hint: "Everyday sparkle" },
    { href: "/festive/diwali", label: "Diwali jewellery", hint: "Festive under ₹999" },
    { href: "/festive/navratri", label: "Navratri jewellery", hint: "Desk to dandiya" },
];

const PRIMARY_LINKS = [
    { href: "/collection", label: "Collections" },
    { href: "/blog", label: "Blog" },
    { href: "/our-story", label: "Story" },
];

function IconBtn({ as: Comp = "button", className = "", children, ...props }) {
    return (
        <Comp
            className={`relative inline-flex items-center justify-center min-w-10 min-h-10 sm:min-w-11 sm:min-h-11 rounded-full text-[#2a2724] hover:text-[#E91E63] hover:bg-[#fdfbf7] transition-colors duration-200 ${className}`}
            {...props}
        >
            {children}
        </Comp>
    );
}

function NavBadge({ count, always = false }) {
    if (!always && !count) return null;
    return (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#E91E63] text-white text-[9px] font-bold leading-4 text-center shadow-sm">
            {count > 99 ? "99+" : count}
        </span>
    );
}

function NavLinkClass(active) {
    return `relative px-2.5 xl:px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
        active ? "text-[#E91E63]" : "text-gray-800 hover:text-[#E91E63]"
    }`;
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
    const [isGiftsMenuOpen, setIsGiftsMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [catalog, setCatalog] = useState(null);
    const [catalogLoading, setCatalogLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const shopMenuTimer = useRef(null);
    const giftsMenuTimer = useRef(null);
    const searchInputRef = useRef(null);
    const { cartCount, openCart } = useCart();
    const { wishlist } = useWishlist();
    const { user, profile, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useOverlayOpen(isMenuOpen);
    useBodyScrollLock(isMenuOpen);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        setIsShopMenuOpen(false);
        setIsGiftsMenuOpen(false);
        setMobileOpen(null);
    }, [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!isSearchOpen) return undefined;
        const id = window.setTimeout(() => searchInputRef.current?.focus(), 30);
        return () => window.clearTimeout(id);
    }, [isSearchOpen]);

    useEffect(() => {
        if (!isSearchOpen || catalog || catalogLoading) return undefined;
        let cancelled = false;
        setCatalogLoading(true);
        fetch("/api/products?lite=1")
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled) setCatalog(Array.isArray(data.products) ? data.products : []);
            })
            .catch(() => {
                if (!cancelled) setCatalog([]);
            })
            .finally(() => {
                if (!cancelled) setCatalogLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [isSearchOpen, catalog, catalogLoading]);

    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (href) => {
        if (href === "/") return pathname === "/";
        if (href === "/shop") return pathname === "/shop";
        if (href.startsWith("/festive/")) return pathname?.startsWith("/festive");
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const shopActive = ["/shop", "/earrings", "/necklaces", "/bracelets", "/rings"].some(
        (href) => pathname === href || pathname.startsWith(`${href}/`)
    );
    const giftsActive =
        pathname?.startsWith("/gifts") || pathname?.startsWith("/festive");

    const submitSearch = () => {
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        setIsMenuOpen(false);
        setSearchQuery("");
    };

    const searchHits = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q || !Array.isArray(catalog)) return [];
        return catalog
            .filter((product) => String(product.name || "").toLowerCase().includes(q))
            .slice(0, 6);
    }, [catalog, searchQuery]);

    const openTimed = (which) => {
        if (which === "shop") {
            if (shopMenuTimer.current) clearTimeout(shopMenuTimer.current);
            setIsShopMenuOpen(true);
            setIsGiftsMenuOpen(false);
        } else {
            if (giftsMenuTimer.current) clearTimeout(giftsMenuTimer.current);
            setIsGiftsMenuOpen(true);
            setIsShopMenuOpen(false);
        }
    };

    const closeTimed = (which) => {
        const timer = which === "shop" ? shopMenuTimer : giftsMenuTimer;
        const setter = which === "shop" ? setIsShopMenuOpen : setIsGiftsMenuOpen;
        timer.current = setTimeout(() => setter(false), 120);
    };

    return (
        <>
            <nav
                className={`sticky top-0 z-50 w-full transition-[background,box-shadow,border-color] duration-300 ${
                    scrolled
                        ? "bg-white/97 backdrop-blur-md border-b border-[#efeae4] shadow-[0_6px_24px_-16px_rgba(42,39,36,0.28)]"
                        : "bg-white/95 backdrop-blur-sm border-b border-transparent"
                }`}
            >
                <div className={`${HOME_CONTAINER} flex items-center justify-between gap-2 h-14 sm:h-16 md:h-[4.25rem]`}>
                    <BrandLogo href="/" onClick={closeMenu} size="md" priority />

                    <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0">
                        <div
                            className="relative"
                            onMouseEnter={() => openTimed("shop")}
                            onMouseLeave={() => closeTimed("shop")}
                        >
                            <button
                                type="button"
                                className={`${NavLinkClass(shopActive || isShopMenuOpen)} inline-flex items-center gap-1`}
                                aria-expanded={isShopMenuOpen}
                                aria-haspopup="true"
                                onClick={() => setIsShopMenuOpen((v) => !v)}
                            >
                                Shop
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
                                className={`absolute top-full left-0 pt-3 transition-all duration-200 ${
                                    isShopMenuOpen
                                        ? "opacity-100 visible translate-y-0"
                                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                                }`}
                            >
                                <div className="w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_24px_60px_-28px_rgba(26,18,20,0.45)]">
                                    {SHOP_LINKS.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`block rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                                                isActive(item.href)
                                                    ? "bg-[#fdf2f6] text-[#E91E63]"
                                                    : "text-gray-700 hover:bg-[#fdf2f6] hover:text-[#E91E63]"
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <div className="mt-1 border-t border-gray-50 pt-1">
                                        {SHOP_EXTRAS.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="block rounded-xl px-3 py-2 text-[12px] font-semibold text-gray-600 hover:bg-[#fdf2f6] hover:text-[#E91E63]"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="relative"
                            onMouseEnter={() => openTimed("gifts")}
                            onMouseLeave={() => closeTimed("gifts")}
                        >
                            <button
                                type="button"
                                className={`${NavLinkClass(giftsActive || isGiftsMenuOpen)} inline-flex items-center gap-1`}
                                aria-expanded={isGiftsMenuOpen}
                                aria-haspopup="true"
                                onClick={() => setIsGiftsMenuOpen((v) => !v)}
                            >
                                Gifts
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    className={`transition-transform duration-200 ${isGiftsMenuOpen ? "rotate-180" : ""}`}
                                    aria-hidden
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>
                            <div
                                className={`absolute top-full left-0 pt-3 transition-all duration-200 ${
                                    isGiftsMenuOpen
                                        ? "opacity-100 visible translate-y-0"
                                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                                }`}
                            >
                                <div className="w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_24px_60px_-28px_rgba(26,18,20,0.45)]">
                                    {GIFT_LINKS.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`block rounded-xl px-3 py-2.5 transition-colors ${
                                                isActive(item.href)
                                                    ? "bg-[#fdf2f6] text-[#E91E63]"
                                                    : "text-gray-700 hover:bg-[#fdf2f6] hover:text-[#E91E63]"
                                            }`}
                                        >
                                            <span className="block text-[13px] font-medium">{item.label}</span>
                                            {item.hint ? (
                                                <span className="block text-[11px] text-[#8a847c] mt-0.5">
                                                    {item.hint}
                                                </span>
                                            ) : null}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {PRIMARY_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={NavLinkClass(isActive(link.href))}
                            >
                                {link.label}
                                <span
                                    className={`absolute left-2.5 right-2.5 -bottom-0.5 h-px bg-[#E91E63] transition-opacity ${
                                        isActive(link.href) ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <IconBtn
                            type="button"
                            aria-label="Search jewellery"
                            aria-expanded={isSearchOpen}
                            onClick={() => {
                                setIsSearchOpen((v) => !v);
                                setIsUserMenuOpen(false);
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </IconBtn>

                        {user ? (
                            <div className="relative hidden sm:block shrink-0">
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
                            </div>
                        ) : (
                            <span className="hidden sm:inline-flex">
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
                            </span>
                        )}

                        <IconBtn as={Link} href="/wishlist" aria-label="Wishlist">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                            <NavBadge count={wishlist.length} />
                        </IconBtn>

                        <IconBtn
                            type="button"
                            onClick={openCart}
                            aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            <NavBadge count={cartCount} always />
                        </IconBtn>

                        <span className="hidden lg:inline-flex">
                        <IconBtn
                            as="a"
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat on WhatsApp"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17 0-.37 0-.57 0-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
                                <path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.87 11.87 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89C24 5.34 18.6 0 12.05 0zm0 21.73h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88z" />
                            </svg>
                        </IconBtn>
                        </span>

                        <IconBtn
                            type="button"
                            className="lg:hidden"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="relative block h-3.5 w-[18px]" aria-hidden>
                                <span className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-current" />
                                <span className="absolute left-0 top-[6px] block h-[1.5px] w-full rounded-full bg-current" />
                                <span className="absolute left-0 top-[12px] block h-[1.5px] w-[65%] rounded-full bg-current" />
                            </span>
                        </IconBtn>
                    </div>
                </div>

                {isSearchOpen && (
                    <div className="absolute inset-x-0 top-full z-[60] border-b border-[#efeae4] bg-white shadow-[0_16px_40px_-24px_rgba(42,39,36,0.35)]">
                        <div className={`${HOME_CONTAINER} py-3 sm:py-4`}>
                            <form
                                className="flex items-center gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    submitSearch();
                                }}
                            >
                                <div className="flex-1 flex items-center rounded-full border border-[#efeae4] bg-[#fdfbf7] px-3.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[#a89880] shrink-0" aria-hidden>
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        ref={searchInputRef}
                                        type="search"
                                        enterKeyHint="search"
                                        placeholder="Search earrings, necklaces…"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Escape") setIsSearchOpen(false);
                                        }}
                                        className="flex-1 min-w-0 bg-transparent py-2.5 pl-2.5 text-[15px] text-[#2a2724] placeholder:text-[#a89880] outline-none"
                                        aria-label="Search catalogue"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="min-h-11 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2a2724]"
                                >
                                    Go
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="min-w-11 min-h-11 rounded-full text-[#6b6560] hover:bg-[#fdfbf7]"
                                    aria-label="Close search"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </form>

                            {searchQuery.trim() ? (
                                <div className="mt-3">
                                    {catalogLoading && !catalog ? (
                                        <p className="text-[13px] text-[#8a847c] px-1 py-2">Searching…</p>
                                    ) : searchHits.length > 0 ? (
                                        <ul className="divide-y divide-[#efeae4]">
                                            {searchHits.map((product) => (
                                                <li key={product.id}>
                                                    <Link
                                                        href={getProductPath(product)}
                                                        onClick={() => setIsSearchOpen(false)}
                                                        className="flex items-center gap-3 py-2.5 px-1 hover:bg-[#fdfbf7] rounded-xl"
                                                    >
                                                        <span className="relative w-11 h-11 shrink-0 overflow-hidden rounded-lg bg-[#f4f2f0]">
                                                            <Image
                                                                src={product.main_image || "/logo.png"}
                                                                alt=""
                                                                fill
                                                                sizes="44px"
                                                                className="object-cover"
                                                            />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block text-[13px] font-medium text-[#2a2724] truncate">
                                                                {product.name}
                                                            </span>
                                                            {product.price != null && (
                                                                <span className="block text-[12px] text-[#8a847c] tabular-nums">
                                                                    ₹{Number(product.price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-[13px] text-[#8a847c] px-1 py-2">
                                            No matching pieces. Try earrings or necklace.
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={submitSearch}
                                        className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E91E63]"
                                    >
                                        See all results →
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </nav>

            <div
                className={`lg:hidden fixed inset-0 z-[80] ${
                    isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
                aria-hidden={!isMenuOpen}
            >
                <button
                    type="button"
                    className={`absolute inset-0 bg-[#2a2724]/35 transition-opacity duration-300 ${
                        isMenuOpen ? "opacity-100" : "opacity-0"
                    }`}
                    aria-label="Close menu"
                    onClick={closeMenu}
                />

                <div
                    className={`absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-[#fdfbf7] shadow-[-12px_0_40px_-20px_rgba(42,39,36,0.35)] transition-transform ease-out ${
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu"
                    style={{ transitionDuration: "300ms" }}
                >
                    <div className="flex items-center justify-between gap-3 px-5 sm:px-7 pt-[max(0.85rem,env(safe-area-inset-top))] pb-3.5 border-b border-[#efeae4] bg-white">
                        <BrandLogo href="/" onClick={closeMenu} size="sm" />
                        <button
                            type="button"
                            onClick={closeMenu}
                            className="w-10 h-10 rounded-full border border-[#efeae4] bg-[#fdfbf7] text-[#2a2724] inline-flex items-center justify-center active:scale-95 transition-transform"
                            aria-label="Close menu"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 py-5">
                        <Link
                            href="/shop?sort=popular"
                            onClick={closeMenu}
                            className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-[#efeae4] bg-white px-4 py-3.5 active:scale-[0.99] transition-transform"
                        >
                            <div className="min-w-0">
                                <p
                                    className="text-[9px] font-medium uppercase tracking-[0.18em]"
                                    style={{ color: "#b89a6a" }}
                                >
                                    {PROMO_LABEL}
                                </p>
                                <p className="text-[13px] font-medium text-[#2a2724] mt-1 leading-snug">
                                    Complimentary gift with every 2 pieces
                                </p>
                            </div>
                            <span
                                className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em]"
                                style={{ color: "#b89a6a" }}
                            >
                                Shop
                            </span>
                        </Link>

                        <nav className="mb-7" aria-label="Primary">
                            <div className="border-b border-[#efeae4]/80">
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen((v) => (v === "shop" ? null : "shop"))}
                                    className={`flex w-full items-center justify-between py-3 ${
                                        shopActive ? "text-[#E91E63]" : "text-[#2a2724]"
                                    }`}
                                    aria-expanded={mobileOpen === "shop"}
                                >
                                    <span className="font-playfair text-[1.4rem] font-medium tracking-tight leading-none">
                                        Shop
                                    </span>
                                    <span
                                        className={`text-[#d4cbc0] text-base transition-transform ${
                                            mobileOpen === "shop" ? "rotate-90" : ""
                                        }`}
                                        aria-hidden
                                    >
                                        →
                                    </span>
                                </button>
                                {mobileOpen === "shop" && (
                                    <div className="pb-3 space-y-0.5">
                                        {[...SHOP_LINKS, ...SHOP_EXTRAS].map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={closeMenu}
                                                className={`block py-2 pl-1 text-[14px] ${
                                                    isActive(item.href) ? "text-[#E91E63] font-semibold" : "text-[#6b6560]"
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-b border-[#efeae4]/80">
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen((v) => (v === "gifts" ? null : "gifts"))}
                                    className={`flex w-full items-center justify-between py-3 ${
                                        giftsActive ? "text-[#E91E63]" : "text-[#2a2724]"
                                    }`}
                                    aria-expanded={mobileOpen === "gifts"}
                                >
                                    <span className="font-playfair text-[1.4rem] font-medium tracking-tight leading-none">
                                        Gifts
                                    </span>
                                    <span
                                        className={`text-[#d4cbc0] text-base transition-transform ${
                                            mobileOpen === "gifts" ? "rotate-90" : ""
                                        }`}
                                        aria-hidden
                                    >
                                        →
                                    </span>
                                </button>
                                {mobileOpen === "gifts" && (
                                    <div className="pb-3 space-y-0.5">
                                        {GIFT_LINKS.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={closeMenu}
                                                className={`block py-2 pl-1 ${
                                                    isActive(item.href) ? "text-[#E91E63]" : "text-[#6b6560]"
                                                }`}
                                            >
                                                <span className="block text-[14px] font-medium">{item.label}</span>
                                                {item.hint ? (
                                                    <span className="block text-[12px] text-[#8a847c] mt-0.5">
                                                        {item.hint}
                                                    </span>
                                                ) : null}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ul>
                                {PRIMARY_LINKS.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`group flex items-center justify-between py-3 border-b border-[#efeae4]/80 ${
                                                isActive(item.href) ? "text-[#E91E63]" : "text-[#2a2724]"
                                            }`}
                                        >
                                            <span className="font-playfair text-[1.4rem] font-medium tracking-tight leading-none">
                                                {item.label}
                                            </span>
                                            <span
                                                className="text-[#d4cbc0] text-base transition-transform group-active:translate-x-0.5"
                                                aria-hidden
                                            >
                                                →
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <p
                            className="text-[9px] font-medium uppercase tracking-[0.18em] mb-1.5"
                            style={{ color: "#b89a6a" }}
                        >
                            Help
                        </p>
                        <div className="space-y-0.5">
                            {[
                                {
                                    href: "/wishlist",
                                    label: wishlist.length
                                        ? `Wishlist (${wishlist.length})`
                                        : "Wishlist",
                                },
                                { href: "/faqs", label: "FAQs" },
                                { href: "/shipping-returns", label: "Shipping & returns" },
                                { href: "/contact", label: "Contact" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className="flex items-center justify-between py-2.5 text-[13px] text-[#6b6560] active:text-[#2a2724] transition-colors"
                                >
                                    {item.label}
                                    <span className="text-[#d4cbc0]" aria-hidden>
                                        ›
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-[#efeae4] bg-white px-5 sm:px-7 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2">
                        {user ? (
                            <div className="flex gap-2">
                                <Link
                                    href="/profile"
                                    onClick={closeMenu}
                                    className="flex-1 flex min-h-11 items-center justify-center rounded-full bg-[#2a2724] text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                                >
                                    My profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        signOut();
                                        closeMenu();
                                    }}
                                    className="min-h-11 px-4 rounded-full border border-[#efeae4] text-[12px] font-medium text-[#6b6560]"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoginModalOpen(true);
                                    closeMenu();
                                }}
                                className="w-full min-h-11 rounded-full bg-[#2a2724] text-[11px] font-semibold uppercase tracking-[0.14em] text-white active:bg-[#E91E63] transition-colors"
                            >
                                Sign in
                            </button>
                        )}

                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#efeae4] bg-[#fdfbf7] text-[13px] font-medium text-[#2a2724]"
                        >
                            <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ backgroundColor: "#25D366" }}
                                aria-hidden
                            />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
}
