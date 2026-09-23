/**
 * Starter drafts for /admin/blogs/new.
 * Publish from the admin form so you can edit SEO, cover image, and copy anytime.
 * Festive drafts stay in sync with the live static posts.
 */

import { FESTIVE_STATIC_BLOGS } from "@/lib/festiveBlogPosts";

const AUTHOR = "Priya Sharma";
const AUTHOR_BIO =
    "Priya writes The Luxe Jewels journal — practical anti-tarnish care, everyday styling, and gifting guidance for shoppers across Noida, Delhi NCR, and India.";

function festiveDraft(slug, id, label, hint) {
    const post = FESTIVE_STATIC_BLOGS.find((item) => item.slug === slug);
    if (!post) return null;
    const table = post.content_sections?.comparison_table || {};
    return {
        id,
        label,
        hint,
        title: post.title,
        slug: post.slug,
        author: post.author || AUTHOR,
        author_bio: post.author_bio || AUTHOR_BIO,
        description: post.description,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        meta_keywords: post.meta_keywords,
        content: post.content,
        why_this_matters: post.content_sections?.why_this_matters || "",
        comparison_headers: (table.headers || []).join(" | "),
        comparison_rows: (table.rows || []).map((row) => row.join(" | ")).join("\n"),
        tips_mistakes: post.content_sections?.tips_mistakes || [],
        faqs: post.faqs || [],
    };
}

const FESTIVE_TEMPLATES = [
    festiveDraft(
        "navratri-2026-9-colours-9-jewellery-pairings",
        "navratri-9-colours",
        "Navratri — 9 colours",
        "Festive pairing guide"
    ),
    festiveDraft(
        "best-jewellery-gifts-bhai-dooj-karva-chauth",
        "bhai-dooj-karva",
        "Bhai Dooj & Karva Chauth",
        "Festive gift guide"
    ),
    festiveDraft(
        "how-to-layer-necklaces-diwali-party-looks",
        "layer-necklaces-diwali",
        "Diwali necklace layering",
        "Party styling guide"
    ),
].filter(Boolean);

export const BLOG_TEMPLATES = [
    ...FESTIVE_TEMPLATES,
    {
        id: "blank-seo",
        label: "Blank SEO guide",
        hint: "Empty ranking structure",
        title: "",
        slug: "",
        author: AUTHOR,
        author_bio: AUTHOR_BIO,
        description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "anti tarnish jewellery, jewellery tips india",
        content: `## Why this topic matters in India

Write 2–3 short paragraphs. Name the shopper, the problem, and the wearable fix. Link a category such as [earrings](/earrings) or [necklaces](/necklaces).

## How to choose (without overthinking)

Use a short numbered list. Keep each point one sentence.

## Common mistakes

Call out 2–3 mistakes (heavy costume pieces, skipping care, last-minute shipping).

## Shop the edit

Point to [shop](/shop), [gifts under ₹499](/gifts/under-499), or a festive page like [Diwali](/festive/diwali).
`,
        why_this_matters: "",
        comparison_headers: "Option | Best for | Notes",
        comparison_rows: "",
        tips_mistakes: [
            { title: "", body: "" },
            { title: "", body: "" },
            { title: "", body: "" },
        ],
        faqs: [
            { question: "", answer: "" },
            { question: "", answer: "" },
            { question: "", answer: "" },
        ],
    },
];
