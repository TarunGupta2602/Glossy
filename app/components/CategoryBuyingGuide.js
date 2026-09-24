import { buildFaqJsonLd } from "@/lib/categoryGuides";

/** Invisible FAQ schema only — the on-page buying-guide copy was removed. */
export default function CategoryBuyingGuide({ guide }) {
    if (!guide) return null;
    const faqJsonLd = buildFaqJsonLd(guide.faqs || []);
    if (!faqJsonLd) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
    );
}
