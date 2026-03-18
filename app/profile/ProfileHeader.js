"use client";

import Image from "next/image";

export default function ProfileHeader({ user, ordersCount, wishlistCount, signOut }) {
    return (
        <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-transparent rounded-[40px] -z-10 opacity-70" />
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-white shadow-2xl relative z-10">
                            <Image
                                src={user.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                alt={user.user_metadata?.full_name || "User"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#E91E63] rounded-full border-4 border-white flex items-center justify-center z-20 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <span className="text-[10px] font-black text-[#E91E63] uppercase tracking-[0.3em]">Member Since {new Date(user.created_at).getFullYear()}</span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                            {user.user_metadata?.full_name || "Valued Customer"}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <p className="text-gray-500 font-medium text-sm">{user.email}</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                            <button
                                onClick={signOut}
                                className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex gap-4">
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm min-w-[140px]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Orders</p>
                        <p className="text-2xl font-black text-gray-900">{ordersCount}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm min-w-[140px]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Wishlist</p>
                        <p className="text-2xl font-black text-gray-900">{wishlistCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
