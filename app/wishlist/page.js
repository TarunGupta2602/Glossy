"use client";

import Link from "next/link";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import WishlistTab from "../profile/WishlistTab";
import Breadcrumbs from "../components/Breadcrumbs";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, isInitialized } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header & Breadcrumbs */}
                <div className="relative mb-16">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/30 blur-[120px] rounded-full -z-10" />
                    <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "My Wishlist" }]} />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E91E63]" />
                                <span className="text-[10px] font-black text-[#E91E63] uppercase tracking-[0.3em]">Your Curated Collection</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter leading-none">
                                My Wishlist
                            </h1>
                            <p className="text-base md:text-lg text-gray-400 mt-6 max-w-lg leading-relaxed">
                                Pieces you&apos;ve fallen in love with. Collect your favorites and curate your perfect signature look.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <div className="bg-white border border-gray-100 px-8 py-5 rounded-[32px] shadow-sm text-center md:text-left">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Saved Pieces</p>
                                <p className="text-3xl font-black text-gray-900 leading-none">
                                    {wishlist.length} <span className="text-sm font-bold text-gray-300 ml-1">{wishlist.length === 1 ? 'Item' : 'Items'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wishlist Content */}
                <div className="min-h-[500px]">
                    <WishlistTab
                        wishlist={wishlist}
                        initialized={isInitialized}
                        removeFromWishlist={removeFromWishlist}
                        addToCart={addToCart}
                    />
                </div>

                {/* Continued Shopping CTA */}
                {wishlist.length > 0 && (
                    <div className="mt-24 pt-12 border-t border-gray-100/60 flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-gray-400 text-sm italic">&ldquo;Quality is never an accident; it is always the result of intelligent effort.&rdquo;</p>
                        <Link
                            href="/shop"
                            className="bg-gray-900 text-white px-10 py-5 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-3"
                        >
                            Explore More Pieces
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
