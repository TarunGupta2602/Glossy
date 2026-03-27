export const dynamic = "force-static";

export const metadata = {
    title: "Shipping & Returns",
    description: "Learn about our shipping times, delivery process, and easy return policy at The luxe jewels.",
    alternates: {
        canonical: "/shipping-returns",
    },
};

export default function ShippingReturns() {
    return (
        <section className="bg-white py-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Shipping & Returns
                    </h1>
                    <p className="text-gray-500">
                        Everything you need to know about delivery and returns.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12 text-gray-700 leading-relaxed">

                    {/* Shipping */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Shipping Information
                        </h2>
                        <p className="mb-4">
                            We offer fast and reliable shipping across India. Orders are processed within 1–2 business days.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Standard Delivery: 3–7 business days</li>
                            <li>Express Delivery: 1–3 business days</li>
                            <li>Free shipping on all prepaid orders</li>
                        </ul>
                    </div>

                    {/* Order Tracking */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Order Tracking
                        </h2>
                        <p>
                            Once your order is shipped, you will receive a tracking link via email or SMS to monitor your delivery in real-time.
                        </p>
                    </div>

                    {/* Returns */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Returns & Exchanges
                        </h2>
                        <p className="mb-4">
                            We offer a hassle-free return policy within 7 days of delivery.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Items must be unused and in original packaging</li>
                            <li>Return request must be initiated within 7 days</li>
                            <li>Refunds are processed within 5–7 business days</li>
                        </ul>
                    </div>

                    {/* Refunds */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Refunds
                        </h2>
                        <p>
                            Refunds are issued to the original payment method. For Cash on Delivery orders, refunds will be processed via bank transfer.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Need Help?
                        </h2>
                        <p>
                            If you have any questions regarding your order, feel free to contact our support team at{" "}
                            <span className="font-medium text-gray-900">
                                support@theluxejewels.in
                            </span>.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}