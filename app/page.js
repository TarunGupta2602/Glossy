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

  // 2. Fetch Products for all categories
  const categoryProducts = await Promise.all(
    (categories || []).map(async (cat) => {
      const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", cat.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return { ...cat, products: products || [] };
    })
  );

  // Filter out categories with no products and apply custom sorting
  const activeCategories = categoryProducts
    .filter(cat => cat.products.length > 0)
    .sort((a, b) => {
      // Custom order: Sparkle Jewelry Duo (Second to last), Uniqueness (Last)
      const aSlug = a.slug?.toLowerCase();
      const bSlug = b.slug?.toLowerCase();

      const order = {
        'the-necklace-edit': -1,
        'sparkle-jewelry-duo': 1,
        'uniqueness': 2
      };

      const aOrder = order[aSlug] || 0;
      const bOrder = order[bSlug] || 0;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      // Default alphabetical sort for others
      return a.name.localeCompare(b.name);
    });

  return (
    <main className="min-h-screen bg-white">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">The luxe jewels | Premium Anti-Tarnish & Fine Jewelry India</h1>

      {/* Dynamic Hero Section */}
      <HeroSlider />

      {/* Best Sellers Section - Curated social proof */}
      <section className="bg-gray-50/50 py-0">
        {(() => {
          // Find products that match our "Best Seller" badge logic to show in this row
          const bestSellerProducts = activeCategories
            .flatMap(cat => cat.products)
            .filter(p => (p.is_bestseller || (p.id && ['a', 'b', '1', '2', '3'].includes(p.id[0].toLowerCase()))))
            .slice(0, 8);

          if (bestSellerProducts.length > 0) {
            return (
              <ProductRow
                title="Best Sellers"
                products={bestSellerProducts}
                viewAllLink="/shop"
              />
            );
          }
          return null;
        })()}
      </section>

      {/* Dynamic Product Rows for All Sections */}
      {activeCategories.map((cat) => (
        <ProductRow
          key={cat.id}
          title={cat.name}
          products={cat.products}
          viewAllLink={`/shop/${cat.slug}`}
        />
      ))}

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