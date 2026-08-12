import Image from "next/image";
import Link from "next/link";
import { getInitials, getReviewVisual } from "@/lib/featuredReviews";
import { getProductPath } from "@/lib/seo";
import { HOME_CONTAINER, HOME_EDGE_SCROLL } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

export default function Testimonials({ reviews = [], reviewStats = null }) {
    if (!reviews.length) {
        return null;
    }

    const photoReviews = reviews
        .map((review) => ({ review, visual: getReviewVisual(review) }))
        .filter((item) => item.visual)
        .slice(0, 8);

    const quoteReviews = reviews.slice(0, 3);

    return (
        <section className="py-8 md:py-14 bg-gradient-to-b from-[#FFF5F8] to-white overflow-hidden">
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-5 md:mb-8 px-1">
                    <span className="text-[11px] font-semibold tracking-[0.18em] text-[#E91E63] uppercase mb-2 block">
                        Verified reviews
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-900 tracking-tight mb-2">
                        Loved in real life
                    </h2>
                    {reviewStats?.count > 0 && (
                        <p className="text-sm font-semibold text-gray-600">
                            <span className="text-amber-500">{reviewStats.average}★</span>
                            {" "}from {reviewStats.count} verified review
                            {reviewStats.count === 1 ? "" : "s"}
                        </p>
                    )}
                </div>

                {photoReviews.length > 0 && (
                    <div className={`flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar mb-6 md:mb-10 ${HOME_EDGE_SCROLL} pb-1`}>
                        {photoReviews.map(({ review, visual }) => {
                            const product = review.products;
                            const href = product ? getProductPath(product) : "/shop";
                            return (
                                <Link
                                    key={`photo-${review.id}`}
                                    href={href}
                                    className="group relative shrink-0 w-[28vw] max-w-[140px] sm:w-[120px] aspect-[3/4] overflow-hidden rounded-2xl bg-[#f3ebe4] ring-1 ring-black/5"
                                >
                                    <Image
                                        src={visual}
                                        alt={product?.name || "Customer look"}
                                        fill
                                        sizes="120px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        placeholder="blur"
                                        blurDataURL={IMAGE_BLUR_DATA_URL}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                                    <span className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-white line-clamp-1">
                                        {review.user_name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {quoteReviews.map((review) => {
                        const initials = getInitials(review.user_name);
                        const product = review.products;
                        const productName = product?.name;
                        const productHref = product ? getProductPath(product) : null;

                        return (
                            <article
                                key={review.id}
                                className="bg-white rounded-2xl md:rounded-[1.75rem] p-5 sm:p-6 shadow-[0_12px_36px_-18px_rgba(26,18,20,0.18)] border border-gray-50 flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-full bg-[#fce4ec] text-[#E91E63] flex items-center justify-center font-semibold text-sm">
                                        {initials || "★"}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {review.user_name}
                                        </h3>
                                        {review.is_verified_purchase && (
                                            <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">
                                                Verified purchase
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-0.5 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-3.5 h-3.5 fill-current ${i < review.rating ? "text-amber-400" : "text-gray-200"}`}
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-gray-600 text-[14px] leading-relaxed flex-grow">
                                    &quot;{review.comment}&quot;
                                </p>

                                {productName && productHref && (
                                    <Link
                                        href={productHref}
                                        className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E91E63] hover:text-[#c2185b] transition-colors"
                                    >
                                        Shop this look →
                                    </Link>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
