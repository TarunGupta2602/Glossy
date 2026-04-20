import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
    const categoryName = product.categories?.name || "Jewelry";
    const price = product.price
        ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
        : "0.00";

    return (
        <div className="group flex flex-col h-full">
            {/* Image Container */}
            <Link
                href={`/product/${product.id}`}
                className="block relative overflow-hidden rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl bg-white/60 backdrop-blur-[2px] aspect-square w-full transition-all duration-700"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)' }}
            >
                {/* Subtle floating badge for promotions */}
                <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
                    {product.is_new && (
                        <span className="inline-block px-2.5 py-1 rounded-full bg-white text-gray-900 text-[10px] font-bold shadow border border-gray-200 uppercase tracking-widest leading-none">
                            New
                        </span>
                    )}
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#E91E63] text-white text-[9px] md:text-[10px] font-black shadow-md uppercase tracking-wider leading-none">
                        Buy 2 Get 1 FREE
                    </span>
                </div>
                <Image
                    src={product.main_image || "/placeholder.jpg"}
                    alt={product.image_alt || product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Neutral glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-white/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700 rounded-2xl" />

                {/* Quick View CTA */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-5 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 z-10">
                    <span className="bg-white/95 text-gray-900 text-[11px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full shadow hover:bg-gray-900 hover:text-white transition-colors duration-200 border border-gray-200 backdrop-blur-sm">
                        Quick View
                    </span>
                </div>
            </Link>

            {/* Product Info */}
            <div className="mt-4 flex flex-col gap-1 px-1">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                    {categoryName}
                </span>

                <Link href={`/product/${product.id}`}>
                    <h3 className="text-[15px] font-black text-gray-900 leading-snug group-hover:text-gray-900 transition-colors duration-200 line-clamp-2 min-h-10">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-[15px] font-bold text-gray-900">
                        ₹{price}
                    </p>
                    {(() => {
                        const originalPrice = product.original_price || (product.price / 0.7);
                        const discount = product.original_price
                            ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                            : 30;

                        if (originalPrice > product.price) {
                            return (
                                <>
                                    <p className="text-[11px] text-gray-400 line-through">
                                        ₹{originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-[11px] font-bold text-green-700">
                                        (SAVE {discount}%)
                                    </p>
                                </>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>
        </div>
    );
}
