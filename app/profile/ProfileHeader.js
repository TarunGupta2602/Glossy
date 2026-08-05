
import Image from "next/image";
import Link from "next/link";

export default function ProfileHeader({ user, profile, ordersCount, wishlistCount, signOut }) {
    const displayName = profile?.name || user.user_metadata?.full_name || "Member";
    const firstName = displayName.split(" ")[0];
    const avatar = profile?.avatar || user.user_metadata?.avatar_url;

    return (
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#FFF5F8] via-white to-white p-6 md:p-10">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#E91E63]/5 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#E91E63]/10">
                        <Image
                            src={avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                            alt={displayName}
                            fill
                            sizes="96px"
                            className="object-cover"
                        />
                    </div>

                    <div className="text-center sm:text-left">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#E91E63] mb-2">
                            My Account
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Hello, {firstName}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">{user.email}</p>
                        {profile?.role === "admin" && (
                            <Link
                                href="/admin"
                                className="inline-flex mt-3 items-center rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 border border-amber-100 hover:bg-amber-100 transition-colors"
                            >
                                Admin dashboard →
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:min-w-[280px]">
                    <div className="rounded-2xl bg-white border border-gray-100 px-5 py-4 text-center shadow-sm">
                        <p className="text-2xl font-black text-gray-900">{ordersCount}</p>
                        <p className="text-[11px] font-semibold text-gray-500 mt-1">Orders</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-gray-100 px-5 py-4 text-center shadow-sm">
                        <p className="text-2xl font-black text-gray-900">{wishlistCount}</p>
                        <p className="text-[11px] font-semibold text-gray-500 mt-1">Saved items</p>
                    </div>
                </div>
            </div>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 pt-6 sm:justify-between">
                <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                    <Link
                        href="/shop"
                        className="rounded-xl bg-gray-900 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-black transition-colors"
                    >
                        Continue shopping
                    </Link>
                    <Link
                        href="/wishlist"
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
                    >
                        View wishlist
                    </Link>
                </div>
                <button
                    onClick={signOut}
                    className="text-[11px] font-semibold text-gray-400 hover:text-[#E91E63] uppercase tracking-widest transition-colors"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}
