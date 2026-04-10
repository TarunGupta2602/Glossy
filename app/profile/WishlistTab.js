

import Link from "next/link";
import Image from "next/image";
import { WishlistSkeleton } from "./ProfileSkeletons";

export default function WishlistTab({ wishlist, initialized, removeFromWishlist, addToCart }) {
    if (!initialized) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="col-span-full bg-white rounded-[40px] border border-dashed border-gray-200 p-12 md:p-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Curate Your Desire</h3>
                <p className="text-gray-400 mb-10 max-w-xs mx-auto text-sm">Collect the pieces that speak to your soul for later acquisition.</p>
                <Link href="/shop" className="inline-flex items-center gap-3 border-2 border-gray-900 text-gray-900 px-10 py-5 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-900 hover:text-white transition-all">
                    Explore Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {wishlist.map((item) => {
                const price = item.price || 0;
                const originalPrice = item.original_price || (price / 0.7);
                const discount = item.original_price
                    ? Math.round(((item.original_price - price) / item.original_price) * 100)
                    : 30;

                return (
                    <div key={item.id} className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-2 right-2 w-9 h-9 md:w-10 md:h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:text-red-500 transition-all shadow-lg z-20 md:opacity-0 md:group-hover:opacity-100 active:scale-90"
                                aria-label="Remove from wishlist"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>

                            <div className="absolute bottom-3 left-3">
                                <span className="bg-[#2E7D32] text-white text-[8px] md:text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-md shadow-sm">
                                    SAVE {discount}%
                                </span>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 flex flex-col flex-1">
                            <div className="mb-4 flex-1">
                                <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{item.category}</p>
                                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-tight line-clamp-1">{item.name}</h3>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-base md:text-lg font-black text-gray-900 italic">₹{price.toLocaleString()}</p>
                                    <p className="text-[10px] md:text-[12px] text-gray-300 line-through">₹{originalPrice.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full bg-gray-900 text-white py-3.5 md:py-4 rounded-xl text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase hover:bg-black transition-all active:scale-95 shadow-md"
                                >
                                    Add to Bag
                                </button>
                                <div className="flex items-center justify-between px-1 mt-1">
                                    <Link
                                        href={`/product/${item.id}`}
                                        className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                    >
                                        Details
                                    </Link>
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="text-[9px] md:text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

