export const dynamic = "force-static";

export const metadata = {
    title: "Privacy Policy",
    description:
        "Learn how The luxe jewels collects, uses, and protects your personal information when you use our website.",
    alternates: {
        canonical: "/privacy",
    },
};

export default function PrivacyPolicy() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Heading */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Your privacy is important to us. This policy explains how we handle your data.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Information We Collect
                        </h2>
                        <p>
                            We collect personal information such as your name, email address, phone number,
                            and shipping details when you place an order or sign up on our website.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            How We Use Your Information
                        </h2>
                        <p>
                            Your information is used to process orders, improve our services, and communicate
                            with you regarding updates, offers, and support.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Data Protection
                        </h2>
                        <p>
                            We take appropriate security measures to protect your personal data from unauthorized
                            access, misuse, or disclosure.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Sharing of Information
                        </h2>
                        <p>
                            We do not sell or rent your personal information. Your data may only be shared with
                            trusted service providers for order processing and delivery.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Cookies
                        </h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience and analyze site traffic.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Your Rights
                        </h2>
                        <p>
                            You have the right to access, update, or delete your personal information at any time
                            by contacting us.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <span className="text-gray-900 font-medium">
                                support@theluxejewels.in
                            </span>.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}