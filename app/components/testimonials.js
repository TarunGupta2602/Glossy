import { getInitials } from "@/lib/featuredReviews";
import { HOME_CONTAINER } from "@/lib/siteLayout";

export default function Testimonials({ reviews = [], reviewStats = null }) {
    if (!reviews.length) {
        return null;
    }

    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-[#FFF5F8] to-white overflow-hidden">
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-8 md:mb-12">
                    <span className="text-[11px] font-black tracking-wider text-[#E91E63] uppercase mb-3 block">
                        VERIFIED REVIEWS
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3 md:mb-4">
                        What Our Community Says
                    </h2>
                    {reviewStats?.count > 0 && (
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                            <span className="text-amber-500">{reviewStats.average}★</span>
                            {" "}from {reviewStats.count} verified review{reviewStats.count === 1 ? "" : "s"}
                        </p>
                    )}
                    <div className="w-16 h-[2px] bg-[#E91E63] mx-auto rounded-full opacity-30" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {reviews.map((review) => {
                        const initials = getInitials(review.user_name);
                        const productName = review.products?.name;

                        return (
                            <div
                                key={review.id}
                                className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-[0_15px_40px_-15px_rgba(31,38,135,0.08)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 group"
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF80AB] flex items-center justify-center text-white font-black text-lg mb-6 shadow-lg shadow-[#FF80AB]/20 group-hover:scale-110 transition-transform duration-300">
                                    {initials || "★"}
                                </div>

                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-3.5 h-3.5 fill-current ${i < review.rating ? "text-amber-400" : "text-gray-200"}`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow">
                                    &quot;{review.comment}&quot;
                                </p>

                                <div className="mt-auto">
                                    <h4 className="text-base font-bold text-gray-900 group-hover:text-[#E91E63] transition-colors">
                                        {review.user_name}
                                    </h4>
                                    <div className="flex flex-col items-center gap-1 mt-1">
                                        {review.is_verified_purchase && (
                                            <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">
                                                Verified purchase
                                            </span>
                                        )}
                                        {productName && (
                                            <span className="text-[10px] font-medium text-gray-600">
                                                {productName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
