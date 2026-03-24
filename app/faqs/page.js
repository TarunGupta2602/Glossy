export const dynamic = "force-static";

export const metadata = {
    title: "FAQs | SLAYAURA Jewelry",
    description:
        "Find answers to common questions about shipping, returns, delivery time, and orders at SLAYAURA Jewelry.",
    keywords: [
        "SLAYAURA FAQs",
        "shipping policy",
        "returns policy",
        "jewelry delivery",
        "order help",
    ],
};

export default function FAQsPage() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Everything you need to know about orders, shipping, and returns.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="divide-y divide-gray-200">

                    <div className="py-5">
                        <h2 className="font-medium text-gray-900">
                            How long does shipping take?
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Orders are processed within 1–2 days and delivered within 3–7 business days.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-medium text-gray-900">
                            Do you offer free shipping?
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Yes, we offer free shipping on all prepaid orders across India.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-medium text-gray-900">
                            Can I return my order?
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Yes, returns are accepted within 7 days of delivery if the item is unused.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-medium text-gray-900">
                            How do I track my order?
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            You will receive a tracking link via email or SMS once your order is shipped.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-medium text-gray-900">
                            How long does a refund take?
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Refunds are processed within 5–7 business days after the return is approved.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}