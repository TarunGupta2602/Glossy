export const dynamic = "force-static";

import { SUPPORT_EMAIL } from "@/lib/constants";
import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export const metadata = {
    title: "Terms of Service",
    description:
        "Read the terms and conditions for using The Luxe Jewels website, including orders, payments, and user responsibilities.",
    alternates: {
        canonical: "/terms",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};

export default function TermsPage() {
    return (
        <LegalPageLayout
            title="Terms of Service"
            description="Please read these terms carefully before using our website or placing an order."
        >
            <LegalSection title="Use of Website">
                <p>
                    By accessing our website, you agree to use it only for lawful purposes and in a way
                    that does not infringe the rights of others or restrict their use of the site.
                </p>
            </LegalSection>

            <LegalSection title="Product Information">
                <p>
                    We strive to display accurate product descriptions, pricing, and images. However,
                    we do not guarantee that all information is completely error-free.
                </p>
            </LegalSection>

            <LegalSection title="Orders & Payments">
                <p>
                    All orders are subject to availability and confirmation. We reserve the right to
                    cancel or refuse any order at our discretion. All payments must be completed online
                    before order processing — we do not offer cash on delivery.
                </p>
            </LegalSection>

            <LegalSection title="Shipping & Delivery">
                <p>
                    Delivery timelines are estimates and may vary depending on location and external
                    factors. We are not responsible for delays caused by courier services.
                </p>
            </LegalSection>

            <LegalSection title="Returns & Refunds">
                <p>
                    Returns are accepted as per our return policy. Refunds will be processed to the
                    original payment method after inspection of returned items.
                </p>
            </LegalSection>

            <LegalSection title="Intellectual Property">
                <p>
                    All content on this website, including images, text, and branding, is the property
                    of The Luxe Jewels and may not be used without permission.
                </p>
            </LegalSection>

            <LegalSection title="Limitation of Liability">
                <p>
                    We are not liable for any indirect, incidental, or consequential damages arising
                    from the use of our website or products.
                </p>
            </LegalSection>

            <LegalSection title="Changes to Terms">
                <p>
                    We reserve the right to update these terms at any time. Continued use of the
                    website means you accept the updated terms.
                </p>
            </LegalSection>

            <LegalSection title="Contact Us">
                <p>
                    If you have any questions about these Terms, please contact us at{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-gray-900 hover:text-[#E91E63] transition-colors">
                        {SUPPORT_EMAIL}
                    </a>.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
}
