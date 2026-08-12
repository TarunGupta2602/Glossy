import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

import { BRAND_NAME, BRAND_URL, SUPPORT_PHONE, BUSINESS_ADDRESS } from "@/lib/constants";

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
    default: "The Luxe Jewels | Premium Anti-Tarnish & Waterproof Jewellery India",
    template: "%s | The Luxe Jewels"
  },
  description: "Shop The Luxe Jewels for premium anti-tarnish, waterproof, and hypoallergenic jewellery in India. Discover handcrafted 18k gold plated necklaces, earrings, and signature rings. Serving Noida, Delhi NCR & pan-India — free delivery on orders over ₹1000.",
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
    title: "The Luxe Jewels | Premium Waterproof & Anti-Tarnish Jewellery",
    description: "Handcrafted, hypoallergenic, and tarnish-free jewellery designed for modern luxury. Shop the best of 18k gold plated pieces in India.",
    url: BRAND_URL,
    siteName: BRAND_NAME,
        images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Luxe Jewels - Premium Jewellery Collection",
      },
      {
        url: "/favicon-symbol.png",
        width: 512,
        height: 512,
        alt: "The Luxe Jewels Logo",
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Luxe Jewels | Modern Luxury Jewellery India",
    description: "Defining modern luxury through waterproof and anti-tarnish fine jewellery. Handcrafted with love.",
    images: ["/og-image.png", "/favicon-symbol.png"],
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
    ],
    apple: [
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: buildSiteVerification(),
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": BRAND_NAME,
    "url": BRAND_URL,
    "logo": `${BRAND_URL}/favicon-symbol.png`,
    "description": "Defining modern luxury through intentional design and sustainable practices in fine jewellery. Serving Noida, Delhi NCR, and pan-India.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SUPPORT_PHONE.replace(/\s/g, "-"),
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D"
    ]
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": BRAND_NAME,
    "url": BRAND_URL,
    "description": "Shop premium anti-tarnish, waterproof, and hypoallergenic jewellery in India. Discover handcrafted 18k gold plated necklaces, earrings, and signature rings.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BRAND_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND_NAME,
      "url": BRAND_URL,
      "logo": `${BRAND_URL}/favicon-symbol.png`
    }
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": BRAND_NAME,
    "description": "Premium anti-tarnish and waterproof jewellery store serving Noida, Greater Noida, Delhi NCR, and pan-India. Shop 18k gold plated earrings, necklaces, and fine jewellery online.",
    "url": BRAND_URL,
    "telephone": SUPPORT_PHONE.replace(/\s/g, "-"),
    "email": "supporttheluxejewels@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_ADDRESS.streetAddress,
      "addressLocality": BUSINESS_ADDRESS.addressLocality,
      "addressRegion": BUSINESS_ADDRESS.addressRegion,
      "postalCode": BUSINESS_ADDRESS.postalCode,
      "addressCountry": BUSINESS_ADDRESS.addressCountry
    },
    "areaServed": [
      { "@type": "City", "name": "Noida" },
      { "@type": "City", "name": "Greater Noida" },
      { "@type": "City", "name": "Ghaziabad" },
      { "@type": "AdministrativeArea", "name": "Delhi NCR" },
      { "@type": "Country", "name": "India" }
    ],
    "priceRange": "₹₹",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "10:00",
      "closes": "19:00"
    }
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
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
