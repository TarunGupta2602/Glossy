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


      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  );
}