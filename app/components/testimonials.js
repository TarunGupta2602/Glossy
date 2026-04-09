export default function Testimonials() {
    const reviews = [
        {
            name: "Sarah Jenkins",
            text: "The earrings I purchased are even more beautiful in person. I get compliments every time I wear them. Truly luxury quality.",
        },
        {
            name: "Elena Rodriguez",
            text: "Their unique bracelets have become a staple in my daily look. The luxe jewels is my new go-to for refined jewelry. Fast shipping and lovely packaging.",
        },
        {
            name: "Maya Thompson",
            text: "I'm obsessed with the attention to detail. These aren't just accessories; they are works of art. Highly recommend!",
        },
    ];

    return (
        <section className="py-24 px-6 bg-[#f3e9ec]">
            <div className="max-w-7xl mx-auto text-center">

                {/* Heading */}
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    What Our Community Says
                </h2>

                {/* Underline */}
                <div className="w-14 h-[3px] bg-pink-500 mx-auto mb-16 rounded-full"></div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-[#f8f8f8] rounded-xl p-10 shadow-sm border border-gray-100"
                        >
                            {/* Stars */}
                            <div className="flex justify-center mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-4 h-4 text-pink-500 mx-[2px]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-gray-500 italic leading-relaxed text-[15px] mb-8 px-4">
                                &quot;{review.text}&quot;
                            </p>

                            {/* Name */}
                            <h4 className="text-lg font-semibold text-gray-900">
                                {review.name}
                            </h4>

                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                                Verified Buyer
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}