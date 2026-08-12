import { PROMO_LABEL } from "@/lib/promo";

export const EARRINGS_GUIDE = {
    title: "How to buy anti-tarnish earrings in India",
    intro:
        "The right everyday earrings should survive humidity, workouts, and festive weeks without turning dull. Use this short guide before you add to bag.",
    sections: [
        {
            heading: "Pick by lifestyle",
            body: "Studs and small hoops are best for office and college. Medium hoops and drops work for evenings and festive looks. If you want one pair for everything, start with lightweight waterproof hoops.",
        },
        {
            heading: "What “anti-tarnish” and “waterproof” mean",
            body: "Quality 18k gold plated pieces with anti-tarnish finishing are built for Indian weather — sweat, rain, and daily wear. You still shouldn’t soak jewellery in bleach or harsh cleaners, but you shouldn’t need to babysit it either.",
        },
        {
            heading: "Skin comfort & hypoallergenic finishes",
            body: "If your ears react easily, choose hypoallergenic plated finishes and secure backs. Lightweight builds matter more than oversized statement pieces for all-day wear.",
        },
        {
            heading: "Bundle smarter with Buy 2 Get 1",
            body: `Pair earrings with a necklace or bracelet under our ${PROMO_LABEL} offer — mix and match across the catalogue and unlock a free gift for every 2 paid items.`,
        },
    ],
    faqs: [
        {
            question: "Are anti-tarnish earrings good for daily wear in India?",
            answer:
                "Yes. Anti-tarnish, waterproof 18k gold plated earrings from The Luxe Jewels are designed for everyday Indian humidity, office wear, and light festive use without constant polishing.",
        },
        {
            question: "Will gold plated earrings fade quickly?",
            answer:
                "Cheap plating can fade. Our pieces use anti-tarnish finishing meant for daily wear. Avoid abrasive cleaners and store them dry when you’re not wearing them.",
        },
        {
            question: "Do you offer Buy 2 Get 1 Free on earrings?",
            answer: `Yes. ${PROMO_LABEL} applies across the store — buy any 2 paid items and unlock a free gift (the cheapest eligible product not already in your cart).`,
        },
        {
            question: "Do you ship earrings across India?",
            answer:
                "Yes. We ship pan-India, with free delivery on prepaid orders over ₹1000. We also serve shoppers in Noida, Greater Noida, Ghaziabad, and Delhi NCR.",
        },
    ],
    links: [
        { href: "/necklaces", label: "Shop necklaces" },
        { href: "/gifts/under-999", label: "Gifts under ₹999" },
        { href: "/shop?sort=popular", label: "Bestsellers" },
        { href: "/blog", label: "Jewellery guides" },
    ],
};

export const NECKLACES_GUIDE = {
    title: "How to choose a daily-wear gold plated necklace",
    intro:
        "A good everyday necklace should layer easily, sit comfortably on kurtas and western wear, and stay bright through Indian weather. Here’s how to choose.",
    sections: [
        {
            heading: "Chain vs pendant",
            body: "Delicate pendants are ideal gifts and office looks. Satellite, paperclip, and fine chains are better for stacking. Statement charms work when you want one hero piece for evenings.",
        },
        {
            heading: "Length & layering",
            body: "Start with a 16–18 inch everyday length, then add a slightly longer chain for depth. Keep metals matching if you’re stacking — our 18k gold plated edit is built for that.",
        },
        {
            heading: "Anti-tarnish for Indian climate",
            body: "Humidity and sweat are tough on fashion jewellery. Waterproof anti-tarnish plating is the practical choice for daily wear if you want lustre without solid-gold prices.",
        },
        {
            heading: "Complete the set",
            body: `Match your necklace with studs or hoops, then use ${PROMO_LABEL} to unlock a free gift when you buy two paid pieces.`,
        },
    ],
    faqs: [
        {
            question: "Which necklaces are best for daily wear in India?",
            answer:
                "Lightweight anti-tarnish pendants and fine chains work best for daily Indian wear — they’re comfortable with ethnic and western outfits and handle humidity better than untreated fashion plating.",
        },
        {
            question: "Is 18k gold plated jewellery good for gifting?",
            answer:
                "Yes. It gives a luxe look at an accessible price, especially for Raksha Bandhan, Friendship Day, birthdays, and office gifting. Pair with our under-₹999 gift edit for easy budgets.",
        },
        {
            question: "Can I wear these necklaces in the rain or while commuting?",
            answer:
                "Our waterproof anti-tarnish pieces are made for real daily life. Still avoid harsh chemicals, and wipe pieces dry after heavy rain or workouts.",
        },
        {
            question: "Do necklaces qualify for Buy 2 Get 1 Free?",
            answer: `Yes. ${PROMO_LABEL} works across earrings, necklaces, bracelets, and more — unlock one free gift for every two paid items.`,
        },
    ],
    links: [
        { href: "/earrings", label: "Shop earrings" },
        { href: "/gifts/under-499", label: "Gifts under ₹499" },
        { href: "/shop?sort=newest", label: "New arrivals" },
        { href: "/blog", label: "Styling guides" },
    ],
};

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
