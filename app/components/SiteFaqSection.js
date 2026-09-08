import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import { SUPPORT_EMAIL, WHATSAPP_URL } from "@/lib/constants";
import { buildFaqJsonLd } from "@/lib/faqs";
import FaqAccordion from "./FaqAccordion";

/**
 * Editorial FAQ block with FAQPage JSON-LD for SEO.
 */
export default function SiteFaqSection({
    faqs = [],
    eyebrow = "Support",
    title = "Questions,",
    titleAccent = "answered",
    description = "Everything you need to know before your next piece.",
    showContactCta = true,
    showAllFaqsLink = true,
    includeJsonLd = true,
    headingAs = "h2",
    idPrefix = "site-faq",
    className = "",
}) {
    if (!faqs.length) return null;

    const faqJsonLd = includeJsonLd ? buildFaqJsonLd(faqs) : null;
    const HeadingTag = headingAs === "h1" ? "h1" : "h2";

    return (
        <section
            className={`bg-[#fdfbf7] py-14 md:py-20 lg:py-24 border-t border-[#efeae4] ${className}`}
            aria-labelledby={`${idPrefix}-heading`}
        >
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            <div className={`${HOME_CONTAINER} max-w-[760px]`}>
                <div className="text-center mb-8 md:mb-12">
                    <p
                        className="text-[11px] font-medium tracking-[0.22em] uppercase mb-4"
                        style={{ color: "#b89a6a" }}
                    >
                        {eyebrow}
                    </p>
                    <HeadingTag
                        id={`${idPrefix}-heading`}
                        className="font-playfair text-[2rem] sm:text-[2.4rem] md:text-[2.75rem] font-medium text-[#2a2724] tracking-tight leading-[1.15] mb-3"
                    >
                        {title}{" "}
                        <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                            {titleAccent}
                        </em>
                    </HeadingTag>
                    {description ? (
                        <p className="text-[14px] sm:text-[15px] text-[#6b6560] leading-relaxed max-w-md mx-auto">
                            {description}
                        </p>
                    ) : null}
                    <div
                        className="mx-auto mt-6 h-px w-12"
                        style={{ backgroundColor: "#b89a6a" }}
                        aria-hidden="true"
                    />
                </div>

                <div className="border-t border-[#e8e2da]">
                    <FaqAccordion items={faqs} variant="editorial" idPrefix={idPrefix} />
                </div>

                {showContactCta ? (
                    <div className="mt-2 border-t border-[#e8e2da] pt-8 text-center">
                        <p className="text-[13px] sm:text-[14px] text-[#6b6560] leading-relaxed">
                            Still have questions? Write to us at{" "}
                            <a
                                href={`mailto:${SUPPORT_EMAIL}`}
                                className="text-[#2a2724] underline underline-offset-2 decoration-[#d4cbc0] hover:text-[#E91E63] hover:decoration-[#E91E63] transition-colors"
                            >
                                {SUPPORT_EMAIL}
                            </a>{" "}
                            or{" "}
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2a2724] underline underline-offset-2 decoration-[#d4cbc0] hover:text-[#25D366] hover:decoration-[#25D366] transition-colors"
                            >
                                message us on WhatsApp
                            </a>
                            .
                        </p>
                        {showAllFaqsLink ? (
                            <Link
                                href="/faqs"
                                className="mt-5 inline-flex min-h-10 items-center text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8a847c] hover:text-[#E91E63] transition-colors"
                            >
                                View all FAQs
                            </Link>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
