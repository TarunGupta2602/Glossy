import Link from "next/link";
import FeaturedCollections from "./components/featured-collections";

import Testimonials from "./components/testimonials";
import Newsletter from "./components/newsletter";
import HeroSlider from "./components/HeroSlider";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">The luxe jewels | Luxury Fine Jewelry India</h1>

      {/* Dynamic Hero Section */}
      <HeroSlider />

      {/* Featured Collections Section */}
      <FeaturedCollections />

      {/* SEO Content Section / About */}
      <section className="py-24 px-6 md:px-12 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">The luxe jewels: Modern Luxury Fine Jewelry</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            Welcome to <Link href="/" className="text-gray-900 font-bold border-b border-gray-900">The luxe jewels</Link>,
            your destination for premium, handcrafted fine jewelry in India. We specialize in
            <Link href="/earrings" className="hover:text-[#E91E63] transition-colors font-medium mx-1">ethical earrings</Link>,
            <Link href="/necklaces" className="hover:text-[#E91E63] transition-colors font-medium mx-1">designer necklaces</Link>,
            and timeless accessories designed for the modern individual. Our commitment to sustainable practices
            ensures every piece is as ethical as it is elegant.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-widest text-[#E91E63]">
            <Link href="/shop" className="hover:underline">Shop All</Link>
            <Link href="/earrings" className="hover:underline">Explore Earrings</Link>
            <Link href="/necklaces" className="hover:underline">Discover Necklaces</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  );
}