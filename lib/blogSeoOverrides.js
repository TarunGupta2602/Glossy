/**
 * High-impression GSC pages with weak CTR.
 * Overrides win over DB meta_title / meta_description / faqs at render time.
 */
export const BLOG_SEO_OVERRIDES = {
    "best-jewelry-gifts-raksha-bandhan-friendship-day-2026": {
        meta_title:
            "Raksha Bandhan & Friendship Day 2026 Jewellery Gifts Under ₹999",
        meta_description:
            "Best Raksha Bandhan and Friendship Day 2026 jewellery gift ideas in India — anti-tarnish earrings, necklaces & bracelets she’ll actually wear. Shop curated picks + Buy 2 Get 1 Free.",
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
            "Is 18k gold plated jewellery real gold? Learn the meaning, durability, cost vs real gold, and when anti-tarnish plated jewellery is the smarter everyday buy in India.",
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
        meta_title: "15 Best Daily Wear Bracelets in India 2026 | Anti-Tarnish Picks",
        meta_description:
            "The 15 best bracelets for daily wear in India (2026) — anti-tarnish gold & fashion styles that stay comfortable from office to evening. Shop waterproof everyday picks.",
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
    "25-perfect-gift-ideas-for-girlfriend-under-299-that-shell-actually-love": {
        meta_title: "25 Girlfriend Gift Ideas Under ₹299 She’ll Actually Use (2026)",
        meta_description:
            "Affordable girlfriend gift ideas under ₹299 she’ll actually love — cute, wearable jewellery picks plus styling tips. Perfect for birthdays, Friendship Day, and surprise gifting in India.",
        faqs: [
            {
                question: "What can I gift my girlfriend under ₹299?",
                answer:
                    "Small anti-tarnish earrings, delicate charms, and lightweight everyday pieces make thoughtful gifts under ₹299 — especially when they’re wearable after the occasion.",
            },
            {
                question: "Are cheap jewellery gifts worth buying?",
                answer:
                    "Yes if the finish is anti-tarnish and waterproof. Prioritise comfort and daily wearability over oversized statement pieces for budget gifting.",
            },
        ],
    },
    "10-jewellery-trends-taking-over-instagram-pinterest-in-2026": {
        meta_title: "10 Jewellery Trends on Instagram & Pinterest 2026 (Shop the Look)",
        meta_description:
            "The jewellery trends taking over Instagram and Pinterest in 2026 — and how to shop the look with anti-tarnish, waterproof pieces made for everyday India.",
        faqs: [
            {
                question: "What jewellery trends are popular in 2026?",
                answer:
                    "Layered necklaces, sculptural hoops, cherry and floral charms, and everyday anti-tarnish gold-tone pieces are among the looks dominating Instagram and Pinterest in 2026.",
            },
            {
                question: "Where can I shop 2026 jewellery trends in India?",
                answer:
                    "The Luxe Jewels offers trend-led anti-tarnish earrings and necklaces designed for Indian weather, with pan-India shipping and Buy 2 Get 1 Free.",
            },
        ],
    },
    "jewellery-gifts-under-999-india": {
        meta_title: "Best Jewellery Gifts Under ₹999 India 2026 | Anti-Tarnish Picks",
        meta_description:
            "Looking for jewellery gifts under ₹999 in India? Discover anti-tarnish earrings, necklaces, and Buy 2 Get 1 Free gift sets she’ll actually wear.",
    },
    "office-wear-jewellery-india-anti-tarnish": {
        meta_title: "Office Wear Jewellery India | Subtle Anti-Tarnish Everyday Picks",
        meta_description:
            "Build an office jewellery edit for Indian workdays: hypoallergenic studs, fine necklaces, and waterproof anti-tarnish pieces that stay polished from commute to meetings.",
    },
    "monsoon-jewellery-care-anti-tarnish-india": {
        meta_title: "Monsoon Jewellery Care India | Keep Anti-Tarnish Pieces Bright",
        meta_description:
            "Learn monsoon jewellery care for Indian weather: how to protect anti-tarnish gold plated earrings and necklaces from humidity, sweat, and rain without complicated routines.",
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
