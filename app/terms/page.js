export const dynamic = "force-static";

export const metadata = {
    title: "Terms of Service | Glossy Jewelry",
    description:
        "Read the terms and conditions for using Glossy Jewelry website, including orders, payments, and user responsibilities.",
};

export default function TermsPage() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto">

                {/* Heading */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Please read these terms carefully before using our website.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Use of Website
                        </h2>
                        <p>
                            By accessing our website, you agree to use it only for lawful purposes and in a way
                            that does not infringe the rights of others or restrict their use of the site.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Product Information
                        </h2>
                        <p>
                            We strive to display accurate product descriptions, pricing, and images. However,
                            we do not guarantee that all information is completely error-free.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Orders & Payments
                        </h2>
                        <p>
                            All orders are subject to availability and confirmation. We reserve the right to
                            cancel or refuse any order at our discretion. Payments must be completed before
                            order processing.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Shipping & Delivery
                        </h2>
                        <p>
                            Delivery timelines are estimates and may vary depending on location and external
                            factors. We are not responsible for delays caused by courier services.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Returns & Refunds
                        </h2>
                        <p>
                            Returns are accepted as per our return policy. Refunds will be processed after
                            inspection of returned items.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Intellectual Property
                        </h2>
                        <p>
                            All content on this website, including images, text, and branding, is the property
                            of Glossy Jewelry and may not be used without permission.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Limitation of Liability
                        </h2>
                        <p>
                            We are not liable for any indirect, incidental, or consequential damages arising
                            from the use of our website or products.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to update these terms at any time. Continued use of the
                            website means you accept the updated terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-gray-900 mb-1">
                            Contact Us
                        </h2>
                        <p>
                            If you have any questions about these Terms, please contact us at{" "}
                            <span className="text-gray-900 font-medium">
                                support@glossy.com
                            </span>.
                        </p>
                    </div>

                </div>

                {/* Footer Note */}
                <p className="text-xs text-gray-400 mt-12 text-center">
                    Last updated: March 2026
                </p>

            </div>
        </section>
    );
}