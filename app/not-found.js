import Link from "next/link";

export const metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 bg-white text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#E91E63] mb-3">404</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">This page doesn&apos;t exist</h1>
            <p className="text-gray-600 max-w-md mb-10">
                The link may be broken or the page may have moved. Explore our collections instead.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <Link href="/shop" className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-bold uppercase tracking-wide hover:bg-black transition-colors">
                    Shop All
                </Link>
                <Link href="/earrings" className="px-6 py-3 rounded-full border border-gray-200 text-gray-900 text-sm font-bold uppercase tracking-wide hover:border-[#E91E63] hover:text-[#E91E63] transition-colors">
                    Earrings
                </Link>
                <Link href="/shop?sort=popular" className="px-6 py-3 rounded-full border border-gray-200 text-gray-900 text-sm font-bold uppercase tracking-wide hover:border-[#E91E63] hover:text-[#E91E63] transition-colors">
                    Best Sellers
                </Link>
            </div>
        </main>
    );
}
