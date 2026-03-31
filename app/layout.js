import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.theluxejewels.in"),
  title: {
    default: "The luxe jewels | Modern Luxury Jewelry",
    template: "%s | The luxe jewels"
  },
  description: "Defining modern luxury through intentional design and sustainable practices in fine jewelry. Shop our exclusive collection of ethical and elegant jewelry.",
  keywords: [
    "luxury jewelry", "fine jewelry", "sustainable jewelry", "modern jewelry",
    "The luxe jewels", "jewelry India", "gold earrings", "diamond necklaces",
    "ethical luxury", "custom jewelry", "designer jewelry", "handcrafted jewelry",
    "minimalist jewelry", "premium jewelry India", "wedding jewelry"
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
    title: "The luxe jewels | Modern Luxury Jewelry",
    description: "Defining modern luxury through intentional design and sustainable practices in fine jewelry.",
    url: "https://www.theluxejewels.in",
    siteName: "The luxe jewels",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "The luxe jewels Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The luxe jewels | Modern Luxury Jewelry",
    description: "Defining modern luxury through intentional design and sustainable practices in fine jewelry.",
    images: ["/logo.png"],
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
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
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
    "logo": "https://www.theluxejewels.in/logo.png",
    "description": "Defining modern luxury through intentional design and sustainable practices in fine jewelry.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service"
    },
    "sameAs": [
      // Add social links if available
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              {children}
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
