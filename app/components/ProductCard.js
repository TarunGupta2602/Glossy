import Image from "next/image";
import Link from "next/link";
import { getProductPath } from "@/lib/seo";
import { getProductDiscountInfo } from "@/lib/discountUtils";

export default function ProductCard({ product, reviewCount = 0 }) {
    const categoryName = product.categories?.name || "Jewellery";
    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";
    const { hasDiscount, originalPrice, discountPercent } = getProductDiscountInfo(product);

    return (
        <div className="group flex flex-col h-full">
            <Link
                href={getProductPath(product)}
                className="block relative overflow-hidden rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl bg-white/60 backdrop-blur-[2px] aspect-square w-full transition-all duration-700"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)' }}
            >
                <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
                    {product.is_bestseller && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-[9px] md:text-[10px] font-black shadow-[0_4px_10px_rgba(251,191,36,0.5)] border border-white/20 uppercase tracking-[0.05em] leading-none">
                            BEST SELLER
                        </span>
                    )}
                    {product.is_new && (
                        <span className="inline-block px-3 py-1.5 rounded-full bg-white text-gray-900 text-[10px] font-bold shadow-md border border-gray-100 uppercase tracking-widest leading-none">
                            New Arrivals
                        </span>
                    )}
                </div>
                <Image
                    src={product.main_image || "/logo.png"}
                    alt={product.image_alt || product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDsAAAABJr5//Z"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-white/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700 rounded-2xl" />

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-5 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 z-10">
                    <span className="bg-white/95 text-gray-900 text-[11px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full shadow hover:bg-gray-900 hover:text-white transition-colors duration-200 border border-gray-200 backdrop-blur-sm">
                        Quick View
                    </span>
                </div>
            </Link>

            <div className="mt-4 flex flex-col gap-1 px-1">
                <span className="text-[10px] font-semibold tracking-wide text-gray-600 uppercase">
                    {categoryName}
                </span>

                <Link href={getProductPath(product)}>
                    <h3 className="text-[15px] font-black text-gray-900 leading-snug group-hover:text-gray-900 transition-colors duration-200 line-clamp-2 min-h-10">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-[15px] font-bold text-gray-900">
                        ₹{price}
                    </p>
                    {hasDiscount && (
                        <>
                            <p className="text-[11px] text-gray-500 line-through">
                                ₹{originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-[11px] font-bold text-green-700">
                                (SAVE {discountPercent}%)
                            </p>
                        </>
                    )}
                </div>
                {reviewCount > 0 && (
                    <p className="text-[11px] text-gray-500 mt-1">
                        ★ {reviewCount} review{reviewCount === 1 ? "" : "s"}
                    </p>
                )}
            </div>
        </div>
    );
}
