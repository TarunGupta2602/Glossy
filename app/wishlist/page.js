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
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header & Breadcrumbs */}
                <div className="mb-12">
                    <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "My Wishlist" }]} />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">My Wishlist</h1>
                            <p className="text-gray-500 mt-3 font-medium">Pieces you&apos;ve fallen in love with.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-[#E91E63] bg-pink-50 px-4 py-2 rounded-full uppercase tracking-widest">
                                {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Wishlist Content */}
                <div className="bg-[#FAFAFA] rounded-[48px] p-8 md:p-12 border border-gray-100/50 min-h-[500px]">
                    <WishlistTab
                        wishlist={wishlist}
                        initialized={isInitialized}
                        removeFromWishlist={removeFromWishlist}
                        addToCart={addToCart}
                    />
                </div>

                {/* Continued Shopping CTA */}
                {wishlist.length > 0 && (
                    <div className="mt-16 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#E91E63] transition-colors group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
