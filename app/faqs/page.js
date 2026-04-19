export const dynamic = "force-static";

export const metadata = {
    title: "FAQs",
    description:
        "Find answers to common questions about shipping, returns, delivery time, and orders at The luxe jewels.",
    alternates: {
        canonical: "/faqs",
    },
    keywords: [
        "The luxe jewels FAQs",
        "shipping policy",
        "returns policy",
        "jewelry delivery",
        "order help",
    ],
};

export default function FAQsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is your jewelry truly anti-tarnish?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our jewelry is crafted with high-quality materials and 18k gold plating with a special protective layer that makes it tarnish-resistant for long-lasting wear."
                }
            },
            {
                "@type": "Question",
                "name": "Can I wear The Luxe Jewels in the shower?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our jewelry is designed to be waterproof. However, to maintain the maximum brilliance of the gold plating, we recommend avoiding prolonged exposure to harsh chemicals or perfumes."
                }
            },
            {
                "@type": "Question",
                "name": "How long does shipping take within India?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Prepaid orders are usually delivered within 3–5 business days across major cities in India like Delhi, Mumbai, and Bangalore."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer free shipping?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we offer free shipping on all orders above ₹1000."
                }
            },
            {
                "@type": "Question",
                "name": "Is the jewelry hypoallergenic and safe for sensitive skin?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. All our pieces are nickel-free and lead-free, ensuring they are hypoallergenic and safe for daily wear even on sensitive skin."
                }
            }
        ]
    };

    return (
        <section className="bg-white py-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                        <h2 className="font-semibold text-gray-900">
                            Is your jewelry truly anti-tarnish?
                        </h2>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Yes, our jewelry is crafted with high-quality materials and 18k gold plating with a special protective layer that makes it tarnish-resistant for long-lasting wear.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-semibold text-gray-900">
                            Can I wear The Luxe Jewels in the shower?
                        </h2>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Our jewelry is designed to be waterproof. However, to maintain the maximum brilliance of the gold plating, we recommend avoiding prolonged exposure to harsh chemicals or perfumes.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-semibold text-gray-900">
                            How long does shipping take within India?
                        </h2>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Orders are processed within 1–2 days and delivered within 3–7 business days. Prepaid orders are usually delivered faster across major cities in India.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-semibold text-gray-900">
                            Do you offer free shipping?
                        </h2>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Yes, we offer free shipping on all orders above ₹1000 across India.
                        </p>
                    </div>

                    <div className="py-5">
                        <h2 className="font-semibold text-gray-900">
                            Is the jewelry safe for sensitive skin?
                        </h2>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Absolutely. All our pieces are nickel-free and lead-free, ensuring they are hypoallergenic and safe for daily wear even on sensitive skin.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}