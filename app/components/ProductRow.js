import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductRow({ title, products, viewAllLink }) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-12 px-6 md:px-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {title}
                    </h2>
                    <Link
                        href={viewAllLink}
                        className="group flex items-center gap-2 text-sm font-bold text-[#E91E63] uppercase tracking-widest hover:text-[#C2185B] transition-colors"
                    >
                        View All
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transform group-hover:translate-x-1 transition-transform"
                        >
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    className="flex items-stretch gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="shrink-0 w-[260px] min-w-[260px] max-w-[260px] md:w-[300px] md:min-w-[300px] md:max-w-[300px] snap-start"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
