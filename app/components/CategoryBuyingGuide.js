import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import FaqAccordion from "./FaqAccordion";
import { buildFaqJsonLd } from "@/lib/categoryGuides";

export default function CategoryBuyingGuide({ guide }) {
    if (!guide) return null;
    const faqJsonLd = buildFaqJsonLd(guide.faqs || []);

    return (
        <section className="py-10 md:py-14 bg-[#faf7f8] border-t border-gray-100">
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            <div className={SITE_CONTAINER}>
                <div className="max-w-3xl mx-auto mb-8 md:mb-10 text-center md:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E91E63] mb-2">
                        Buying guide
                    </p>
                    <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                        {guide.title}
                    </h2>
                    <p className="text-[15px] text-gray-600 leading-relaxed">{guide.intro}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto mb-8 md:mb-10">
                    {(guide.sections || []).map((section) => (
                        <article
                            key={section.heading}
                            className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6"
                        >
                            <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                                {section.heading}
                            </h3>
                            <p className="text-[14px] text-gray-600 leading-relaxed">
                                {section.body}
                            </p>
                        </article>
                    ))}
                </div>

                {guide.faqs?.length > 0 && (
                    <div className="max-w-3xl mx-auto mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">
                            Frequently asked questions
                        </h3>
                        <FaqAccordion items={guide.faqs} />
                    </div>
                )}

                {guide.links?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E91E63]">
                        {guide.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="min-h-9 inline-flex items-center hover:underline"
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
