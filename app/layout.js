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
  keywords: ["luxury jewelry", "fine jewelry", "sustainable jewelry", "modern jewelry", "The luxe jewels", "jewelry India"],
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
        url: "/logo.png", // Recommended: Use a high-quality OG image
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
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
