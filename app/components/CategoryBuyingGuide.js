import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { buildFaqJsonLd } from "@/lib/categoryGuides";
import FaqAccordion from "./FaqAccordion";

/** Visible buying copy plus FAQ schema. Hidden-only FAQ markup is not enough for Google. */
export default function CategoryBuyingGuide({ guide }) {
    if (!guide) return null;
    const faqJsonLd = buildFaqJsonLd(guide.faqs || []);

    return (
        <section className="bg-[#faf7f2] border-t border-[#efeae4]">
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <div className={`${SITE_CONTAINER} py-12 md:py-16`}>
                <h2
                    className="text-2xl md:text-4xl font-bold text-[#2a2724] tracking-tight max-w-3xl"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    {guide.title}
                </h2>
                {guide.intro && (
                    <p className="mt-4 max-w-3xl text-sm md:text-base text-[#5c564f] leading-relaxed">
                        {guide.intro}
                    </p>
                )}

                {guide.sections?.length > 0 && (
                    <div className="mt-8 grid gap-8 md:grid-cols-2">
                        {guide.sections.map((section) => (
                            <div key={section.heading}>
                                <h3 className="text-base font-semibold text-[#2a2724]">
                                    {section.heading}
                                </h3>
                                <p className="mt-2 text-sm text-[#5c564f] leading-relaxed">
                                    {section.body}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {guide.faqs?.length > 0 && (
                    <div className="mt-10 max-w-3xl">
                        <h3
                            className="text-xl font-bold text-[#2a2724] mb-4"
                            style={{ fontFamily: "var(--font-playfair)" }}
                        >
                            Before you order
                        </h3>
                        <FaqAccordion items={guide.faqs} variant="editorial" idPrefix="buying-guide" />
                    </div>
                )}

                {guide.links?.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2">
                        {guide.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3.5 py-2 rounded-full border border-[#e4ddd4] bg-white text-xs font-semibold text-[#2a2724] hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
