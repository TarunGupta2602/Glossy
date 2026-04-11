import Link from "next/link";
import FeaturedCollections from "./components/featured-collections";
import Testimonials from "./components/testimonials";
import Newsletter from "./components/newsletter";
import HeroSlider from "./components/HeroSlider";
import ProductRow from "./components/ProductRow";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export const revalidate = 60; // Revalidate the page every 60 seconds (ISR)

export default async function Home() {
  const supabase = getServiceClient();

  // 1. Fetch Categories to get IDs
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug");

  const earringsCat = categories?.find(c =>
    c.slug === '-statement-piecess' ||
    c.name?.toLowerCase().includes('ear')
  );
  const necklacesCat = categories?.find(c =>
    c.slug === 'the-necklace-edit' ||
    c.name?.toLowerCase().includes('neck')
  );
  const braceletsCat = categories?.find(c =>
    c.name?.toLowerCase().includes('bracelet')
  );

  // 2. Fetch Products for each category
  const [earringsRes, necklacesRes, braceletsRes] = await Promise.all([
    earringsCat ? supabase
      .from("products")
      .select("*, categories(name, id, slug)")
      .eq("category_id", earringsCat.id)
      .order("created_at", { ascending: false })
      .limit(10) : Promise.resolve({ data: [] }),
    necklacesCat ? supabase
      .from("products")
      .select("*, categories(name, id, slug)")
      .eq("category_id", necklacesCat.id)
      .order("created_at", { ascending: false })
      .limit(10) : Promise.resolve({ data: [] }),
    braceletsCat ? supabase
      .from("products")
      .select("*, categories(name, id, slug)")
      .eq("category_id", braceletsCat.id)
      .order("created_at", { ascending: false })
      .limit(10) : Promise.resolve({ data: [] })
  ]);

  const earrings = earringsRes.data || [];
  const necklaces = necklacesRes.data || [];
  const bracelets = braceletsRes.data || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">The luxe jewels | Premium Anti-Tarnish & Fine Jewelry India</h1>

      {/* Dynamic Hero Section */}
      <HeroSlider />

      {/* Trending Earrings Row */}
      <ProductRow
        title="Earrings Collection"
        products={earrings}
        viewAllLink="/earrings"
      />

      {/* Featured Necklaces Row */}
      <ProductRow
        title="Necklaces Collection"
        products={necklaces}
        viewAllLink="/necklaces"
      />

      {/* Bracelets Row */}
      <ProductRow
        title="Artisan Cuffs & Bracelets"
        products={bracelets}
        viewAllLink="/shop/glimmer-bracelet"
      />

      {/* Featured Collections Section */}
      <FeaturedCollections />

      {/* SEO Content Section - Visually Hidden */}
      <section className="sr-only">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">The luxe jewels: Defining Premium Anti-Tarnish & Fine Jewelry</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Welcome to <Link href="/" className="text-gray-900 font-bold border-b border-gray-900">The luxe jewels</Link>,
          India&apos;s premier destination for **anti-tarnish jewelry**, waterproof accessories, and handcrafted fine jewelry.
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