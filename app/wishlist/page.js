"use client";

import { SITE_CONTAINER } from "@/lib/siteLayout";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import WishlistTab from "../profile/WishlistTab";
import Breadcrumbs from "../components/Breadcrumbs";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, isInitialized } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-16 md:pt-32 pb-24">
            <div className={SITE_CONTAINER}>
                <div className="relative mb-10 md:mb-16">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/30 blur-[120px] rounded-full -z-10" />
                    <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "My Wishlist" }]} />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mt-6 md:mt-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E91E63]" />
                                <span className="text-[10px] font-black text-[#E91E63] uppercase tracking-[0.3em]">Your Curated Collection</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-gray-900 tracking-tighter leading-none">
                                My Wishlist
                            </h1>
                            <p className="text-sm md:text-lg text-gray-400 mt-3 md:mt-6 max-w-lg leading-relaxed">
                                Pieces you&apos;ve fallen in love with. Collect your favorites and curate your perfect signature look.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <div className="bg-white border border-gray-100 px-5 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-[32px] shadow-sm text-center md:text-left inline-flex md:block items-baseline gap-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0 md:mb-1">Saved</p>
                                <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
                                    {wishlist.length}{" "}
                                    <span className="text-sm font-bold text-gray-300 ml-0.5">
                                        {wishlist.length === 1 ? "Item" : "Items"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-[320px] md:min-h-[500px]">
                    <WishlistTab
                        wishlist={wishlist}
                        initialized={isInitialized}
                        removeFromWishlist={removeFromWishlist}
                        addToCart={addToCart}
                    />
                </div>
            </div>
        </div>
    );
}
