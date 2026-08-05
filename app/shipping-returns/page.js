import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const dynamic = "force-static";

export const metadata = {
    title: "Shipping & Returns",
    description: "Learn about our shipping times, delivery process, and easy return policy at The Luxe Jewels.",
    alternates: {
        canonical: "/shipping-returns",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};

export default function ShippingReturns() {
    return (
        <LegalPageLayout
            title="Shipping & Returns"
            description="Everything you need to know about delivery, tracking, and our hassle-free return policy."
        >
            <LegalSection title="Shipping Information">
                <p>We offer fast and reliable shipping across India. Orders are processed within 1–2 business days.</p>
                <ul className="list-disc pl-5 space-y-2 mt-3">
                    <li>Standard delivery: 3–7 business days</li>
                    <li>Express delivery: 1–3 business days (where available)</li>
                    <li>Free shipping on prepaid orders over ₹1000</li>
                </ul>
            </LegalSection>

            <LegalSection title="Order Tracking">
                <p>
                    Once your order is shipped, you will receive a tracking link via email or SMS to monitor your delivery in real-time.
                </p>
            </LegalSection>

            <LegalSection title="Returns & Exchanges">
                <p>We offer a hassle-free return policy within 10 days of delivery.</p>
                <ul className="list-disc pl-5 space-y-2 mt-3">
                    <li>Items must be unused and in original packaging</li>
                    <li>Return request must be initiated within 10 days</li>
                    <li>Refunds are processed within 5–7 business days</li>
                </ul>
            </LegalSection>

            <LegalSection title="Refunds">
                <p>
                    Refunds are issued to the original payment method within 5–7 business days after we receive and inspect the returned item.
                </p>
            </LegalSection>

            <LegalSection title="Need Help?">
                <p>
                    If you have any questions regarding your order, contact our support team at{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-gray-900 hover:text-[#E91E63] transition-colors">
                        {SUPPORT_EMAIL}
                    </a>.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
}
