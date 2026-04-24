import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import LayoutWrapper from "./components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.theluxejewels.in"),
  title: {
    default: "The luxe jewels | Premium Anti-Tarnish & Waterproof Jewelry India",
    template: "%s | The luxe jewels"
  },
  description: "Shop The luxe jewels for premium anti-tarnish, waterproof, and hypoallergenic jewelry in India. Discover handcrafted 18k gold plated necklaces, earrings, and signature rings. Free delivery on orders over ₹1000.",
  keywords: [
    "anti tarnish jewelry online india",
    "waterproof jewelry india",
    "buy 18k gold plated jewelry",
    "hypoallergenic jewelry for sensitive skin",
    "premium artificial jewelry india",
    "daily wear jewelry for women",
    "The luxe jewels india",
    "gold plated earrings online",
    "minimalist jewelry brand india",
    "luxury jewelry affordable price",
    "waterproof necklaces india",
    "tarnish resistant jewelry online shop",
    "signature rings for women",
    "bridal jewelry india online",
    "best jewelry box gifts india"
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
    title: "The luxe jewels | Premium Waterproof & Anti-Tarnish Jewelry",
    description: "Handcrafted, hypoallergenic, and tarnish-free jewelry designed for modern luxury. Shop the best of 18k gold plated pieces in India.",
    url: "https://www.theluxejewels.in",
    siteName: "The luxe jewels",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "The luxe jewels - Premium Jewelry Collection",
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
    title: "The luxe jewels | Modern Luxury Jewelry India",
    description: "Defining modern luxury through waterproof and anti-tarnish fine jewelry. Handcrafted with love.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The luxe jewels",
    "url": "https://www.theluxejewels.in",
    "logo": "https://www.theluxejewels.in/favicon-symbol.png",
    "description": "Defining modern luxury through intentional design and sustainable practices in fine jewelry.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
