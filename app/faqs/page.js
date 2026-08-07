import { SITE_CONTAINER } from "@/lib/siteLayout";
import FaqAccordion from "../components/FaqAccordion";

export const dynamic = "force-static";

const FAQ_ITEMS = [
    {
        question: "Is your jewellery truly anti-tarnish?",
        answer:
            "Yes, our jewellery is crafted with high-quality materials and 18k gold plating with a special protective layer that makes it tarnish-resistant for long-lasting wear.",
    },
    {
        question: "Can I wear The Luxe Jewels in the shower?",
        answer:
            "Our jewellery is designed to be waterproof. However, to maintain the maximum brilliance of the gold plating, we recommend avoiding prolonged exposure to harsh chemicals or perfumes.",
    },
    {
        question: "How long does shipping take within India?",
        answer:
            "Orders are processed within 1–2 days and delivered within 3–7 business days. Prepaid orders are usually delivered faster across major cities in India.",
    },
    {
        question: "Do you offer free shipping?",
        answer: "Yes, we offer free shipping on all orders above ₹1000 across India.",
    },
    {
        question: "Is the jewellery safe for sensitive skin?",
        answer:
            "Absolutely. All our pieces are nickel-free and lead-free, ensuring they are hypoallergenic and safe for daily wear even on sensitive skin.",
    },
];

export const metadata = {
    title: "FAQs | Shipping, Returns & Order Help",
    description:
        "Find answers to common questions about shipping, returns, delivery time, and orders at The Luxe Jewels.",
    alternates: {
        canonical: "/faqs",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};

export default function FAQsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <section className="bg-white py-12 md:py-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className={`${SITE_CONTAINER} max-w-3xl`}>
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Everything you need to know about orders, shipping, and returns.
                    </p>
                </div>

                <FaqAccordion items={FAQ_ITEMS} />
            </div>
        </section>
    );
}
