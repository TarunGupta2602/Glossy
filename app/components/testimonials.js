import Link from "next/link";
import { getInitials } from "@/lib/featuredReviews";
import { getProductPath } from "@/lib/seo";
import { HOME_CONTAINER } from "@/lib/siteLayout";

export default function Testimonials({ reviews = [], reviewStats = null }) {
    if (!reviews.length) {
        return null;
    }

    return (
        <section className="py-10 md:py-16 bg-gradient-to-b from-[#FFF5F8] to-white overflow-hidden">
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-6 md:mb-12 px-1">
                    <span className="text-[11px] font-black tracking-wider text-[#E91E63] uppercase mb-2 md:mb-3 block">
                        Verified reviews
                    </span>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-900 tracking-tight mb-2 md:mb-4">
                        Loved in real life
                    </h2>
                    {reviewStats?.count > 0 && (
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                            <span className="text-amber-500">{reviewStats.average}★</span>
                            {" "}from {reviewStats.count} verified review{reviewStats.count === 1 ? "" : "s"}
                        </p>
                    )}
                    <div className="w-16 h-[2px] bg-[#E91E63] mx-auto rounded-full opacity-30" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    {reviews.map((review) => {
                        const initials = getInitials(review.user_name);
                        const product = review.products;
                        const productName = product?.name;
                        const productHref = product ? getProductPath(product) : null;

                        return (
                            <article
                                key={review.id}
                                className="bg-white rounded-2xl md:rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-[0_15px_40px_-15px_rgba(31,38,135,0.08)] border border-gray-50 flex flex-col items-center text-center transition-all duration-500"
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF80AB] flex items-center justify-center text-white font-black text-lg mb-6 shadow-lg shadow-[#FF80AB]/20 group-hover:scale-110 transition-transform duration-300">
                                    {initials || "★"}
                                </div>

                                <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
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

                                <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow">
                                    &quot;{review.comment}&quot;
                                </p>

                                <div className="mt-auto">
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#E91E63] transition-colors">
                                        {review.user_name}
                                    </h3>
                                    <div className="flex flex-col items-center gap-2 mt-1">
                                        {review.is_verified_purchase && (
                                            <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">
                                                Verified purchase
                                            </span>
                                        )}
                                        {productName && productHref && (
                                            <Link
                                                href={productHref}
                                                className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#E91E63] hover:text-[#c2185b] transition-colors"
                                            >
                                                Shop this look →
                                            </Link>
                                        )}
                                        {productName && !productHref && (
                                            <span className="text-[10px] font-medium text-gray-600">
                                                {productName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
