import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
    const categoryName = product.categories?.name || "Jewelry";
    const price = product.price
        ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
        : "0.00";

    return (
        <div className="group flex flex-col">
            {/* Image Container */}
            <Link
                href={`/product/${product.id}`}
                className="block relative overflow-hidden rounded-2xl bg-[#F5F5F5] aspect-[3/4]"
            >
                <Image
                    src={product.main_image || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick View CTA */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-5 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <span className="bg-white text-gray-900 text-[11px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full shadow-lg hover:bg-[#E91E63] hover:text-white transition-colors duration-200">
                        Quick View
                    </span>
                </div>

                {/* New badge — shown if product is recent */}
                {product.is_new && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-[#E91E63] text-white text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
                            New
                        </span>
                    </div>
                )}
            </Link>

            {/* Product Info */}
            <div className="mt-4 flex flex-col gap-1">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                    {categoryName}
                </span>

                <Link href={`/product/${product.id}`}>
                    <h3 className="text-[14px] font-semibold text-gray-900 leading-snug group-hover:text-[#E91E63] transition-colors duration-200 line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-1">
                    <p className="text-[14px] font-bold text-gray-800">
                        ${price}
                    </p>
                    {product.original_price && product.original_price > product.price && (
                        <p className="text-[12px] text-gray-400 line-through">
                            ${product.original_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
