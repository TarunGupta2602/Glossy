import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import LayoutWrapper from "./components/LayoutWrapper";

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

export const metadata = {
  metadataBase: new URL("https://www.theluxejewels.in"),
  title: {
    default: "The luxe jewels | Premium Anti-Tarnish & Waterproof Jewellery India",
    template: "%s | The luxe jewels"
  },
  description: "Shop The luxe jewels for premium anti-tarnish, waterproof, and hypoallergenic jewellery in India. Discover handcrafted 18k gold plated necklaces, earrings, and signature rings. Free delivery on orders over ₹1000.",
  keywords: [
    "anti tarnish jewellery online india",
    "waterproof jewellery india",
    "buy 18k gold plated jewellery",
    "hypoallergenic jewellery for sensitive skin",
    "premium artificial jewellery india",
    "daily wear jewellery for women",
    "The luxe jewels india",
    "gold plated earrings online",
    "minimalist jewellery brand india",
    "luxury jewellery affordable price",
    "waterproof necklaces india",
    "tarnish resistant jewellery online shop",
    "signature rings for women",
    "bridal jewellery india online",
    "best jewellery box gifts india"
  ],
  authors: [{ name: "The luxe jewels" }],
  creator: "The luxe jewels",
  publisher: "The luxe jewels",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The luxe jewels | Premium Waterproof & Anti-Tarnish Jewellery",
    description: "Handcrafted, hypoallergenic, and tarnish-free jewellery designed for modern luxury. Shop the best of 18k gold plated pieces in India.",
    url: "https://www.theluxejewels.in",
    siteName: "The luxe jewels",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "The luxe jewels - Premium Jewellery Collection",
      },
      {
        url: "/favicon-symbol.png",
        width: 512,
        height: 512,
        alt: "The luxe jewels Logo",
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The luxe jewels | Modern Luxury Jewellery India",
    description: "Defining modern luxury through waterproof and anti-tarnish fine jewellery. Handcrafted with love.",
    images: ["/logo.png", "/favicon-symbol.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
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
      { url: "/favicon-symbol.png" },
      { url: "/favicon-symbol.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-symbol.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-symbol.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-symbol.png", sizes: "144x144", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-symbol.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon-symbol.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "UtTE7g1RfX5oNGZhiC88Lxr-Pcbh5DuxIVljwgxC4YY",
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The luxe jewels",
    "url": "https://www.theluxejewels.in",
    "logo": "https://www.theluxejewels.in/favicon-symbol.png",
    "description": "Defining modern luxury through intentional design and sustainable practices in fine jewellery.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7456096455",
      "contactType": "customer service",
      "areaServed": "IN"
    },
    "sameAs": [
      "https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D"
    ]
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "The luxe jewels",
    "url": "https://www.theluxejewels.in",
    "description": "Shop premium anti-tarnish, waterproof, and hypoallergenic jewellery in India. Discover handcrafted 18k gold plated necklaces, earrings, and signature rings.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.theluxejewels.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "The luxe jewels",
      "url": "https://www.theluxejewels.in",
      "logo": "https://www.theluxejewels.in/favicon-symbol.png"
    }
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "The luxe jewels",
    "description": "Premium anti-tarnish and waterproof jewellery store in India. Shop 18k gold plated earrings, necklaces, and fine jewellery.",
    "url": "https://www.theluxejewels.in",
    "telephone": "+91-7456096455",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹₹",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
