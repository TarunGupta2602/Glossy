import Image from "next/image";
import Link from "next/link";
import { getProductPath } from "@/lib/seo";
import { getProductDiscountInfo } from "@/lib/discountUtils";

export default function ProductCard({ product, reviewCount = 0, hideCategory = false }) {
    const categoryName = product.categories?.name || "Jewellery";
    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";
    const { hasDiscount, originalPrice, discountPercent } = getProductDiscountInfo(product);

    return (
        <div className="group flex flex-col h-full">
            <Link
                href={getProductPath(product)}
                className="block relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 shadow-md sm:shadow-lg hover:shadow-2xl bg-white/60 backdrop-blur-[2px] aspect-square w-full transition-all duration-700"
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)' }}
            >
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex flex-col gap-1.5 sm:gap-2">
                    {product.is_bestseller && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-[8px] sm:text-[10px] font-black shadow-[0_4px_10px_rgba(251,191,36,0.5)] border border-white/20 uppercase tracking-[0.05em] leading-none">
                            BEST SELLER
                        </span>
                    )}
                    {product.is_new && (
                        <span className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white text-gray-900 text-[8px] sm:text-[10px] font-bold shadow-md border border-gray-100 uppercase tracking-widest leading-none">
                            New
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

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-3 sm:pb-5 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-400 z-10">
                    <span className="bg-white/95 text-gray-900 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow border border-gray-200 backdrop-blur-sm md:hover:bg-gray-900 md:hover:text-white transition-colors duration-200">
                        View
                    </span>
                </div>
            </Link>

            <div className="mt-2.5 sm:mt-4 flex flex-col gap-0.5 sm:gap-1 px-0.5 sm:px-1">
                {!hideCategory && (
                    <span className="text-[9px] sm:text-[10px] font-semibold tracking-wide text-gray-600 uppercase truncate">
                        {categoryName}
                    </span>
                )}

                <Link href={getProductPath(product)}>
                    <h3 className={`text-[13px] sm:text-[15px] font-black text-gray-900 leading-snug group-hover:text-gray-900 transition-colors duration-200 line-clamp-2 ${hideCategory ? "min-h-[2.75rem] sm:min-h-11" : "min-h-[2.5rem] sm:min-h-10"}`}>
                        {product.name}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                    <p className="text-[13px] sm:text-[15px] font-bold text-gray-900">
                        ₹{price}
                    </p>
                    {hasDiscount && (
                        <>
                            <p className="text-[10px] sm:text-[11px] text-gray-500 line-through">
                                ₹{originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-[10px] sm:text-[11px] font-bold text-green-700">
                                -{discountPercent}%
                            </p>
                        </>
                    )}
                </div>
                {reviewCount > 0 && (
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 sm:mt-1">
                        ★ {reviewCount}
                    </p>
                )}
            </div>
        </div>
    );
}
