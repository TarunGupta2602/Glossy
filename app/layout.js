import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OverlayProvider } from "./context/OverlayContext";
import { ToastProvider } from "./context/ToastContext";
import LayoutWrapper from "./components/LayoutWrapper";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MetaPixel from "./components/MetaPixel";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

import { BRAND_NAME, BRAND_URL, BRAND_ALTERNATE_NAMES, BRAND_SLOGAN, SUPPORT_PHONE, SUPPORT_EMAIL, INSTAGRAM_URL, INSTAGRAM_PROFILE_URL, BUSINESS_ADDRESS } from "@/lib/constants";

function buildSiteVerification() {
    const verification = {
        google: "UtTE7g1RfX5oNGZhiC88Lxr-Pcbh5DuxIVljwgxC4YY",
    };

    const other = {};
    if (process.env.BING_SITE_VERIFICATION) {
        other["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;
    }
    if (process.env.PINTEREST_SITE_VERIFICATION) {
        other["p:domain_verify"] = process.env.PINTEREST_SITE_VERIFICATION;
    }
    if (Object.keys(other).length > 0) {
        verification.other = other;
    }

    return verification;
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  metadataBase: new URL(BRAND_URL),
  title: {
    default: "The Luxe Jewels | Anti-Tarnish Jewellery Noida",
    template: "%s | The Luxe Jewels"
  },
  description:
    "Anti-tarnish jewellery for Noida & India — 18k gold plated earrings, necklaces & more. Buy 2 Get 1 Free + free delivery over ₹1000.",
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${BRAND_URL}/feed.xml`,
    },
  },
  openGraph: {
    title: "The Luxe Jewels | Anti-Tarnish Jewellery Noida",
    description:
      "Anti-tarnish jewellery for daily wear and gifting — Noida, Delhi NCR, and pan-India. Buy 2 Get 1 Free.",
    url: BRAND_URL,
    siteName: BRAND_NAME,
        images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Luxe Jewels — anti-tarnish jewellery logo",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "The Luxe Jewels logo",
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Luxe Jewels | Anti-Tarnish Jewellery Noida",
    description:
      "Anti-tarnish jewellery for Noida, Delhi NCR & pan-India. Buy 2 Get 1 Free.",
    images: ["/og-image.png", "/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#E91E63" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: buildSiteVerification(),
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BRAND_URL}/#organization`,
    "name": BRAND_NAME,
    "alternateName": BRAND_ALTERNATE_NAMES,
    "legalName": BRAND_NAME,
    "slogan": BRAND_SLOGAN,
    "foundingDate": "2024",
    "url": BRAND_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BRAND_URL}/logo.png`,
      "width": 512,
      "height": 512,
      "caption": "The Luxe Jewels logo",
    },
    "description": "The Luxe Jewels is an Indian online jewellery brand from Noida. Anti-tarnish, waterproof 18k gold plated fashion jewellery for everyday wear, shipped pan-India.",
    "knowsAbout": [
      "anti-tarnish jewellery",
      "waterproof jewellery",
      "18k gold plated jewellery",
      "everyday jewellery India",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SUPPORT_PHONE.replace(/\s/g, "-"),
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [INSTAGRAM_PROFILE_URL || INSTAGRAM_URL]
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": BRAND_NAME,
    "url": BRAND_URL,
    "description": "Anti-tarnish, waterproof 18k gold plated jewellery for Noida, Delhi NCR & pan-India. Buy 2 Get 1 Free + free delivery over ₹1000.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BRAND_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": { "@id": `${BRAND_URL}/#organization` }
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "JewelryStore"],
    "@id": `${BRAND_URL}/#store`,
    "name": BRAND_NAME,
    "alternateName": BRAND_ALTERNATE_NAMES,
    "brand": { "@id": `${BRAND_URL}/#organization` },
    "description": "The Luxe Jewels is an Indian online jewellery store from Noida. Shop anti-tarnish, waterproof 18k gold plated earrings, necklaces, bracelets, and rings — Buy 2 Get 1 Free, shipped pan-India.",
    "url": BRAND_URL,
    "image": `${BRAND_URL}/og-image.png`,
    "logo": `${BRAND_URL}/logo.png`,
    "telephone": SUPPORT_PHONE.replace(/\s/g, "-"),
    "email": SUPPORT_EMAIL,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_ADDRESS.streetAddress,
      "addressLocality": BUSINESS_ADDRESS.addressLocality,
      "addressRegion": BUSINESS_ADDRESS.addressRegion,
      "postalCode": BUSINESS_ADDRESS.postalCode,
      "addressCountry": BUSINESS_ADDRESS.addressCountry,
    },
    "areaServed": [
      { "@type": "City", "name": "Noida" },
      { "@type": "City", "name": "Greater Noida" },
      { "@type": "City", "name": "Ghaziabad" },
      { "@type": "AdministrativeArea", "name": "Delhi NCR" },
      { "@type": "Country", "name": "India" }
    ],
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "10:00",
      "closes": "19:00"
    },
    "sameAs": [INSTAGRAM_PROFILE_URL || INSTAGRAM_URL]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://wsrbnmovzebjxvsacgvb.supabase.co" />
        <link rel="dns-prefetch" href="https://wsrbnmovzebjxvsacgvb.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <GoogleAnalytics />
          <MetaPixel />
        </Suspense>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OverlayProvider>
                <ToastProvider>
                  <LayoutWrapper>
                    {children}
                  </LayoutWrapper>
                </ToastProvider>
              </OverlayProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
