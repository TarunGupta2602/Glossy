export default function Testimonials() {
    const reviews = [
        {
            name: "Ananya Iyer",
            location: "Bangalore",
            text: "I wore the Statement Earrings for a relative's wedding and they look so premium. The best part? They are truly anti-tarnish. I've worn them multiple times and they still have that first-day glow!",
            initials: "AI"
        },
        {
            name: "Priyanka Sharma",
            location: "Delhi",
            text: "Finally found jewelry I can wear to the office every day without worrying about sweat or water. The 18k gold plating is exceptional and the finish is very skin-friendly. Highly recommend!",
            initials: "PS"
        },
        {
            name: "Ishani Mehta",
            location: "Mumbai",
            text: "The 'Sparkle Jewelry Duo' is my new absolute favorite. It matches perfectly with both my kurtis and western dresses. The packaging was lovely and the delivery was ahead of schedule.",
            initials: "IM"
        },
    ];

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-[#FFF5F8] to-white overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <span className="text-[11px] font-black tracking-[0.4em] text-[#E91E63] uppercase mb-4 block">
                        OUR PATREONS
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        What Our Community Says
                    </h2>
                    <div className="w-16 h-[2px] bg-[#E91E63] mx-auto rounded-full opacity-30"></div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(31,38,135,0.08)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 group"
                        >
                            {/* Avatar/Initial Case */}
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF80AB] flex items-center justify-center text-white font-black text-lg mb-6 shadow-lg shadow-[#FF80AB]/20 group-hover:scale-110 transition-transform duration-300">
                                {review.initials}
                            </div>

                            {/* Verified Badge */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>



                            {/* Review Text */}
                            <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow">
                                &quot;{review.text}&quot;
                            </p>

                            {/* Profile Info */}
                            <div className="mt-auto">
                                <h4 className="text-base font-bold text-gray-900 group-hover:text-[#E91E63] transition-colors">{review.name}</h4>
                                <div className="flex items-center gap-2 justify-center mt-1">

                                    <span className="text-[10px] font-medium text-gray-400 capitalize">• {review.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}