/**
 * High-impression GSC pages with weak CTR.
 * Overrides win over DB meta_title / meta_description / faqs / H1 at render time.
 *
 * Title tip: layout template appends " | The Luxe Jewels" — keep meta_title ~45–55 chars.
 * Match exact GSC query language (meaning, daily wear, Friendship Day, Noida, etc.).
 */
export const BLOG_SEO_OVERRIDES = {
    "best-jewelry-gifts-raksha-bandhan-friendship-day-2026": {
        // GSC: friendship/rakhi gift intent — lead with occasion + under ₹999
        meta_title: "Rakhi & Friendship Day Gifts Under ₹999 (2026)",
        meta_description:
            "Friendship Day and Raksha Bandhan 2026 jewellery gifts under ₹999 — anti-tarnish earrings, necklaces & bracelets. Buy 2 Get 1 Free.",
        h1: "Rakhi & Friendship Day 2026 Jewellery Gifts Under ₹999",
        faqs: [
            {
                question: "What are the best Friendship Day and Raksha Bandhan 2026 gifts?",
                answer:
                    "Anti-tarnish earrings, delicate pendants, and everyday bracelets make thoughtful Friendship Day and Raksha Bandhan 2026 gifts — wearable, waterproof, and easy to style with festive outfits.",
            },
            {
                question: "Can I gift jewellery under ₹999 for Raksha Bandhan 2026?",
                answer:
                    "Yes. The Luxe Jewels curates anti-tarnish pieces under ₹999 that work for Friendship Day and Raksha Bandhan, with pan-India shipping.",
            },
            {
                question: "Is gold-plated jewellery good for festive gifting?",
                answer:
                    "18k gold plated anti-tarnish jewellery is ideal for festive gifting when you want a luxe look without solid-gold prices — and she can wear it after the festival too.",
            },
        ],
    },
    "18k-gold-plated-vs-real-gold-jewelry": {
        // GSC: "18k gold plated means" (21+ impr, pos ~8, 0 clicks)
        meta_title: "18k Gold Plated Means? Real Gold or Not",
        meta_description:
            "What 18k gold plated means — real gold layer vs solid gold, value, tarnish risk, and when plated jewellery is worth buying in India.",
        h1: "What Does 18k Gold Plated Mean? Real Gold or Not",
        faqs: [
            {
                question: "What does 18k gold plated mean?",
                answer:
                    "It means the piece is coated with 18-karat gold (about 75% pure gold alloy) over a base metal. The plating gives the gold colour; thickness and anti-tarnish finish decide how long it lasts.",
            },
            {
                question: "Is 18k gold plated jewellery real gold?",
                answer:
                    "It has a real gold layer on the surface, but it is not solid / hallmarked gold throughout. Think of it as fashion jewellery with real gold plating — not an investment gold purchase.",
            },
            {
                question: "Is 18k gold plated better than real gold for everyday wear?",
                answer:
                    "For everyday fashion jewellery, quality anti-tarnish 18k plating gives a similar look at a fraction of solid-gold cost — ideal if you want variety without hallmarked gold prices.",
            },
            {
                question: "Does 18k gold plated jewellery tarnish?",
                answer:
                    "Cheap plating can fade. Anti-tarnish, waterproof plated jewellery is designed to stay brighter longer in Indian humidity with normal daily wear.",
            },
        ],
    },
    "15-best-bracelets-for-daily-wear-in-india-2026-gold-silver-fashion": {
        // GSC: "top trendy bracelet cuffs 2026 in india" + daily wear
        meta_title: "Trendy Bracelet Cuffs 2026 | Daily Wear",
        meta_description:
            "Trendy bracelet cuffs and daily wear bracelets for women in India 2026 — lightweight anti-tarnish cuffs, chains & bangles.",
        h1: "Trendy Bracelet Cuffs & Daily Wear Bracelets India 2026",
        faqs: [
            {
                question: "What are the best affordable bracelet cuffs for everyday wear in India?",
                answer:
                    "Look for lightweight anti-tarnish cuffs and slim chain bracelets that stay comfortable in humidity and pair with both ethnic and western outfits.",
            },
            {
                question: "Which bracelets are best for daily wear in India?",
                answer:
                    "Lightweight anti-tarnish chain bracelets, slim bangles, and minimal cuffs handle humidity better and work from office to evening.",
            },
            {
                question: "What is the best daily wear bracelet for women?",
                answer:
                    "Look for secure clasps, skin-safe anti-tarnish finish, and a comfortable weight you can wear all day without removing it.",
            },
            {
                question: "Are gold plated bracelets good for everyday use?",
                answer:
                    "Yes — if they are anti-tarnish and waterproof. Avoid thick, heavy cuffs for all-day wear; choose fine chains and soft finishes instead.",
            },
        ],
    },
    "25-perfect-gift-ideas-for-girlfriend-under-299-that-shell-actually-love": {
        // GSC: "best budget gift for girlfriend" + under 299 (750 impr, weak CTR)
        meta_title: "Best Budget Girlfriend Gifts Under ₹299",
        meta_description:
            "Best budget gifts for girlfriend under ₹299 — cute anti-tarnish earrings & mini jewellery for birthdays and surprise gifting in India.",
        h1: "Best Budget Girlfriend Gifts Under ₹299 She’ll Actually Wear",
        faqs: [
            {
                question: "What is the best budget gift for girlfriend under ₹300?",
                answer:
                    "Small anti-tarnish earrings, delicate charms, and lightweight everyday jewellery make thoughtful budget gifts under ₹300 — especially when they’re wearable after the occasion.",
            },
            {
                question: "What is the best gift for girlfriend under ₹299?",
                answer:
                    "Under ₹299, prioritise cute studs, mini pendants, and soft everyday pieces with an anti-tarnish finish so the gift lasts beyond one outing.",
            },
            {
                question: "Are cheap jewellery gifts worth buying?",
                answer:
                    "Yes if the finish is anti-tarnish and waterproof. Prioritise comfort and daily wearability over oversized statement pieces for budget gifting.",
            },
        ],
    },
    "10-jewellery-trends-taking-over-instagram-pinterest-in-2026": {
        // GSC: 203 impr · 0% CTR · pos ~7.4 — CTR-focused rewrite
        meta_title: "2026 Jewellery Trends India — Shopable Looks",
        meta_description:
            "2026 jewellery trends in India you can actually shop — layered necklaces, sculptural hoops & Pinterest charms in anti-tarnish finishes. Pan-India delivery.",
        h1: "2026 Jewellery Trends in India: Looks You Can Shop",
        faqs: [
            {
                question: "What jewellery trends are popular in 2026?",
                answer:
                    "Layered necklaces, sculptural hoops, cherry and floral charms, and everyday anti-tarnish gold-tone pieces are among the looks dominating Instagram and Pinterest in 2026.",
            },
            {
                question: "What are the Pinterest jewellery trends 2026?",
                answer:
                    "Pinterest jewellery trends 2026 lean into layered gold tones, statement hoops, and charm details — best bought in anti-tarnish finishes for Indian weather.",
            },
            {
                question: "Where can I shop 2026 jewellery trends in India?",
                answer:
                    "The Luxe Jewels offers trend-led anti-tarnish earrings and necklaces made for Indian weather, with pan-India shipping and Buy 2 Get 1 Free.",
            },
        ],
    },
    "anti-tarnish-jewelry-guide-india-2026": {
        meta_title: "Anti-Tarnish Jewellery Guide India 2026",
        meta_description:
            "What anti-tarnish means for jewellery in India — how it works, who it’s for, and how to shop waterproof everyday pieces.",
        h1: "Anti-Tarnish Jewellery Guide for India (2026)",
        faqs: [
            {
                question: "What does anti tarnish mean?",
                answer:
                    "Anti-tarnish jewellery is finished to resist darkening and dulling from humidity, sweat, and pollution — so pieces stay brighter longer in Indian weather with normal daily wear.",
            },
            {
                question: "Is anti-tarnish jewellery good for everyday wear?",
                answer:
                    "Yes. It’s designed for daily use when you don’t want to remove earrings or necklaces for rain, gym-to-office days, or humid summers.",
            },
        ],
    },
    "real-gold-vs-anti-tarnish-artificial-jewellery-whats-actually-worth-buying-in-2026": {
        meta_title: "Real Gold vs Anti-Tarnish Jewellery",
        meta_description:
            "Real gold vs anti-tarnish jewellery in 2026 — when to buy hallmarked gold, when plated fashion wins for daily wear in India.",
        h1: "Real Gold vs Anti-Tarnish Jewellery: What’s Worth Buying?",
        faqs: [
            {
                question: "Is anti-tarnish jewellery better than real gold for daily wear?",
                answer:
                    "For rotating everyday looks, quality anti-tarnish jewellery is often the smarter spend. Keep solid gold for heirloom or investment pieces.",
            },
            {
                question: "Does anti-tarnish jewellery look like real gold?",
                answer:
                    "Good 18k gold plated anti-tarnish pieces can look very close to gold in everyday light — especially studs, chains, and minimal pendants.",
            },
        ],
    },
    "jewellery-gifts-under-999-india": {
        meta_title: "Jewellery Gifts Under ₹999 in India",
        meta_description:
            "Jewellery gifts under ₹999 in India — anti-tarnish earrings, necklaces, and Buy 2 Get 1 Free sets she’ll wear.",
        h1: "Best Jewellery Gifts Under ₹999 in India",
    },
    "office-wear-jewellery-india-anti-tarnish": {
        meta_title: "Office Wear Jewellery for Everyday India",
        meta_description:
            "Office wear jewellery for Indian workdays: hypoallergenic studs, fine necklaces, and waterproof anti-tarnish pieces.",
        h1: "Office Wear Jewellery for Everyday India",
    },
    "monsoon-jewellery-care-anti-tarnish-india": {
        meta_title: "Monsoon Jewellery Care | Anti-Tarnish Tips",
        meta_description:
            "Monsoon jewellery care for Indian weather — protect anti-tarnish gold plated earrings and necklaces from humidity and rain.",
        h1: "Monsoon Jewellery Care for Anti-Tarnish Pieces",
    },
    "best-anti-tarnish-jewelry-gifts-2026": {
        meta_title: "Best Anti-Tarnish Jewellery Gifts 2026",
        meta_description:
            "Anti-tarnish jewellery gifts for 2026 — waterproof earrings and necklaces that look expensive and suit Indian weather.",
        h1: "Best Anti-Tarnish Jewellery Gifts for 2026",
    },
    "how-to-clean-gold-plated-jewellery-at-home-without-ruining-it": {
        meta_title: "How to Clean Gold Plated Jewellery at Home",
        meta_description:
            "Clean gold plated jewellery at home safely — gentle steps for 18k plated earrings and necklaces, plus what to avoid.",
        h1: "How to Clean Gold Plated Jewellery at Home (Without Ruining It)",
    },
};

export function getBlogSeoOverride(slug) {
    if (!slug) return null;
    return BLOG_SEO_OVERRIDES[slug] || null;
}

export function applyBlogSeoOverride(blog, slug) {
    if (!blog) return blog;
    const override = getBlogSeoOverride(slug);
    if (!override) return blog;
    return {
        ...blog,
        title: override.h1 || blog.title,
        meta_title: override.meta_title || blog.meta_title,
        meta_description: override.meta_description || blog.meta_description,
        faqs:
            override.faqs && override.faqs.length > 0
                ? override.faqs
                : blog.faqs,
    };
}
