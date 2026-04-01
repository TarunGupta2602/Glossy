import Link from "next/link";
import FeaturedCollections from "./components/featured-collections";

import Testimonials from "./components/testimonials";
import Newsletter from "./components/newsletter";
import HeroSlider from "./components/HeroSlider";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">The luxe jewels | Premium Anti-Tarnish & Fine Jewelry India</h1>

      {/* Dynamic Hero Section */}
      <HeroSlider />

      {/* Featured Collections Section */}
      <FeaturedCollections />

      {/* SEO Content Section - Visually Hidden */}
      <section className="sr-only">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">The luxe jewels: Defining Premium Anti-Tarnish & Fine Jewelry</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Welcome to <Link href="/" className="text-gray-900 font-bold border-b border-gray-900">The luxe jewels</Link>,
          India's premier destination for **anti-tarnish jewelry**, waterproof accessories, and handcrafted fine jewelry.
          We specialize in <Link href="/earrings" className="hover:text-[#E91E63] transition-colors font-medium mx-1">18k gold plated earrings</Link>,
          <Link href="/necklaces" className="hover:text-[#E91E63] transition-colors font-medium mx-1">designer fine necklaces</Link>,
          and timeless everyday essentials. Our commitment to sustainable luxury ensures every piece is as ethically sourced as it is stunning.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-black uppercase tracking-widest text-[#E91E63]">
          <Link href="/shop" className="hover:underline">Shop All Collection</Link>
          <Link href="/earrings" className="hover:underline">Anti-Tarnish Earrings</Link>
          <Link href="/necklaces" className="hover:underline">Gold Plated Necklaces</Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  );
}