/**
 * High-impression GSC pages with weak CTR.
 * Overrides win over DB meta_title / meta_description / faqs / H1 at render time.
 *
 * Title tip: layout template appends " | The Luxe Jewels" — keep meta_title ~45–55 chars.
 * Match exact GSC query language (meaning, daily wear, Friendship Day, Noida, etc.).
 */
export const BLOG_SEO_OVERRIDES = {
    "diwali-jewellery-gifts-under-999-india-2026": {
        meta_title: "Diwali Jewellery Gifts Under ₹999 (2026)",
        meta_description:
            "Diwali jewellery gifts under ₹999 in India — anti-tarnish earrings & necklaces for office-to-puja. Buy 2 Get 1 Free + pan-India shipping.",
        h1: "Diwali Jewellery Gifts Under ₹999 (India 2026)",
    },
    "navratri-everyday-festive-earrings-india-2026": {
        meta_title: "Navratri Earrings for Everyday & Garba",
        meta_description:
            "Navratri earrings for India 2026 — lightweight anti-tarnish waterproof studs and hoops from office to festive nights.",
        h1: "Navratri Everyday-to-Festive Earrings (India 2026)",
    },
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
        // GSC: "18k gold plated means" (~21 impr @ pos 8) — answer in first 50 chars
        meta_title: "18k Gold Plated Means — Real or Fake?",
        meta_description:
            "18k gold plated means a real 18k gold layer on base metal — not solid gold. Real or fake, value, fade risk & when anti-tarnish plating is worth it in India.",
        h1: "18k Gold Plated Means: Is It Real Gold or Fake?",
        content_prefix: `**18k gold plated means** a real 18-karat gold alloy (about 75% gold mix) is coated over a base metal. It is **not** solid hallmarked gold. Short answer: real gold on the surface, fashion jewellery underneath.

Shop the look: [anti-tarnish waterproof earrings](/earrings) and [everyday necklaces](/necklaces). For gifting, see [jewellery under ₹999](/gifts/under-999). Related: [how long gold plated jewellery lasts in India](/blog/how-long-does-gold-plated-jewellery-last-india) and [real gold vs anti-tarnish](/blog/real-gold-vs-anti-tarnish-artificial-jewellery-whats-actually-worth-buying-in-2026).

`,
        faqs: [
            {
                question: "What does 18k gold plated mean?",
                answer:
                    "It means the piece is coated with 18-karat gold (about 75% pure gold alloy) over a base metal. The plating gives the gold colour; thickness and anti-tarnish finish decide how long it lasts.",
            },
            {
                question: "What does 18k gold plated means — is it real gold?",
                answer:
                    "Yes, the outer layer is real gold alloy. No, the whole piece is not solid / hallmarked gold. It is plated fashion jewellery with a genuine gold finish.",
            },
            {
                question: "Is 18k gold plated jewellery real gold or fake?",
                answer:
                    "It is not fake plastic colour — there is a real gold layer — but it is also not solid gold jewellery you buy as an asset. Think everyday wear, not investment.",
            },
            {
                question: "Is 18k gold plated better than real gold for everyday wear?",
                answer:
                    "For rotating daily looks in Indian weather, quality anti-tarnish 18k plating is usually the smarter spend. Keep solid gold for heirloom pieces.",
            },
            {
                question: "Does 18k gold plated jewellery tarnish?",
                answer:
                    "Cheap plating can fade. Anti-tarnish, waterproof plated jewellery is designed to stay brighter longer in Indian humidity with normal daily wear.",
            },
        ],
    },
    "15-best-bracelets-for-daily-wear-in-india-2026-gold-silver-fashion": {
        // GSC: "daily use bracelet" — exact phrase first + India + shop path
        meta_title: "Daily Use Bracelet for Women in India",
        meta_description:
            "Best daily use bracelet for women in India — lightweight anti-tarnish everyday bracelets for office & college. Waterproof 18k plated, 2026 picks.",
        h1: "Best Daily Use Bracelets for Women in India (2026)",
        content_prefix: `A **daily use bracelet** for Indian weather should be lightweight, anti-tarnish, and comfortable from commute to evening — not a heavy cuff you take off after an hour.

[Shop anti-tarnish bracelets](/bracelets) made for everyday India. Pair with [waterproof earrings](/earrings) or a [fine necklace](/necklaces). Gift-ready picks: [under ₹999](/gifts/under-999). Also read [office-wear jewellery](/blog/office-wear-jewellery-india-anti-tarnish) and [how long gold plated jewellery lasts](/blog/how-long-does-gold-plated-jewellery-last-india).

`,
        faqs: [
            {
                question: "What is the best daily use bracelet for women?",
                answer:
                    "A lightweight anti-tarnish chain bracelet or slim bangle with a secure clasp — comfortable for all-day office, college, and commute wear in Indian humidity.",
            },
            {
                question: "Which bracelets are best for daily wear in India?",
                answer:
                    "Anti-tarnish everyday bracelets (fine chains, soft bangles) handle humidity better than thick costume cuffs and work with both ethnic and western outfits.",
            },
            {
                question: "Can you wear a bracelet every day without removing it?",
                answer:
                    "Yes — if it is waterproof and anti-tarnish. Choose skin-safe finishes and avoid pieces that snag on sleeves or feel heavy after a few hours.",
            },
            {
                question: "Are gold plated bracelets good for everyday use?",
                answer:
                    "Yes when the plating is anti-tarnish and waterproof. Prefer slim daily wear styles over thick statement pieces for all-day comfort.",
            },
        ],
    },
    "25-perfect-gift-ideas-for-girlfriend-under-299-that-shell-actually-love": {
        // GSC: "affordable gift for girlfriend" / budget / cheap — lead with query + price
        meta_title: "Affordable Gift for Girlfriend Under ₹299",
        meta_description:
            "Affordable gift for girlfriend under ₹299 in India — cute anti-tarnish earrings she’ll actually wear. Step up to ₹499/₹999 + Buy 2 Get 1 Free.",
        h1: "Affordable Gift for Girlfriend Under ₹299 (She’ll Wear It)",
        content_prefix: `The best **affordable gift for girlfriend** under ₹299 is something cute she can wear after the surprise — not a one-day prop. In India that means lightweight **anti-tarnish earrings** that survive humidity.

Start here: [gifts under ₹499](/gifts/under-499) (covers the ₹299 brief) or [earrings for daily wear](/earrings). Bigger budget? [Gifts under ₹999](/gifts/under-999) with Buy 2 Get 1 Free. Related: [jewellery gifts under ₹999](/blog/jewellery-gifts-under-999-india) and [Diwali jewellery gifts](/blog/diwali-jewellery-gifts-under-999-india-2026).

`,
        content_sections: {
            why_this_matters:
                "Most “best gift for girlfriend” lists ignore budget reality. Under ₹299 you need something cute, wearable, and durable in Indian weather — not a one-day prop.\n\nAnti-tarnish studs and mini everyday pieces win because she can wear them after the surprise. If your budget stretches, step up to under ₹499 or under ₹999 for a fuller set with Buy 2 Get 1 Free.",
            comparison_table: {
                headers: ["Budget", "Best gift type", "Where to shop"],
                rows: [
                    ["Under ₹299", "Cute studs / mini everyday earrings", "Gifts under ₹499"],
                    ["Under ₹499", "Studs + small hoop pairing", "Gifts under ₹499"],
                    ["Under ₹999", "Necklace or mini set (use B2G1)", "Gifts under ₹999"],
                ],
            },
            tips_mistakes: [
                {
                    title: "Lead with wearability",
                    body: "Oversized costume pieces look loud in photos and sit unused. For under ₹299, choose lightweight anti-tarnish studs.",
                },
                {
                    title: "Use Buy 2 Get 1 Free when you can",
                    body: "Two paid pieces unlock a complimentary gift — a smarter “set” than one random item.",
                },
            ],
        },
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
                question: "What is a cheap and best gift for girlfriend in India?",
                answer:
                    "Cheap does not have to mean disposable. Anti-tarnish jewellery under ₹299 looks intentional, ships pan-India, and she can wear it after the surprise.",
            },
            {
                question: "What if my budget is ₹499 or ₹999?",
                answer:
                    "Step up to a fuller pair or a necklace set. At The Luxe Jewels, Buy 2 Get 1 Free helps you build a mini rotation under ₹999.",
            },
            {
                question: "Are cheap jewellery gifts worth buying?",
                answer:
                    "Yes if the finish is anti-tarnish and waterproof. Prioritise comfort and daily wearability over oversized statement pieces for budget gifting.",
            },
        ],
    },
    "10-jewellery-trends-taking-over-instagram-pinterest-in-2026": {
        // Rewrite away from vague IG/Pinterest — shoppable India daily wear
        meta_title: "Everyday Gold Jewellery Trends India 2026",
        meta_description:
            "Everyday gold jewellery trends in India 2026 you can shop — layered necklaces, hoops & anti-tarnish daily wear looks with pan-India delivery.",
        h1: "Everyday Gold Jewellery Trends in India (2026)",
        faqs: [
            {
                question: "What jewellery trends are popular in India in 2026?",
                answer:
                    "Layered necklaces, sculptural hoops, soft charms, and everyday anti-tarnish gold-tone pieces dominate wearable 2026 looks in India.",
            },
            {
                question: "What everyday gold jewellery should I buy in 2026?",
                answer:
                    "Start with lightweight hoops or studs plus one fine necklace in an anti-tarnish waterproof finish made for humid Indian days.",
            },
            {
                question: "Where can I shop 2026 jewellery trends in India?",
                answer:
                    "The Luxe Jewels offers trend-led anti-tarnish earrings and necklaces with pan-India shipping and Buy 2 Get 1 Free.",
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
    "how-to-choose-earrings-for-face-shape": {
        meta_title: "Earrings for Face Shape Guide",
        meta_description:
            "How to choose earrings for your face shape — oval, round, square, heart, and diamond. Anti-tarnish styles that flatter every face.",
        h1: "How to Choose Earrings for Your Face Shape",
    },
    "how-long-does-gold-plated-jewellery-last-india": {
        meta_title: "How Long Gold Plated Jewellery Lasts India",
        meta_description:
            "How long does gold plated jewellery last in India? What fades 18k plating, how to make it last, and when anti-tarnish is worth it.",
        h1: "How Long Does Gold Plated Jewellery Last in India?",
    },
    "waterproof-jewellery-meaning-can-you-shower": {
        meta_title: "Waterproof Jewellery Meaning | Can You Shower",
        meta_description:
            "Waterproof jewellery meaning for India — can you shower with it, wear it in rain, and how anti-tarnish waterproof pieces hold up.",
        h1: "Waterproof Jewellery Meaning: Can You Shower With It?",
    },
    "earrings-for-sensitive-ears-india-hypoallergenic": {
        meta_title: "Earrings for Sensitive Ears India Guide",
        meta_description:
            "Earrings for sensitive ears in India — why ears itch, hypoallergenic anti-tarnish studs, and daily-wear tips that help.",
        h1: "Earrings for Sensitive Ears in India (Itchy Ears Fix)",
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

    const nextContent =
        override.content_prefix && blog.content
            ? `${override.content_prefix}${blog.content}`
            : override.content_prefix && !blog.content
              ? override.content_prefix
              : blog.content;

    return {
        ...blog,
        title: override.h1 || blog.title,
        meta_title: override.meta_title || blog.meta_title,
        meta_description: override.meta_description || blog.meta_description,
        faqs:
            override.faqs && override.faqs.length > 0
                ? override.faqs
                : blog.faqs,
        content: nextContent,
        content_sections: override.content_sections || blog.content_sections,
    };
}
