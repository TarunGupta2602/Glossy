export default function Newsletter() {
    return (
        <section className="py-28 bg-white text-center">
            <div className="max-w-3xl mx-auto px-6">

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                    Join the Glossy List
                </h2>

                {/* Subtext */}
                <p className="text-gray-500 text-[16px] mb-10">
                    Sign up for early access to new drops and exclusive offers.
                </p>

                {/* Form */}
                <form className="flex items-center justify-center gap-3 max-w-xl mx-auto">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-5 py-4 rounded-xl border border-gray-200 bg-[#f7f7f7] text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-300"
                        required
                    />

                    <button
                        type="submit"
                        className="px-8 py-4 rounded-xl bg-[#0f172a] text-white font-semibold hover:opacity-90 transition"
                    >
                        Join
                    </button>
                </form>

            </div>
        </section>
    );
}