"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getProductDiscountInfo } from "@/lib/discountUtils";
import { getCategoryHref } from "@/lib/categoryLanding";
import ReviewList from "../../components/ReviewList";
import ReviewForm from "../../components/ReviewForm";
import TrustStrip from "../../components/TrustStrip";
import ProductCard from "../../components/ProductCard";
import { trackViewItem } from "@/lib/gtag";
import { trackMetaViewContent } from "@/lib/metaPixel";

export default function ProductDetailClient({
    product,
    galleryImages = [],
    relatedProducts = [],
    relatedReviewCounts = {},
    initialReviews = [],
    initialReviewStats = null,
}) {
    const categoryName = product.categories?.name || "Jewellery";
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    // Use server-calculated discount if available, otherwise calculate client-side
    const { hasDiscount, originalPrice, discountPercent } = getProductDiscountInfo(product);

    // Build full image list: main image first, then gallery extras
    const allImages = [
        ...(product.main_image ? [product.main_image] : []),
        ...galleryImages.filter((img) => img !== product.main_image),
    ];
    if (allImages.length === 0) allImages.push("/logo.png");

    const [activeIdx, setActiveIdx] = useState(0);
    const [qty, setQty] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
    const isWishlisted = isInWishlist(product.id);
    const [addedToBag, setAddedToBag] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
    const touchStartX = useRef(null);

    useEffect(() => {
        trackViewItem({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            category: categoryName,
        });
        trackMetaViewContent({
            id: product.id,
            name: product.name,
            value: product.price || 0,
            category: categoryName,
        });
    }, [product.id, product.name, product.price, categoryName]);

    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";

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
            "Free returns within 10 days",
            "Complimentary gift wrapping",
        ];
    })();

    const handleAddToBag = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            image: product.main_image || "/logo.png",
            category: categoryName
        }, qty);

        setAddedToBag(true);
        setTimeout(() => setAddedToBag(false), 2200);
    };

    const handleImageMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomOrigin({ x, y });
    };

    const handleGalleryTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleGalleryTouchEnd = (e) => {
        if (touchStartX.current == null || allImages.length < 2) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) {
            if (dx < 0) {
                setActiveIdx((i) => Math.min(allImages.length - 1, i + 1));
            } else {
                setActiveIdx((i) => Math.max(0, i - 1));
            }
        }
        touchStartX.current = null;
    };

    const categoryHref = product.categories?.slug
        ? getCategoryHref(product.categories)
        : "/shop";

    return (
        <div className="bg-white min-h-screen pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-20">
            <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-8 lg:px-10 py-10 pb-20">
                
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-400">
                    <Link href="/shop" className="hover:text-gray-700 transition-colors">Jewellery</Link>
                    <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {product.categories?.slug ? (
                        <Link href={categoryHref} className="hover:text-gray-700 transition-colors">
                            {categoryName}
                        </Link>
                    ) : (
                        <span className="text-gray-700">{categoryName}</span>
                    )}
                </nav>

                {/* Main Grid: Images left, Info right */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 xl:gap-16 items-start mb-16">

                    {/* ── LEFT: Gallery ── */}
                    <div className="w-full max-w-[580px] lg:max-w-[600px]">
                        {/* Single main image — zoom on desktop, swipe on mobile (avoid double download) */}
                        <div
                            className="relative w-full rounded-2xl overflow-hidden bg-[#F2F2F2] lg:cursor-zoom-in touch-pan-y"
                            style={{ aspectRatio: "1/1" }}
                            onMouseEnter={() => {
                                if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
                                    setIsZoomed(true);
                                }
                            }}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleImageMouseMove}
                            onTouchStart={handleGalleryTouchStart}
                            onTouchEnd={handleGalleryTouchEnd}
                        >
                            <Image
                                src={allImages[activeIdx]}
                                alt={activeIdx === 0 ? (product.image_alt || product.name) : `${product.name} - View ${activeIdx + 1}`}
                                fill
                                priority
                                sizes="(max-width: 1024px) 90vw, 45vw"
                                quality={80}
                                className="object-cover transition-transform duration-200 ease-out lg:pointer-events-auto pointer-events-none"
                                style={{
                                    transform: isZoomed ? "scale(1.75)" : "scale(1)",
                                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                                }}
                                draggable={false}
                            />
                            {allImages.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 lg:hidden">
                                    {allImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveIdx(idx)}
                                            aria-label={`View image ${idx + 1}`}
                                            className={`h-1.5 rounded-full transition-all ${activeIdx === idx ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail strip — scrollable on mobile when many images */}
                        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1 -mx-0.5 px-0.5">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveIdx(idx)}
                                    className={`relative flex-shrink-0 w-[18%] min-w-[56px] max-w-[72px] rounded-lg overflow-hidden bg-[#F2F2F2] transition-all duration-200 ${activeIdx === idx
                                        ? "ring-2 ring-[#E91E63] ring-offset-1"
                                        : "opacity-60 hover:opacity-100"
                                        }`}
                                    style={{ aspectRatio: "1/1" }}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} - Thumbnail ${idx + 1}`}
                                        fill
                                        sizes="72px"
                                        quality={60}
                                        className="object-cover"
                                        loading={idx === 0 ? "eager" : "lazy"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Product Info ── */}
                    <div className="flex flex-col">

                        {/* Name */}
                        <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="mt-2 flex items-baseline gap-3">
                            <p className="text-[24px] font-black text-gray-900 leading-none">
                                ₹{price}
                            </p>
                            {hasDiscount && (
                                <div className="flex items-center gap-2">
                                    <p className="text-[16px] text-gray-400 line-through font-medium">
                                        ₹{originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                    <p className="text-[14px] font-bold text-[#2E7D32]">
                                        SAVE {discountPercent}%
                                    </p>
                                </div>
                            )}
                        </div>

                        {product.stock_count != null && product.stock_count > 0 && product.stock_count <= 10 && (
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                                    <span className="text-[11px] font-bold uppercase tracking-tight">
                                        Only {product.stock_count} left in stock
                                    </span>
                                </div>
                            </div>
                        )}

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

                        {/* Quantity + Add to Bag — desktop / tablet; mobile uses sticky bar */}
                        <div className="hidden lg:flex items-stretch gap-3 h-[50px]">
                            <div className="relative flex-shrink-0">
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(parseInt(e.target.value, 10))}
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
                            onClick={() => toggleWishlist({
                                id: product.id,
                                name: product.name,
                                price: product.price || 0,
                                image: product.main_image || "/logo.png",
                                category: categoryName
                            })}
                            className={`mt-3 w-full h-[50px] rounded-xl text-[12px] font-semibold tracking-[0.1em] uppercase border transition-all duration-200 flex items-center justify-center gap-2 ${isWishlisted
                                ? "border-[#E91E63] text-[#E91E63] bg-pink-50"
                                : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                                }`}
                        >
                            <svg
                                className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#E91E63] stroke-[#E91E63]" : "fill-none stroke-current"}`}
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {isWishlisted ? "Saved to Wishlist" : "Wishlist"}
                        </button>

                        {/* Trust Signals */}
                        <TrustStrip className="mt-8" />

                        {/* Product Details */}
                        {(product.material || product.plating || product.care_instructions || product.weight || product.size_info) && (
                            <div className="mt-8 p-5 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                                <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Product Details</p>
                                {product.material && (
                                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Material:</span> {product.material}</p>
                                )}
                                {product.plating && (
                                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Plating:</span> {product.plating}</p>
                                )}
                                {product.weight && (
                                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Weight:</span> {product.weight}</p>
                                )}
                                {product.size_info && (
                                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Size:</span> {product.size_info}</p>
                                )}
                                {product.care_instructions && (
                                    <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">Care:</span> {product.care_instructions}</p>
                                )}
                            </div>
                        )}

                        <div className="mt-6 flex items-start gap-3">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                                Fast Delivery: <span className="text-gray-900 font-bold">Arrives in 3–5 business days</span> across India. Secure prepaid checkout only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Customer Reviews ── */}
                <div className="pt-10 border-t border-gray-100 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                        <div>
                            <span className="text-[11px] font-black tracking-[0.18em] text-[#E91E63] uppercase mb-2 block">
                                Verified Reviews
                            </span>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Customer Reviews
                            </h2>
                        </div>
                        {!showReviewForm && (
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-gray-800 hover:border-[#E91E63]/40 hover:text-[#E91E63] transition-colors bg-white self-start sm:self-auto"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Write a review
                            </button>
                        )}
                    </div>

                    {showReviewForm && (
                        <div className="mb-8">
                            <ReviewForm
                                productId={product.id}
                                productName={product.name}
                                onCancel={() => setShowReviewForm(false)}
                                onSuccess={() => {
                                    setShowReviewForm(false);
                                    setReviewRefreshKey((key) => key + 1);
                                }}
                            />
                        </div>
                    )}

                    <ReviewList
                        productId={product.id}
                        refreshKey={reviewRefreshKey}
                        initialReviews={initialReviews}
                        initialStats={initialReviewStats}
                    />
                </div>

                {/* ── Complete the Look ── */}
                {relatedProducts.length > 0 && (
                    <div className="pt-8 border-t border-gray-100">
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
                                Shop All Jewellery
                            </Link>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-8">
                            {relatedProducts.slice(0, 4).map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    reviewCount={relatedReviewCounts[p.id] || 0}
                                />
                            ))}
                        </div>

                        <div className="mt-8 text-center sm:hidden">
                            <Link href="/shop" className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#E91E63]">
                                Shop All Jewellery →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile sticky add-to-bag bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="relative flex-shrink-0">
                    <select
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value, 10))}
                        aria-label="Quantity"
                        className="h-12 w-14 appearance-none border border-gray-200 rounded-xl pl-3 pr-6 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#E91E63]"
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div className="flex-shrink-0 min-w-0">
                    <p className="text-base font-black text-gray-900 leading-none">₹{price}</p>
                    {hasDiscount && (
                        <p className="text-[10px] text-gray-400 line-through mt-0.5">₹{originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    )}
                </div>
                <button
                    onClick={handleAddToBag}
                    className={`flex-1 h-12 rounded-xl text-[11px] font-bold tracking-[0.12em] uppercase transition-all ${addedToBag ? "bg-gray-900 text-white" : "bg-[#E91E63] text-white"}`}
                >
                    {addedToBag ? "✓ Added" : "Add to Bag"}
                </button>
            </div>
        </div>
    );
}
