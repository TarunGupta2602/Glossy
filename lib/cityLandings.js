import Link from "next/link";
import { BRAND_URL, BRAND_NAME, SERVICE_AREA_LABEL, SUPPORT_PHONE, SUPPORT_EMAIL, BUSINESS_HOURS, INSTAGRAM_URL, GOOGLE_BUSINESS_URL } from "@/lib/constants";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import SiteFaqSection from "@/app/components/SiteFaqSection";
import { buildFaqJsonLd } from "@/lib/faqs";

const CITIES = {
    noida: {
        name: "Noida",
        slug: "noida",
        title: "Jewellery Shop in Noida & Sector 18",
        description:
            "Jewellery shop serving Noida & Sector 18 — anti-tarnish waterproof earrings & necklaces online, pan-India shipping + Buy 2 Get 1 Free.",
        h1: "Jewellery for Noida & Sector 18 shoppers",
        intro:
            "If you are searching for jewellery near Noida Sector 18 — or anywhere in Noida — for real daily wear (metro humidity, office days, festive evenings), The Luxe Jewels is built for that brief. We are an online anti-tarnish jewellery store serving Noida with lightweight waterproof 18k gold plated pieces, easy checkout, and pan-India delivery.",
        nearby: ["Greater Noida", "Ghaziabad", "Delhi NCR"],
    },
    "greater-noida": {
        name: "Greater Noida",
        slug: "greater-noida",
        title: "Jewellery Shop in Greater Noida",
        description:
            "Shop anti-tarnish jewellery for Greater Noida online — waterproof earrings & necklaces, Buy 2 Get 1 Free, shipping across India.",
        h1: "Jewellery for Greater Noida shoppers",
        intro:
            "Greater Noida shoppers want jewellery that survives humid evenings and long days without constant polishing. The Luxe Jewels focuses on everyday anti-tarnish pieces — studs, hoops, and fine necklaces — with easy online checkout and pan-India delivery.",
        nearby: ["Noida", "Ghaziabad", "Delhi NCR"],
    },
    ghaziabad: {
        name: "Ghaziabad",
        slug: "ghaziabad",
        title: "Jewellery Shop in Ghaziabad",
        description:
            "Anti-tarnish waterproof jewellery for Ghaziabad — 18k gold plated earrings and necklaces with Buy 2 Get 1 Free.",
        h1: "Jewellery for Ghaziabad everyday wear",
        intro:
            "From commute-friendly studs to fine pendants for festive plans, The Luxe Jewels serves Ghaziabad shoppers who want jewellery that stays bright in real Indian weather — without treating every piece like a museum exhibit.",
        nearby: ["Noida", "Greater Noida", "Delhi NCR"],
    },
    "delhi-ncr": {
        name: "Delhi NCR",
        slug: "delhi-ncr",
        title: "Jewellery Shop in Delhi NCR",
        description:
            "Online jewellery shop for Delhi NCR — anti-tarnish waterproof earrings, necklaces & gift edits with Buy 2 Get 1 Free.",
        h1: "Online jewellery shop for Delhi NCR",
        intro:
            "Delhi NCR needs jewellery that handles pollution, humidity, and packed calendars. Shop The Luxe Jewels for anti-tarnish everyday pieces designed for office, college, and festive wear — delivered pan-India.",
        nearby: ["Noida", "Greater Noida", "Ghaziabad"],
    },
};

export function getCityLanding(slug) {
    return CITIES[slug] || null;
}

export function listCityLandings() {
    return Object.values(CITIES);
}

/** Request indexing in GSC after deploy (URL Inspection → Request indexing). */
export const GSC_INDEX_PRIORITY_URLS = [
    `${BRAND_URL}/jewellery-shop/noida`,
    `${BRAND_URL}/jewellery-shop/delhi-ncr`,
    `${BRAND_URL}/jewellery-shop/greater-noida`,
    `${BRAND_URL}/jewellery-shop/ghaziabad`,
    `${BRAND_URL}/earrings`,
    `${BRAND_URL}/necklaces`,
    `${BRAND_URL}/blog/18k-gold-plated-vs-real-gold-jewelry`,
    `${BRAND_URL}/blog/15-best-bracelets-for-daily-wear-in-india-2026-gold-silver-fashion`,
    `${BRAND_URL}/blog/25-perfect-gift-ideas-for-girlfriend-under-299-that-shell-actually-love`,
    `${BRAND_URL}/blog/diwali-jewellery-gifts-under-999-india-2026`,
    `${BRAND_URL}/blog/navratri-everyday-festive-earrings-india-2026`,
    `${BRAND_URL}/gifts/under-999`,
    `${BRAND_URL}/gifts/under-499`,
];

export function CityLandingPage({ city }) {
    const faqs = [
        {
            question: `Do you deliver jewellery in ${city.name}?`,
            answer: `Yes. ${SERVICE_AREA_LABEL}. Prepaid orders over ₹1000 get free shipping.`,
        },
        {
            question: `Is The Luxe Jewels a physical jewellery shop in ${city.name}?`,
            answer:
                "We are primarily an online jewellery store serving Noida, Greater Noida, Ghaziabad, Delhi NCR, and pan-India. You can shop on theluxejewels.in and reach us on phone, WhatsApp, or Instagram for help.",
        },
        {
            question: "What jewellery is best for daily wear here?",
            answer:
                "Lightweight anti-tarnish waterproof studs, small hoops, and fine necklaces work best for humid days and office routines.",
        },
    ];

    const localBusiness = {
        "@context": "https://schema.org",
        "@type": ["JewelryStore", "OnlineStore"],
        name: BRAND_NAME,
        url: `${BRAND_URL}/jewellery-shop/${city.slug}`,
        image: `${BRAND_URL}/og-image.png`,
        telephone: SUPPORT_PHONE.replace(/\s/g, "-"),
        email: SUPPORT_EMAIL,
        areaServed: { "@type": "City", name: city.name },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "10:00",
            closes: "19:00",
        },
        sameAs: [INSTAGRAM_URL, ...(GOOGLE_BUSINESS_URL ? [GOOGLE_BUSINESS_URL] : [])],
    };

    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BRAND_URL },
            {
                "@type": "ListItem",
                position: 2,
                name: `Jewellery shop in ${city.name}`,
                item: `${BRAND_URL}/jewellery-shop/${city.slug}`,
            },
        ],
    };

    return (
        <main className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqs)) }}
            />

            <section className="bg-[#fdfbf7] border-b border-[#efeae4]">
                <div className={`${HOME_CONTAINER} py-14 md:py-20`}>
                    <p
                        className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                        style={{ color: "#b89a6a" }}
                    >
                        Local · {city.name}
                    </p>
                    <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-medium text-[#2a2724] tracking-tight max-w-3xl leading-[1.12]">
                        {city.h1}
                    </h1>
                    <p className="mt-5 text-[15px] sm:text-[16px] text-[#6b6560] leading-relaxed max-w-2xl">
                        {city.intro}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/earrings"
                            className="inline-flex h-12 items-center rounded-full bg-[#2a2724] px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#E91E63] transition-colors"
                        >
                            Shop waterproof earrings
                        </Link>
                        <Link
                            href="/necklaces"
                            className="inline-flex h-12 items-center rounded-full border border-[#2a2724]/20 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2a2724] hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                        >
                            Everyday necklaces
                        </Link>
                    </div>
                    <p className="mt-6 text-[12px] text-[#8a847c]">
                        Hours: {BUSINESS_HOURS}
                        {GOOGLE_BUSINESS_URL ? (
                            <>
                                {" · "}
                                <a
                                    href={GOOGLE_BUSINESS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-[#E91E63]"
                                >
                                    Google Business Profile
                                </a>
                            </>
                        ) : null}
                    </p>
                </div>
            </section>

            <section className={`${HOME_CONTAINER} py-12 md:py-16`}>
                <h2 className="font-playfair text-2xl md:text-3xl font-medium text-[#2a2724] mb-4">
                    Why shoppers in {city.name} choose The Luxe Jewels
                </h2>
                <ul className="space-y-3 text-[15px] text-[#6b6560] max-w-2xl">
                    <li>Anti-tarnish waterproof finishes for humid days</li>
                    <li>Lightweight everyday earrings & necklaces</li>
                    <li>Buy 2 Get 1 Free on the catalogue</li>
                    <li>Free shipping on prepaid orders over ₹1000</li>
                    <li>{SERVICE_AREA_LABEL}</li>
                </ul>

                <div className="mt-10 flex flex-wrap gap-3 text-[13px]">
                    <span className="text-[#8a847c]">Also serving:</span>
                    {city.nearby.map((n) => {
                        const slug = n.toLowerCase().replace(/\s+/g, "-");
                        const href = CITIES[slug]
                            ? `/jewellery-shop/${slug}`
                            : "/shop";
                        return (
                            <Link
                                key={n}
                                href={href}
                                className="underline text-[#2a2724] hover:text-[#E91E63]"
                            >
                                {n}
                            </Link>
                        );
                    })}
                </div>
            </section>

            <SiteFaqSection
                faqs={faqs}
                idPrefix={`city-${city.slug}-faq`}
                includeJsonLd={false}
                description={`Common questions about shopping jewellery in ${city.name}.`}
            />
        </main>
    );
}
