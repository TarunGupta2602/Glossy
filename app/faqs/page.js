import { SITE_FAQS } from "@/lib/faqs";
import SiteFaqSection from "../components/SiteFaqSection";

export const dynamic = "force-static";

export const metadata = {
    title: "Help Centre: Shipping, Returns & Care",
    description:
        "Answers on shipping times, returns, Buy 2 Get 1 Free, COD, waterproof care, and support — before you place an order.",
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
        title: "Help Centre: Shipping, Returns & Care",
        description:
            "Shipping, returns, care tips, and Buy 2 Get 1 Free — clear answers before you shop.",
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
