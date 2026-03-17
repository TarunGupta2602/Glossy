"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetailClient({ product, galleryImages = [], relatedProducts = [] }) {
    const categoryName = product.categories?.name || "Jewelry";

    // Build full image list: main image first, then gallery extras
    const allImages = [
        ...(product.main_image ? [product.main_image] : []),
        ...galleryImages.filter((img) => img !== product.main_image),
    ];
    if (allImages.length === 0) allImages.push("/placeholder.jpg");

    const [activeIdx, setActiveIdx] = useState(0);
    const [qty, setQty] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);
    const [addedToBag, setAddedToBag] = useState(false);

    const price = product.price
        ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
        : "0.00";

    const features = (() => {
        if (product.features) {
            return Array.isArray(product.features)
                ? product.features
                : product.features.split("\n").filter(Boolean);
        }
        return [
            "Hand-crafted with premium materials",
            "Hypoallergenic & skin-safe finish",
            "Ethically sourced components",
            "Free returns within 30 days",
            "Complimentary gift wrapping",
        ];
    })();

    const handleAddToBag = () => {
        setAddedToBag(true);
        setTimeout(() => setAddedToBag(false), 2200);
    };

    return (
        <div className="bg-white min-h-screen">

            {/* ── Product Section ── */}
            <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-10 pb-24">

                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-400">
                    <Link href="/shop" className="hover:text-gray-700 transition-colors">Jewelry</Link>
                    <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-700">{categoryName}</span>
                </nav>

                {/* Main Grid: Images left, Info right */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 xl:gap-16 items-start">

                    {/* ── LEFT: Gallery ── */}
                    <div className="w-full max-w-[520px]">
                        {/* Main Image */}
                        <div className="relative w-full rounded-2xl overflow-hidden bg-[#F2F2F2]" style={{ aspectRatio: "1/1" }}>
                            <Image
                                key={activeIdx}
                                src={allImages[activeIdx]}
                                alt={product.name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 90vw, 45vw"
                                className="object-cover"
                            />
                        </div>

                        {/* Thumbnail Strip — 2 per row below */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {allImages.slice(1, 4).map((img, i) => {
                                    const idx = i + 1;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveIdx(idx)}
                                            className={`relative w-full rounded-xl overflow-hidden bg-[#F2F2F2] transition-all duration-200 ${activeIdx === idx
                                                ? "ring-2 ring-[#E91E63] ring-offset-2"
                                                : "opacity-75 hover:opacity-100"
                                                }`}
                                            style={{ aspectRatio: "1/1" }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`View ${idx + 1}`}
                                                fill
                                                sizes="15vw"
                                                className="object-cover"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product Info ── */}
                    <div className="flex flex-col">

                        {/* Name */}
                        <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p className="mt-2 text-[20px] font-bold text-gray-900">
                            ${price}
                        </p>

                        {/* Divider */}
                        <div className="mt-5 mb-5 h-px bg-gray-100" />

                        {/* Description */}
                        {product.description && (
                            <p className="text-[14px] text-gray-500 leading-[1.75] mb-5">
                                {product.description}
                            </p>
                        )}

                        {/* Feature Bullets */}
                        <ul className="space-y-2.5 mb-8">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-600">
                                    <span className="mt-[7px] w-[4px] h-[4px] rounded-full bg-gray-500 flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* Quantity + Add to Bag */}
                        <div className="flex items-stretch gap-3 h-[50px]">
                            {/* Qty Selector */}
                            <div className="relative flex-shrink-0">
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(parseInt(e.target.value))}
                                    className="h-full w-[80px] appearance-none border border-gray-200 rounded-xl pl-4 pr-7 text-[14px] font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#E91E63] cursor-pointer"
                                >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Add to Bag CTA */}
                            <button
                                onClick={handleAddToBag}
                                className={`flex-1 rounded-xl text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-300 active:scale-[0.98] ${addedToBag
                                    ? "bg-gray-900 text-white"
                                    : "bg-[#E91E63] text-white hover:bg-[#C2185B]"
                                    }`}
                            >
                                {addedToBag ? "✓  Added to Bag" : "Add to Bag"}
                            </button>
                        </div>

                        {/* Wishlist Button */}
                        <button
                            onClick={() => setWishlisted((w) => !w)}
                            className={`mt-3 w-full h-[50px] rounded-xl text-[12px] font-semibold tracking-[0.1em] uppercase border transition-all duration-200 flex items-center justify-center gap-2 ${wishlisted
                                ? "border-[#E91E63] text-[#E91E63] bg-pink-50"
                                : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                                }`}
                        >
                            <svg
                                className={`w-4 h-4 transition-colors ${wishlisted ? "fill-[#E91E63] stroke-[#E91E63]" : "fill-none stroke-current"}`}
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlisted ? "Saved to Wishlist" : "Wishlist"}
                        </button>

                        {/* Shipping Note */}
                        <div className="mt-6 flex items-start gap-3">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-[12px] text-gray-400 leading-relaxed">
                                Free insured express shipping on jewelry over $100. Complimentary gift wrapping included.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Complete the Look ── */}
            {relatedProducts.length > 0 && (
                <section className="border-t border-gray-100 py-16 px-5 sm:px-8 lg:px-12">
                    <div className="max-w-6xl mx-auto">

                        {/* Header */}
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-[20px] font-bold text-gray-900">Complete the Look</h2>
                                <p className="text-[13px] text-gray-400 mt-1">Timeless pieces designed to be layered together.</p>
                            </div>
                            <Link
                                href="/shop"
                                className="hidden sm:block text-[11px] font-bold tracking-[0.18em] uppercase text-[#E91E63] hover:text-[#C2185B] transition-colors"
                            >
                                Shop All Jewelry
                            </Link>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-8">
                            {relatedProducts.slice(0, 4).map((p) => {
                                const cat = p.categories?.name || "Jewelry";
                                const pPrice = p.price
                                    ? p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                                    : "0.00";

                                return (
                                    <Link key={p.id} href={`/product/${p.id}`} className="group flex flex-col">
                                        <div
                                            className="relative w-full overflow-hidden rounded-xl bg-[#F2F2F2] mb-3"
                                            style={{ aspectRatio: "1/1" }}
                                        >
                                            <Image
                                                src={p.main_image || "/placeholder.jpg"}
                                                alt={p.name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <h3 className="text-[13px] font-semibold text-gray-900 group-hover:text-[#E91E63] transition-colors leading-snug line-clamp-1">
                                            {p.name}
                                        </h3>
                                        <span className="text-[11px] text-gray-400 mt-0.5">{cat}</span>
                                        <p className="text-[13px] font-bold text-[#E91E63] mt-1">${pPrice}</p>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-8 text-center sm:hidden">
                            <Link href="/shop" className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#E91E63]">
                                Shop All Jewelry →
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
