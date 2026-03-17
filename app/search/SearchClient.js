"use client";

import Link from "next/link";
import Image from "next/image";

export default function SearchClient({ query, products = [] }) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <header className="mb-12">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 mb-2">
                    {query ? `Search results for "${query}"` : "Search results"}
                </h1>
                <p className="text-gray-500 font-medium">
                    {products.length === 0
                        ? "We couldn't find any products matching your search."
                        : `Showing ${products.length} elegant products.`}
                </p>
            </header>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
                    {products.map((product) => {
                        const price = product.price
                            ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                            : "0.00";
                        const category = product.categories?.name || "Jewelry";

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group flex flex-col"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 mb-4">
                                    <Image
                                        src={product.main_image || "/placeholder.jpg"}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#E91E63] transition-colors leading-tight">
                                        {product.name}
                                    </h3>
                                    <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                        {category}
                                    </p>
                                    <p className="text-sm font-black text-[#E91E63]">
                                        ₹{price}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 max-w-sm mb-8">
                        Try searching for diamond necklaces, gold earrings, or emerald rings.
                    </p>
                    <Link
                        href="/shop"
                        className="bg-gray-900 text-white px-8 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                    >
                        Browse All Jewelry
                    </Link>
                </div>
            )}
        </div>
    );
}
