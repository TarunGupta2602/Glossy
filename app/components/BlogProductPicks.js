import Link from "next/link";
import ProductCard from "./ProductCard";

/**
 * Live product strip on blog posts — turns readers into shoppers.
 */
export default function BlogProductPicks({
    products = [],
    reviewCounts = {},
    shopHref = "/shop?sort=popular",
    shopLabel = "See more in shop",
}) {
    if (!products.length) return null;

    return (
        <section className="my-10 md:my-12" aria-label="Shop picks from this guide">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <p
                        className="text-[11px] font-medium uppercase tracking-[0.2em] mb-2"
                        style={{ color: "#b89a6a" }}
                    >
                        From this guide
                    </p>
                    <h2 className="font-playfair text-2xl sm:text-[1.75rem] font-medium text-[#2a2724] tracking-tight">
                        Pieces you can order today
                    </h2>
                </div>
                <Link
                    href={shopHref}
                    className="hidden sm:inline-flex text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a847c] hover:text-[#E91E63] shrink-0 transition-colors"
                >
                    {shopLabel}
                </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        reviewCount={reviewCounts[product.id] || 0}
                        priority={index < 2}
                        hideCategory
                    />
                ))}
            </div>
            <div className="mt-5 sm:hidden">
                <Link
                    href={shopHref}
                    className="inline-flex w-full min-h-11 items-center justify-center rounded-full border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-800"
                >
                    {shopLabel}
                </Link>
            </div>
        </section>
    );
}
