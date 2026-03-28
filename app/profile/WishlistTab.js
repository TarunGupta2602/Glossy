

import Link from "next/link";
import Image from "next/image";
import { WishlistSkeleton } from "./ProfileSkeletons";

export default function WishlistTab({ wishlist, initialized, removeFromWishlist, addToCart }) {
    if (!initialized) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <WishlistSkeleton />
                <WishlistSkeleton />
                <WishlistSkeleton />
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="col-span-full bg-white rounded-[40px] border border-dashed border-gray-200 p-20 text-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
                <div key={item.id} className="group flex flex-col h-full bg-white rounded-[40px] border border-gray-100/60 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700">
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                        <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:text-red-500 transition-all shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                        <div className="mb-6 flex-1">
                            <p className="text-[10px] text-[#E91E63] font-black uppercase tracking-[0.25em] mb-3">{item.category}</p>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#E91E63] transition-colors">{item.name}</h3>
                            <p className="text-xl font-black text-gray-900 italic">₹{item.price?.toLocaleString() || "0.00"}</p>
                        </div>


                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => addToCart(item)}
                                className="w-full bg-gray-900 text-white py-5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg active:scale-95"
                            >
                                Move to Bag
                            </button>
                            <Link
                                href={`/product/${item.id}`}
                                className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl text-[9px] font-bold tracking-[0.2em] uppercase text-center hover:bg-gray-100 hover:text-gray-900 transition-all"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
