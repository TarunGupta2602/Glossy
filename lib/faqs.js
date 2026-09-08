import { PROMO_LABEL, PROMO_DETAIL, FREE_SHIPPING_THRESHOLD } from "@/lib/promo";
import { SUPPORT_EMAIL, SUPPORT_PHONE, SERVICE_AREA_LABEL } from "@/lib/constants";

export function buildFaqJsonLd(faqs = []) {
    if (!faqs.length) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

/** Homepage — high-intent product + policy queries shoppers actually search */
export const HOME_FAQS = [
    {
        question: "What is anti-tarnish jewellery, and is it good for daily wear in India?",
        answer:
            "Anti-tarnish jewellery is finished to resist dulling from humidity, sweat, and everyday pollution — common in Indian weather. The Luxe Jewels pieces use 18k gold plating with an anti-tarnish protective layer, so they are made for office, college, travel, and festive weeks without constant polishing.",
    },
    {
        question: "Is The Luxe Jewels jewellery waterproof?",
        answer:
            "Yes. Our pieces are designed to be waterproof for real daily life — including light rain, hand washes, and humid days. For longest shine, avoid harsh chemicals, bleach, and abrasive cleaners, and wipe pieces dry after heavy workouts or swimming in chlorinated water.",
    },
    {
        question: `How does ${PROMO_LABEL} work?`,
        answer: PROMO_DETAIL,
    },
    {
        question: "Do you offer free shipping across India?",
        answer: `Yes. Prepaid orders over ₹${FREE_SHIPPING_THRESHOLD} ship free pan-India. Orders are typically processed in 1–2 business days and delivered in about 3–7 business days, depending on your city. ${SERVICE_AREA_LABEL}.`,
    },
    {
        question: "Do you accept cash on delivery (COD)?",
        answer:
            "No. We accept secure prepaid payments only — UPI, cards, and net banking via Razorpay. Prepaid checkout helps us process and ship orders faster.",
    },
    {
        question: "What is your return and exchange policy?",
        answer:
            "We accept returns within 10 days of delivery if the item is unused and in its original packaging. Start a return from your order details or message support. Once we receive and inspect the piece, refunds usually take 5–7 business days to the original payment method.",
    },
    {
        question: "Is your jewellery hypoallergenic and safe for sensitive skin?",
        answer:
            "Yes. Our jewellery is nickel-free and lead-free with skin-safe finishes, designed for comfortable daily wear — including sensitive ears and necks. If you have a known metal allergy, start with lightweight studs or fine chains and contact us if you need help choosing.",
    },
];

/** Full /faqs page — broader coverage for ranking support queries */
export const SITE_FAQS = [
    ...HOME_FAQS,
    {
        question: "How should I care for 18k gold plated jewellery?",
        answer:
            "Store pieces dry in a pouch or box when not wearing them. Wipe with a soft cloth after long days. Avoid perfume, hairspray, and harsh cleaners sprayed directly onto the metal. Gentle care keeps the plating bright longer.",
    },
    {
        question: "How long does delivery take to Noida, Delhi NCR, and other cities?",
        answer:
            "Most Noida, Greater Noida, Ghaziabad, and Delhi NCR orders arrive within a few business days after dispatch. Across India, expect roughly 3–7 business days once shipped. You will receive tracking by email or SMS after dispatch.",
    },
    {
        question: "Can I cancel or change my order after placing it?",
        answer: `If your order has not been processed or packed yet, message us on WhatsApp or email ${SUPPORT_EMAIL} with your order ID. Once an order is shipped, cancellations are no longer possible — you can use our 10-day return window after delivery if needed.`,
    },
    {
        question: "How do I track my order?",
        answer:
            "After your order ships, we send a tracking link by email or SMS. You can also check status from your account profile. If tracking has not updated for 48 hours after the ship notice, contact support with your order ID.",
    },
    {
        question: "Are your pieces real gold?",
        answer:
            "Our jewellery is fashion jewellery finished in 18k gold plating — not solid gold or hallmarked gold jewellery. You get a luxe gold look at an accessible price, with anti-tarnish and waterproof finishing made for everyday Indian wear.",
    },
    {
        question: "How can I contact The Luxe Jewels support?",
        answer: `Write to ${SUPPORT_EMAIL}, call ${SUPPORT_PHONE}, or message us on WhatsApp. Support hours are typically Mon–Sat, 10:00 AM – 7:00 PM IST.`,
    },
];

export const SHIPPING_FAQS = [
    {
        question: "How long does shipping take within India?",
        answer:
            "Orders are usually processed within 1–2 business days. Standard delivery takes about 3–7 business days after dispatch. Express options may be available in select cities (1–3 business days where offered).",
    },
    {
        question: `When do I get free shipping?`,
        answer: `Free shipping applies on prepaid orders over ₹${FREE_SHIPPING_THRESHOLD} across India. Below that threshold, a small shipping fee may apply at checkout.`,
    },
    {
        question: "How do returns work?",
        answer:
            "Request a return within 10 days of delivery for unused items in original packaging. After we receive and inspect the return, refunds are issued to the original payment method within about 5–7 business days.",
    },
    {
        question: "What if my package arrives damaged?",
        answer: `Contact us within 48 hours of delivery with your order ID and clear photos of the packaging and product. Email ${SUPPORT_EMAIL} or WhatsApp support — we’ll help with a replacement or refund as applicable.`,
    },
    {
        question: "Do you ship to Noida and Delhi NCR?",
        answer: `Yes. ${SERVICE_AREA_LABEL}. Tracking is shared once your order is dispatched.`,
    },
];

export const STORY_FAQS = [
    {
        question: "Where is The Luxe Jewels based?",
        answer: `The Luxe Jewels serves shoppers from Noida and Delhi NCR and ships pan-India. ${SERVICE_AREA_LABEL}.`,
    },
    {
        question: "What makes The Luxe Jewels different?",
        answer:
            "We focus on anti-tarnish, waterproof, hypoallergenic 18k gold plated jewellery made for everyday Indian life — not just occasions. Lightweight pieces, clear pricing, and offers like Buy 2 Get 1 Free keep everyday luxury accessible.",
    },
    {
        question: "Who is The Luxe Jewels jewellery for?",
        answer:
            "Modern women who want pieces they can live in — office, college, travel, gifting, and festive weeks — without babysitting fashion jewellery that fades after a few wears.",
    },
    {
        question: "Do you offer custom or wholesale jewellery?",
        answer: `For bulk, wholesale, or special requests, message us on WhatsApp or email ${SUPPORT_EMAIL} with what you need. We’ll guide you on availability and timelines.`,
    },
];

export const CONTACT_FAQS = [
    {
        question: "What’s the fastest way to reach support?",
        answer: `WhatsApp is usually fastest for order updates and product questions. You can also email ${SUPPORT_EMAIL} or call ${SUPPORT_PHONE} during business hours (Mon–Sat, 10:00 AM – 7:00 PM IST).`,
    },
    {
        question: "I have an order issue — what details should I share?",
        answer:
            "Share your order ID, registered email or phone, and a short description of the issue. Photos help for damaged or incorrect items so we can resolve faster.",
    },
    {
        question: "Can you help me choose a gift?",
        answer:
            "Yes. Tell us the occasion, budget, and style preference (earrings, necklace, set). You can also browse our under-₹499 and under-₹999 gift edits, then message us if you want a second opinion.",
    },
    {
        question: "Do you offer Buy 2 Get 1 Free on every order?",
        answer: `Yes. ${PROMO_DETAIL}`,
    },
];

export const GIFT_FAQS = [
    {
        question: "What jewellery gifts work best under ₹999 in India?",
        answer:
            "Lightweight anti-tarnish earrings, fine pendants, and simple bracelets make the easiest gifts — they’re wearable after Friendship Day, Raksha Bandhan, birthdays, and office celebrations, not just for the occasion.",
    },
    {
        question: "Will the jewellery tarnish after a few wears?",
        answer:
            "Our pieces are finished for anti-tarnish daily wear in Indian humidity. With basic care (soft wipe, dry storage, avoid harsh chemicals), they stay brighter longer than untreated fashion plating.",
    },
    {
        question: `Can I use ${PROMO_LABEL} on gift orders?`,
        answer: `Yes. Add any two paid pieces and receive a complimentary gift from our collection — ideal for building a small set for someone special.`,
    },
    {
        question: "Do you ship gift jewellery pan-India?",
        answer: `Yes. We ship across India, with free shipping on prepaid orders over ₹${FREE_SHIPPING_THRESHOLD}. Most deliveries arrive within 3–7 business days after dispatch.`,
    },
    {
        question: "Can gifts be returned if the size or style isn’t right?",
        answer:
            "Unused items in original packaging can be returned within 10 days of delivery. Start the return from the order or contact support — we’ll help with the next steps.",
    },
];
