export const dynamic = "force-static";

import { SUPPORT_EMAIL } from "@/lib/constants";
import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export const metadata = {
    title: "Privacy Policy",
    description:
        "Learn how The Luxe Jewels collects, uses, and protects your personal information when you use our website.",
    alternates: {
        canonical: "/privacy",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};

export default function PrivacyPolicy() {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            description="Your privacy is important to us. This policy explains how we handle your data when you shop with The Luxe Jewels."
        >
            <LegalSection title="Information We Collect">
                <p>
                    We collect personal information such as your name, email address, phone number,
                    and shipping details when you place an order or sign up on our website.
                </p>
            </LegalSection>

            <LegalSection title="How We Use Your Information">
                <p>
                    Your information is used to process orders, improve our services, and communicate
                    with you regarding updates, offers, and support.
                </p>
            </LegalSection>

            <LegalSection title="Data Protection">
                <p>
                    We take appropriate security measures to protect your personal data from unauthorized
                    access, misuse, or disclosure.
                </p>
            </LegalSection>

            <LegalSection title="Sharing of Information">
                <p>
                    We do not sell or rent your personal information. Your data may only be shared with
                    trusted service providers for order processing and delivery.
                </p>
            </LegalSection>

            <LegalSection title="Cookies">
                <p>
                    Our website uses cookies to enhance your browsing experience and analyze site traffic.
                </p>
            </LegalSection>

            <LegalSection title="Your Rights">
                <p>
                    You have the right to access, update, or delete your personal information at any time
                    by contacting us.
                </p>
            </LegalSection>

            <LegalSection title="Contact Us">
                <p>
                    If you have any questions about this Privacy Policy, please contact us at{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-gray-900 hover:text-[#E91E63] transition-colors">
                        {SUPPORT_EMAIL}
                    </a>.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
}
