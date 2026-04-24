"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const { user, profile, signInWithGoogle, signOut } = useAuth();
    const router = useRouter();

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-50/50 backdrop-blur-md bg-white/90 px-4 py-2.5 md:px-6 md:py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="group block focus:outline-none">
                            {/* Universal Text Logo */}
                            <div className="flex flex-col items-start leading-none pr-4">
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#E91E63] mb-1">THE</span>
                                <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900 uppercase">
                                    LUXE <span className="font-light text-gray-500">JEWELS</span>
                                </span>
                            </div>
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
                        <Link href="/blog" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider">
                            Blog
                        </Link>
                        <Link href="/our-story" className="text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors uppercase tracking-wider">
                            Our Story
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-3 md:space-x-5">
                        {/* Search Bar */}
                        <div className="flex items-center">
                            <div className={`
                                flex items-center transition-all duration-300 overflow-hidden
                                ${isSearchOpen
                                    ? "fixed inset-x-0 top-0 h-[72px] bg-white px-4 z-[60] md:relative md:inset-auto md:h-auto md:w-48 lg:w-64 md:opacity-100 md:bg-transparent"
                                    : "w-0 opacity-0 md:w-0"
                                }
                            `}>
                                <div className="flex items-center w-full max-w-7xl mx-auto gap-3">
                                    <input
                                        type="text"
                                        placeholder="Search jewelry..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-full py-2.5 md:py-1.5 px-5 md:px-4 text-sm focus:outline-none focus:border-[#E91E63] text-gray-800"
                                        autoFocus={isSearchOpen}
                                    />
                                    {isSearchOpen && (
                                        <button
                                            onClick={() => setIsSearchOpen(false)}
                                            className="md:hidden p-2 text-gray-400 hover:text-gray-900"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!isSearchOpen && (
                                <button
                                    className="text-gray-800 hover:text-[#E91E63] transition-colors p-1"
                                    aria-label="Search"
                                    onClick={() => setIsSearchOpen(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Authentication Section */}
                        <div className="relative flex items-center">
                            {user ? (
                                <div className="relative leading-none">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 focus:outline-none group"
                                        aria-label="User menu"
                                    >
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 group-hover:border-[#E91E63] transition-colors">
                                            <Image
                                                src={profile?.avatar || user.user_metadata?.avatar_url || "/placeholder.jpg"}
                                                alt={profile?.name || user.user_metadata?.full_name || "User"}
                                                fill
                                                sizes="32px"
                                                className="object-cover"
                                            />
                                        </div>
                                        {profile?.role === 'admin' && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full" title="Admin Access" />
                                        )}
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                                <p className="text-xs font-bold text-gray-900 truncate flex items-center gap-2">
                                                    {profile?.name || user.user_metadata?.full_name || "Account"}
                                                    {profile?.role === 'admin' && (
                                                        <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Admin</span>
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
                                <div className="relative leading-none">
                                    <button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="text-gray-800 hover:text-[#E91E63] transition-colors p-1"
                                        aria-label="Sign in"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Wishlist Icon with Badge */}
                        <Link href="/wishlist" className="relative text-gray-800 hover:text-[#E91E63] transition-colors" aria-label="Wishlist">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                            </svg>
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center transition-all duration-300 transform scale-110 shadow-sm">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* Bag Icon with Badge */}
                        <Link href="/cart" className="relative text-gray-800 hover:text-[#E91E63] transition-colors" aria-label="Shopping bag">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center transition-all duration-300 transform scale-110 shadow-sm">
                                    {cartCount}
                                </span>
                            )}
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
                    <div className="md:hidden mt-2 pb-4 bg-white border-t border-gray-50 flex flex-col items-center divide-y divide-gray-50">
                        <Link href="/shop" className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4" onClick={() => setIsMenuOpen(false)}>
                            Shop All
                        </Link>
                        <Link href="/wishlist" className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4" onClick={() => setIsMenuOpen(false)}>
                            My Wishlist
                            {wishlist.length > 0 && <span className="ml-2 bg-gray-900 text-white px-2 py-0.5 rounded-full text-[9px]">{wishlist.length}</span>}
                        </Link>
                        <Link href="/earrings" className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4" onClick={() => setIsMenuOpen(false)}>
                            Earrings
                        </Link>
                        <Link href="/necklaces" className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4" onClick={() => setIsMenuOpen(false)}>
                            Necklaces
                        </Link>
                        <Link href="/blog" className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4" onClick={() => setIsMenuOpen(false)}>
                            Blog
                        </Link>
                        <Link href="/our-story" className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4" onClick={() => setIsMenuOpen(false)}>
                            Our Story
                        </Link>
                        {user ? (
                            <div className="w-full flex flex-col items-center">
                                <Link href="/profile" className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4" onClick={() => setIsMenuOpen(false)}>
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-center text-xs font-semibold text-gray-500 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsLoginModalOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-center text-xs font-semibold text-gray-800 hover:text-[#E91E63] transition-colors uppercase tracking-widest py-4"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                )}

            </nav>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
}
