import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import ProductCard from "./ProductCard";
import { PROMO_LABEL } from "@/lib/promo";

export default function GiftLandingContent({
    title,
    subtitle,
    maxPrice,
    products = [],
    reviewCounts = {},
    breadcrumbs = [],
}) {
    return (
        <main className="min-h-screen bg-white">
            <section className={`${SITE_CONTAINER} pt-6 md:pt-8`}>
                <nav className="text-[12px] text-gray-500 mb-5" aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li>
                            <Link href="/" className="hover:text-[#E91E63]">
                                Home
                            </Link>
                        </li>
                        {breadcrumbs.map((item) => (
                            <li key={item.href || item.label} className="flex items-center gap-1.5">
                                <span aria-hidden>/</span>
                                {item.href ? (
                                    <Link href={item.href} className="hover:text-[#E91E63]">
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-800">{item.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="max-w-2xl mb-6 md:mb-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E91E63] mb-2">
                        Gift edit · under ₹{maxPrice.toLocaleString("en-IN")}
                    </p>
                    <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                        {title}
                    </h1>
                    <p className="text-[15px] text-gray-600 leading-relaxed mb-4">{subtitle}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="rounded-full bg-[#fdf2f6] border border-[#E91E63]/20 px-3 py-1.5 text-[11px] font-semibold text-[#E91E63]">
                            {PROMO_LABEL}
                        </span>
                        <span className="rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600">
                            Anti-tarnish · Waterproof
                        </span>
                        <span className="rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600">
                            Pan-India shipping
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/earrings"
                            className="inline-flex min-h-10 items-center rounded-full bg-[#E91E63] px-4 text-[12px] font-semibold text-white hover:bg-[#c2185b] transition-colors"
                        >
                            Shop earrings
                        </Link>
                        <Link
                            href="/necklaces"
                            className="inline-flex min-h-10 items-center rounded-full border border-gray-200 px-4 text-[12px] font-semibold text-gray-900 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                        >
                            Shop necklaces
                        </Link>
                        <Link
                            href={maxPrice <= 499 ? "/gifts/under-999" : "/gifts/under-499"}
                            className="inline-flex min-h-10 items-center rounded-full border border-gray-200 px-4 text-[12px] font-semibold text-gray-900 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                        >
                            {maxPrice <= 499 ? "Also see under ₹999" : "Also see under ₹499"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`${SITE_CONTAINER} pb-16 md:pb-20`}>
                {products.length > 0 ? (
                    <>
                        <p className="text-[12px] text-gray-500 mb-5">
                            Showing {products.length} gift-ready pieces under ₹
                            {maxPrice.toLocaleString("en-IN")}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    reviewCount={reviewCounts[product.id] || 0}
                                    priority={index < 4}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                        <p className="text-gray-700 font-medium mb-3">
                            We’re refreshing this gift edit.
                        </p>
                        <Link
                            href="/shop"
                            className="text-[#E91E63] font-semibold text-sm hover:underline"
                        >
                            Browse the full catalogue →
                        </Link>
                    </div>
                )}

                <div className="mt-12 md:mt-16 max-w-2xl">
                    <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
                        Why these make easy gifts
                    </h2>
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-3">
                        Every piece here is anti-tarnish and made for everyday Indian wear — so the
                        gift doesn’t sit unused in a box. Perfect for Friendship Day, Raksha Bandhan,
                        birthdays, and office gifting. Add two paid items to unlock {PROMO_LABEL}, or
                        pair earrings with a necklace for a ready set.
                    </p>
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        Prefer a wider edit? Browse the full anti-tarnish catalogue, or jump straight
                        into category pages for faster picking.
                    </p>
                    <div className="flex flex-wrap gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#E91E63]">
                        <Link href="/earrings" className="hover:underline">
                            Earrings
                        </Link>
                        <Link href="/necklaces" className="hover:underline">
                            Necklaces
                        </Link>
                        <Link href="/shop?sort=popular" className="hover:underline">
                            Bestsellers
                        </Link>
                        <Link
                            href={maxPrice <= 499 ? "/gifts/under-999" : "/gifts/under-499"}
                            className="hover:underline"
                        >
                            {maxPrice <= 499 ? "Under ₹999" : "Under ₹499"}
                        </Link>
                        <Link
                            href="/blog/best-jewelry-gifts-raksha-bandhan-friendship-day-2026"
                            className="hover:underline"
                        >
                            Festive gift guide
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
