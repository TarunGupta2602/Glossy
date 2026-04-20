
import Image from "next/image";

export default function ProfileHeader({ user, ordersCount, signOut }) {
    return (
        <div className="relative mb-20">
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-gray-100/50 rounded-full blur-[100px] -z-10" />

            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                    {/* Profile Image with Ring */}
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-100 p-2 bg-white shadow-2xl relative z-10">
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                <Image
                                    src={user.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                    alt={user.user_metadata?.full_name || "User"}
                                    fill
                                    sizes="160px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-900 rounded-full border-4 border-[#FAFAFA] flex items-center justify-center z-20 shadow-xl">
                            <span className="text-[14px] font-black text-white italic">L</span>
                        </div>
                    </div>

                    <div className="text-center md:text-left flex flex-col justify-center">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="bg-[#E91E63]/10 text-[#E91E63] text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full border border-[#E91E63]/20">
                                Signature Member
                            </span>
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                Exclusive Access Enabled
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 leading-[0.9] mb-6">
                            Greetings, <br className="hidden md:block" />
                            <span className="text-[#E91E63]">{user.user_metadata?.full_name?.split(' ')[0] || "Friend"}</span>
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-gray-400 font-medium text-xs tracking-wide">{user.email}</p>
                            </div>
                            <button
                                onClick={signOut}
                                className="text-[10px] font-black text-gray-900 hover:text-[#E91E63] uppercase tracking-[0.2em] transition-all border-b-2 border-gray-100 hover:border-[#E91E63] pb-1"
                            >
                                Logout Session
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="shrink-0">
                    <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50/30 rounded-full blur-3xl -z-10 transition-transform duration-700 group-hover:scale-150" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Portfolio Value</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900 tracking-tighter italic">{ordersCount}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ordersCount === 1 ? 'Acquisition' : 'Acquisitions'}</span>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-[8px] font-black text-[#E91E63] uppercase tracking-[0.2em]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Lifetime Warranty Active
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

