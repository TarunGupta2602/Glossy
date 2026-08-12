/**
 * High-impression GSC pages with weak CTR.
 * Overrides win over DB meta_title / meta_description / faqs at render time.
 */
export const BLOG_SEO_OVERRIDES = {
    "best-jewelry-gifts-raksha-bandhan-friendship-day-2026": {
        meta_title:
            "Raksha Bandhan & Friendship Day 2026 Jewellery Gifts Under ₹999",
        meta_description:
            "Best Raksha Bandhan and Friendship Day 2026 jewellery gift ideas in India — anti-tarnish earrings, necklaces & bracelets she’ll actually wear. Shop curated picks from The Luxe Jewels.",
        faqs: [
            {
                question: "What jewellery is best to gift for Raksha Bandhan 2026?",
                answer:
                    "Anti-tarnish earrings, delicate pendants, and everyday bracelets make thoughtful Raksha Bandhan gifts — they’re wearable, waterproof, and easy to style with Indian festive outfits.",
            },
            {
                question: "Are Friendship Day jewellery gifts under ₹999 available?",
                answer:
                    "Yes. The Luxe Jewels curates affordable anti-tarnish pieces under ₹999 that work for Friendship Day and Raksha Bandhan gifting across India, with pan-India shipping.",
            },
            {
                question: "Is gold-plated jewellery good for festive gifting?",
                answer:
                    "18k gold plated anti-tarnish jewellery is ideal for festive gifting when you want a luxe look without the cost of solid gold — especially for daily wear after the festival.",
            },
        ],
    },
    "18k-gold-plated-vs-real-gold-jewelry": {
        meta_title: "18k Gold Plated vs Real Gold: Meaning, Value & What’s Worth Buying",
        meta_description:
            "Is 18k gold plated jewellery real gold? Learn the meaning, durability, cost difference vs real gold, and when anti-tarnish plated jewellery is the smarter buy in India.",
        faqs: [
            {
                question: "Is 18k gold plated jewellery real gold?",
                answer:
                    "18k gold plated jewellery has a real gold layer bonded over a base metal. It is not solid gold, but it does contain real gold on the surface that gives the colour and finish.",
            },
            {
                question: "What does 18k gold plated mean?",
                answer:
                    "It means the piece is coated with 18-karat gold (about 75% pure gold alloy). Quality plating thickness and anti-tarnish finishing determine how long the look lasts with daily wear.",
            },
            {
                question: "Is 18k gold plated better than real gold for everyday wear?",
                answer:
                    "For everyday fashion jewellery, quality anti-tarnish 18k gold plating offers a similar look at a fraction of the cost of solid gold — ideal if you want variety without investing in hallmarked gold.",
            },
            {
                question: "Does 18k gold plated jewellery tarnish?",
                answer:
                    "Cheap plating can fade. Anti-tarnish, waterproof plated jewellery from The Luxe Jewels is designed to stay bright longer with normal Indian climate and daily wear.",
            },
        ],
    },
    "15-best-bracelets-for-daily-wear-in-india-2026-gold-silver-fashion": {
        meta_title: "15 Best Daily Wear Bracelets in India 2026 | Gold & Fashion Picks",
        meta_description:
            "Discover the 15 best bracelets for daily wear in India (2026) — gold-tone, silver-tone, and fashion styles that stay comfortable, anti-tarnish, and office-to-evening ready.",
        faqs: [
            {
                question: "Which bracelets are best for daily wear in India?",
                answer:
                    "Lightweight anti-tarnish bangles, chain bracelets, and minimal cuffs work best for Indian daily wear — they handle humidity better and pair easily with both ethnic and western outfits.",
            },
            {
                question: "Are gold plated bracelets good for everyday use?",
                answer:
                    "Yes, if they are anti-tarnish and waterproof. Look for secure clasps, skin-safe finishes, and comfortable weight so you can wear them from office to evening without removing them.",
            },
        ],
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
        meta_title: override.meta_title || blog.meta_title,
        meta_description: override.meta_description || blog.meta_description,
        faqs:
            override.faqs && override.faqs.length > 0
                ? override.faqs
                : blog.faqs,
    };
}
