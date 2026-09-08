import { SITE_FAQS } from "@/lib/faqs";
import SiteFaqSection from "../components/SiteFaqSection";

export const dynamic = "force-static";

export const metadata = {
    title: "FAQs | Anti-Tarnish Jewellery, Shipping & Returns",
    description:
        "Answers about anti-tarnish waterproof jewellery, Buy 2 Get 1 Free, free shipping over ₹1000, returns, COD, and support at The Luxe Jewels — Noida, Delhi NCR & pan-India.",
    alternates: {
        canonical: "/faqs",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "FAQs | The Luxe Jewels",
        description:
            "Shipping, returns, anti-tarnish care, and Buy 2 Get 1 Free — clear answers before you shop.",
        url: "https://www.theluxejewels.in/faqs",
        siteName: "The Luxe Jewels",
        type: "website",
    },
};

export default function FAQsPage() {
    return (
        <SiteFaqSection
            faqs={SITE_FAQS}
            eyebrow="Help centre"
            title="Questions,"
            titleAccent="answered"
            description="Shipping, returns, anti-tarnish care, offers, and support — for shoppers across India."
            showContactCta={true}
            showAllFaqsLink={false}
            headingAs="h1"
            idPrefix="faqs-page"
            className="border-t-0 min-h-[60vh]"
        />
    );
}
