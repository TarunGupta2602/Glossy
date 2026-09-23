"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getProductDiscountInfo } from "@/lib/discountUtils";
import { getCategoryHref, getDisplayCategoryName } from "@/lib/categoryLanding";
import ReviewList from "../../components/ReviewList";
import ReviewForm from "../../components/ReviewForm";
import TrustStrip from "../../components/TrustStrip";
import ProductCard from "../../components/ProductCard";
import { reviewCardProps } from "@/lib/reviewDisplay";
import { trackViewItem } from "@/lib/gtag";
import { trackMetaViewContent } from "@/lib/metaPixel";
import { trackRecentlyViewed } from "@/lib/recentlyViewed";
import { IMAGE_BLUR_DATA_URL, PDP_MAIN_SIZES, PDP_THUMB_SIZES } from "@/lib/imageBlur";
import {
    buildProductHighlightChips,
    getDefaultProductFeatures,
    getFinishAuthenticityNote,
} from "@/lib/productTrust";
import { resolveProductSizeInfo } from "@/lib/productDefaults";

function CheckIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

export default function ProductDetailClient({
    product,
    galleryImages = [],
    relatedProducts = [],
    relatedReviewCounts = {},
    initialReviews = [],
    initialReviewStats = null,
}) {
    const categoryName = getDisplayCategoryName(product.categories);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const { hasDiscount, originalPrice, discountPercent } = getProductDiscountInfo(product);
    const highlightChips = buildProductHighlightChips(product, { hasDiscount });
    const authenticityNote = getFinishAuthenticityNote(product);
    const sizeGuide = resolveProductSizeInfo(product);

    const allImages = [
        ...(product.main_image ? [product.main_image] : []),
        ...galleryImages.filter((img) => img !== product.main_image),
    ];
    if (allImages.length === 0) allImages.push("/logo.png");

    const [activeIdx, setActiveIdx] = useState(0);
    const [qty, setQty] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
    const [imageFade, setImageFade] = useState(true);
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
        trackRecentlyViewed(product);
    }, [product, categoryName]);

    const price = product.price
        ? product.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
        : "0";

    const features = (() => {
        if (product.features) {
            return Array.isArray(product.features)
                ? product.features
                : product.features.split("\n").filter(Boolean);
        }
        return getDefaultProductFeatures();
    })();

    const detailRows = [
        product.material && { label: "Material", value: product.material },
        product.plating && { label: "Plating", value: product.plating },
        product.weight && { label: "Weight", value: product.weight },
        { label: "Fit / size", value: sizeGuide },
        product.care_instructions && { label: "Care", value: product.care_instructions },
    ].filter(Boolean);

    const lowStock =
        product.stock_count != null && product.stock_count > 0 && product.stock_count <= 10;

    const setGalleryIndex = (next) => {
        if (next === activeIdx) return;
        setImageFade(false);
        window.setTimeout(() => {
            setActiveIdx(next);
            setImageFade(true);
        }, 120);
    };

    const goPrev = () => {
        if (allImages.length < 2) return;
        setGalleryIndex(activeIdx === 0 ? allImages.length - 1 : activeIdx - 1);
    };

    const goNext = () => {
        if (allImages.length < 2) return;
        setGalleryIndex(activeIdx === allImages.length - 1 ? 0 : activeIdx + 1);
    };

    const handleAddToBag = () => {
        addToCart(
            {
                id: product.id,
                name: product.name,
                price: product.price || 0,
                image: product.main_image || "/logo.png",
                category: categoryName,
            },
            qty
        );

        setAddedToBag(true);
        setTimeout(() => setAddedToBag(false), 2200);
    };

    const handleWishlist = () => {
        toggleWishlist({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            image: product.main_image || "/logo.png",
            category: categoryName,
        });
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
            if (dx < 0) goNext();
            else goPrev();
        }
        touchStartX.current = null;
    };

    const categoryHref = product.categories?.slug
        ? getCategoryHref(product.categories)
        : "/shop";

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-24">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-16 lg:pb-20">
                {/* Breadcrumb */}
                <nav
                    className="mb-6 sm:mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#8a847c]"
                    aria-label="Breadcrumb"
                >
                    <Link href="/shop" className="hover:text-[#E91E63] transition-colors">
                        Jewellery
                    </Link>
                    <span className="text-[#d4cfc8]" aria-hidden>
                        /
                    </span>
                    {product.categories?.slug ? (
                        <Link href={categoryHref} className="hover:text-[#E91E63] transition-colors">
                            {categoryName}
                        </Link>
                    ) : (
                        <span className="text-[#2a2724]">{categoryName}</span>
                    )}
                    <span className="text-[#d4cfc8] hidden sm:inline" aria-hidden>
                        /
                    </span>
                    <span className="text-[#2a2724] truncate max-w-[14rem] sm:max-w-xs hidden sm:inline">
                        {product.name}
                    </span>
                </nav>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-8 lg:gap-12 xl:gap-16 items-start mb-16 lg:mb-20">
                    {/* Gallery — sticky on desktop */}
                    <div className="w-full lg:sticky lg:top-24 self-start">
                        <div
                            className="group relative w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] bg-[#efeae4] lg:cursor-zoom-in touch-pan-y"
                            style={{ aspectRatio: "1/1" }}
                            onMouseEnter={() => {
                                if (
                                    typeof window !== "undefined" &&
                                    window.matchMedia("(min-width: 1024px)").matches
                                ) {
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
                                alt={
                                    activeIdx === 0
                                        ? product.image_alt || product.name
                                        : `${product.name} - View ${activeIdx + 1}`
                                }
                                fill
                                priority={activeIdx === 0}
                                sizes={PDP_MAIN_SIZES}
                                quality={activeIdx === 0 ? 80 : 70}
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                className={`object-cover transition-[transform,opacity] duration-300 ease-out lg:pointer-events-auto pointer-events-none ${
                                    imageFade ? "opacity-100" : "opacity-0"
                                }`}
                                style={{
                                    transform: isZoomed ? "scale(1.75)" : "scale(1)",
                                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                                }}
                                draggable={false}
                            />

                            {/* Overlays */}
                            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 sm:p-4 pointer-events-none">
                                <div className="flex flex-wrap gap-2">
                                    {hasDiscount && (
                                        <span className="pointer-events-auto rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium tracking-wide text-[#6b6560]">
                                            Was ₹
                                            {originalPrice.toLocaleString(undefined, {
                                                maximumFractionDigits: 0,
                                            })}
                                        </span>
                                    )}
                                    {lowStock && (
                                        <span className="pointer-events-auto rounded-full bg-[#faf0f3] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C2185B]">
                                            Only {product.stock_count} left
                                        </span>
                                    )}
                                </div>
                                {allImages.length > 1 && (
                                    <span className="rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
                                        {activeIdx + 1} / {allImages.length}
                                    </span>
                                )}
                            </div>

                            {/* Desktop arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={goPrev}
                                        aria-label="Previous image"
                                        className="hidden lg:flex absolute left-3 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2a2724] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        aria-label="Next image"
                                        className="hidden lg:flex absolute right-3 top-1/2 z-20 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2a2724] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Mobile dots */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 lg:hidden">
                                    {allImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setGalleryIndex(idx)}
                                            aria-label={`View image ${idx + 1}`}
                                            className={`h-1.5 rounded-full transition-all ${
                                                activeIdx === idx ? "w-5 bg-white" : "w-1.5 bg-white/45"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbs */}
                        {allImages.length > 1 && (
                            <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setGalleryIndex(idx)}
                                        className={`relative flex-shrink-0 w-[18%] min-w-[56px] max-w-[76px] overflow-hidden rounded-xl bg-[#efeae4] transition-all duration-200 ${
                                            activeIdx === idx
                                                ? "ring-2 ring-[#E91E63] ring-offset-2 ring-offset-[#fdfbf7]"
                                                : "opacity-55 hover:opacity-100"
                                        }`}
                                        style={{ aspectRatio: "1/1" }}
                                        aria-label={`View image ${idx + 1}`}
                                        aria-current={activeIdx === idx ? "true" : undefined}
                                    >
                                        <Image
                                            src={img}
                                            alt=""
                                            fill
                                            sizes={PDP_THUMB_SIZES}
                                            quality={50}
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Buy panel */}
                    <div className="flex flex-col min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E91E63] mb-2.5">
                            {categoryName}
                        </p>

                        <h1 className="font-playfair text-[1.65rem] sm:text-[2rem] lg:text-[2.35rem] font-medium text-[#2a2724] leading-[1.15] tracking-tight">
                            {product.name}
                        </h1>

                        {initialReviewStats?.totalReviews > 0 && (
                            <p className="mt-2.5 text-[13px] text-[#8a847c] tabular-nums">
                                <span className="text-amber-500">★</span>{" "}
                                {Number(initialReviewStats.avgRating || 0).toFixed(1)} (
                                {initialReviewStats.totalReviews})
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <p className="text-[1.5rem] sm:text-[1.65rem] font-semibold text-[#2a2724] tracking-tight leading-none">
                                ₹{price}
                            </p>
                            {hasDiscount && (
                                <p className="text-[15px] text-[#9a948c] line-through font-medium">
                                    ₹
                                    {originalPrice.toLocaleString(undefined, {
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            )}
                        </div>
                        {hasDiscount && (
                            <p className="mt-1.5 text-[12px] text-[#8a847c]">
                                Compare-at price · you save about {discountPercent}%
                            </p>
                        )}

                        {lowStock && (
                            <p className="mt-3 inline-flex self-start rounded-full bg-[#faf0f3] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#C2185B]">
                                Only {product.stock_count} left — gift-ready stock
                            </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                            {highlightChips.map((chip) => (
                                <span
                                    key={chip}
                                    className="rounded-full border border-[#efeae4] bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6560]"
                                >
                                    {chip}
                                </span>
                            ))}
                        </div>

                        <p className="mt-3 text-[12px] text-[#8a847c] leading-relaxed max-w-md">
                            {authenticityNote}
                        </p>

                        <div className="mt-4 rounded-2xl border border-[#efeae4] bg-[#fdfbf7] px-4 py-3.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b89a6a] mb-1">
                                Fit &amp; size
                            </p>
                            <p className="text-[13px] text-[#5c5752] leading-relaxed">{sizeGuide}</p>
                        </div>

                        <div className="mt-6 mb-6 h-px bg-[#efeae4]" />

                        {product.description && (
                            <p className="text-[14px] sm:text-[15px] text-[#6b6560] leading-[1.8] max-w-xl mb-6">
                                {product.description}
                            </p>
                        )}

                        <ul className="space-y-2.5 mb-8">
                            {features.map((f, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-[#5c5752]"
                                >
                                    <span className="mt-0.5 text-[#E91E63] shrink-0">
                                        <CheckIcon />
                                    </span>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop CTA row */}
                        <div className="hidden lg:flex items-stretch gap-3">
                            <div className="relative shrink-0">
                                <label htmlFor="pdp-qty" className="sr-only">
                                    Quantity
                                </label>
                                <select
                                    id="pdp-qty"
                                    value={qty}
                                    onChange={(e) => setQty(parseInt(e.target.value, 10))}
                                    className="h-12 w-[4.5rem] appearance-none rounded-full border border-[#efeae4] bg-white pl-4 pr-8 text-[14px] font-semibold text-[#2a2724] focus:outline-none focus:border-[#E91E63] cursor-pointer"
                                >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                                <svg
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8a847c]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToBag}
                                className={`flex-1 h-12 rounded-full text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 active:scale-[0.98] ${
                                    addedToBag
                                        ? "bg-[#2a2724] text-white"
                                        : "bg-[#E91E63] text-white hover:bg-[#C2185B]"
                                }`}
                            >
                                {addedToBag ? "Added to bag" : "Add to bag"}
                            </button>

                            <button
                                type="button"
                                onClick={handleWishlist}
                                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                className={`h-12 w-12 shrink-0 rounded-full border flex items-center justify-center transition-all duration-200 ${
                                    isWishlisted
                                        ? "border-[#E91E63] text-[#E91E63] bg-[#faf0f3]"
                                        : "border-[#efeae4] text-[#2a2724] bg-white hover:border-[#E91E63]/50 hover:text-[#E91E63]"
                                }`}
                            >
                                <svg
                                    className={`w-4.5 h-4.5 w-[18px] h-[18px] ${
                                        isWishlisted ? "fill-[#E91E63] stroke-[#E91E63]" : "fill-none stroke-current"
                                    }`}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.7"
                                    aria-hidden
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile wishlist (sticky bar handles add) */}
                        <button
                            type="button"
                            onClick={handleWishlist}
                            className={`lg:hidden mt-1 w-full h-12 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase border transition-all duration-200 flex items-center justify-center gap-2 ${
                                isWishlisted
                                    ? "border-[#E91E63] text-[#E91E63] bg-[#faf0f3]"
                                    : "border-[#efeae4] text-[#2a2724] bg-white"
                            }`}
                        >
                            <svg
                                className={`w-4 h-4 ${
                                    isWishlisted ? "fill-[#E91E63] stroke-[#E91E63]" : "fill-none stroke-current"
                                }`}
                                viewBox="0 0 24 24"
                                strokeWidth="1.7"
                                aria-hidden
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            {isWishlisted ? "Saved to wishlist" : "Save to wishlist"}
                        </button>

                        <TrustStrip className="mt-7" />

                        {detailRows.length > 0 && (
                            <div className="mt-9 pt-7 border-t border-[#efeae4]">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a847c] mb-4">
                                    Product details
                                </p>
                                <dl className="divide-y divide-[#efeae4]">
                                    {detailRows.map((row) => (
                                        <div
                                            key={row.label}
                                            className="grid grid-cols-[7rem_1fr] sm:grid-cols-[8.5rem_1fr] gap-3 py-3.5"
                                        >
                                            <dt className="text-[12px] font-semibold text-[#2a2724]">
                                                {row.label}
                                            </dt>
                                            <dd className="text-[13px] text-[#6b6560] leading-relaxed">
                                                {row.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}

                        <p className="mt-7 text-[12px] text-[#8a847c] leading-relaxed">
                            Arrives in{" "}
                            <span className="font-semibold text-[#2a2724]">3–5 business days</span>{" "}
                            across India · Secure prepaid checkout
                        </p>
                    </div>
                </div>

                {/* Reviews */}
                <div className="pt-12 lg:pt-14 border-t border-[#efeae4] mb-12 lg:mb-16">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
                        <div>
                            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#E91E63] uppercase mb-2 block">
                                Verified reviews
                            </span>
                            <h2 className="font-playfair text-2xl sm:text-3xl font-medium text-[#2a2724] tracking-tight">
                                Customer reviews
                            </h2>
                        </div>
                        {!showReviewForm && (
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#efeae4] bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2a2724] hover:border-[#E91E63]/40 hover:text-[#E91E63] transition-colors self-start sm:self-auto"
                            >
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

                {/* Related */}
                {relatedProducts.length > 0 && (
                    <div className="pt-12 lg:pt-14 border-t border-[#efeae4]">
                        <div className="flex items-end justify-between gap-4 mb-8 lg:mb-10">
                            <div>
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#E91E63] uppercase mb-2 block">
                                    Pair it
                                </span>
                                <h2 className="font-playfair text-2xl sm:text-3xl font-medium text-[#2a2724] tracking-tight">
                                    Complete the look
                                </h2>
                                <p className="text-[13px] text-[#8a847c] mt-2 max-w-md">
                                    Soft pieces meant to layer — everyday shine, same anti-tarnish finish.
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                className="hidden sm:inline-flex text-[11px] font-semibold tracking-[0.16em] uppercase text-[#E91E63] hover:text-[#C2185B] transition-colors shrink-0"
                            >
                                Shop all
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-8">
                            {relatedProducts.slice(0, 4).map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    {...reviewCardProps(relatedReviewCounts, p.id)}
                                />
                            ))}
                        </div>

                        <div className="mt-8 text-center sm:hidden">
                            <Link
                                href="/shop"
                                className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#E91E63]"
                            >
                                Shop all jewellery →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile sticky bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-[#efeae4] bg-white/95 backdrop-blur-md px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center gap-2.5 shadow-[0_-8px_30px_rgba(42,39,36,0.08)]">
                <div className="relative shrink-0">
                    <select
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value, 10))}
                        aria-label="Quantity"
                        className="h-12 w-14 appearance-none rounded-full border border-[#efeae4] bg-white pl-3.5 pr-6 text-sm font-semibold text-[#2a2724] focus:outline-none focus:border-[#E91E63]"
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <svg
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8a847c]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <div className="shrink-0 min-w-0">
                    <p className="text-base font-semibold text-[#2a2724] leading-none">₹{price}</p>
                    {hasDiscount && (
                        <p className="text-[10px] text-[#9a948c] line-through mt-0.5">
                            ₹
                            {originalPrice.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                            })}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleAddToBag}
                    className={`flex-1 h-12 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 ${
                        addedToBag ? "bg-[#2a2724] text-white" : "bg-[#E91E63] text-white"
                    }`}
                >
                    {addedToBag ? "Added" : "Add to bag"}
                </button>
            </div>
        </div>
    );
}
