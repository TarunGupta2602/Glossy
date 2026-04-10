

import Image from "next/image";

export default function ProfileHeader({ user, ordersCount, signOut }) {
    return (
        <div className="relative mb-16 overflow-hidden rounded-[48px] bg-white border border-gray-100 shadow-sm">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-pink-50/50 to-transparent -z-10" />
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-gray-50 shadow-2xl relative z-10 transition-transform hover:rotate-3 duration-500">
                            <Image
                                src={user.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                alt={user.user_metadata?.full_name || "User"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gray-900 rounded-full border-4 border-white flex items-center justify-center z-20 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                            <span className="text-[10px] font-black text-[#E91E63] uppercase tracking-[0.3em]">Signature Member</span>
                            <div className="h-4 w-px bg-gray-200" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Est. {new Date(user.created_at).getFullYear()}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-none mb-4">
                            {user.user_metadata?.full_name?.split(' ')[0] || "Valued Customer"}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <p className="text-gray-500 font-medium text-sm">{user.email}</p>
                            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-200" />
                            <button
                                onClick={signOut}
                                className="text-[10px] font-bold text-gray-400 hover:text-[#E91E63] uppercase tracking-widest transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 min-w-[160px] text-center md:text-left">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Purchases</p>
                        <p className="text-3xl font-black text-gray-900">{ordersCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
