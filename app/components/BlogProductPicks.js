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
            <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E91E63] mb-1">
                        From this guide
                    </p>
                    <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Pieces you can order today
                    </h2>
                </div>
                <Link
                    href={shopHref}
                    className="hidden sm:inline-flex text-xs font-bold uppercase tracking-widest text-[#E91E63] hover:underline shrink-0"
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
