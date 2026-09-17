export const BRAND_NAME = "The Luxe Jewels";
export const BRAND_URL = "https://www.theluxejewels.in";
export const WHATSAPP_NUMBER = "919953267974";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I have a question about a product on The Luxe Jewels.")}`;
export const SUPPORT_PHONE = "+91 9953267974";
export const SUPPORT_EMAIL = "supporttheluxejewels@gmail.com";
export const INSTAGRAM_URL =
    "https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D";
export const INSTAGRAM_HANDLE = "@theluxejewels.in_";
export const TWITTER_HANDLE = "@theluxejewels.in_";
export const BUSINESS_HOURS = "Mon – Sat, 10:00 AM – 7:00 PM IST";

/** Service area called out for local brand queries (e.g. “luxe jewels noida”). */
export const SERVICE_AREA_LABEL =
    "Serving Noida, Greater Noida, Ghaziabad & Delhi NCR — shipping pan-India";

/**
 * Google Business Profile share URL (local SEO + footer / city pages / schema sameAs).
 * Override with NEXT_PUBLIC_GOOGLE_BUSINESS_URL in Vercel if the profile link changes.
 */
export const GOOGLE_BUSINESS_URL =
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ||
    "https://share.google/IfXa6x49zuhzujhzF";

/** Sitewide social proof (homepage / story) — never pair with “No reviews yet” on a PDP. */
export const TRUST_CUSTOMER_COUNT_LABEL = "10,000+ happy customers";
export const TRUST_INSTAGRAM_LABEL = `Loved on Instagram ${INSTAGRAM_HANDLE}`;

/** Business mailing / ops address for LocalBusiness schema (Noida HQ). */
export const BUSINESS_ADDRESS = {
    streetAddress: "Noida",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201301",
    addressCountry: "IN",
};

/** COD is NOT offered — prepaid only via Razorpay (see FAQs). Do not surface a COD badge. */
export const COD_AVAILABLE = false;
