import dynamic from "next/dynamic";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { getFeaturedReviews } from "@/lib/featuredReviews";
import { getSiteReviewStats } from "@/lib/reviewStats";
import { HOME_CONTAINER } from "@/lib/siteLayout";

const FeaturedCollections = dynamic(() => import("./components/featured-collections"), {
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

const Testimonials = dynamic(() => import("./components/testimonials"), {
  loading: () => <div className="h-[300px] bg-gray-50 animate-pulse" />
});

const Newsletter = dynamic(() => import("./components/newsletter"), {
  loading: () => <div className="h-[200px] bg-gray-50 animate-pulse" />
});

const InstagramFeed = dynamic(() => import("./components/InstagramFeed"), {
  loading: () => <div className="h-[300px] bg-gray-50 animate-pulse" />
});

const HeroSlider = dynamic(() => import("./components/HeroSlider"), {
  loading: () => <div className="h-[65vh] md:h-[85vh] bg-gray-50 animate-pulse" />
});

const ProductRow = dynamic(() => import("./components/ProductRow"), {
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

export const metadata = {
  title: "The Luxe Jewels | Premium Anti-Tarnish & Waterproof Jewellery India",
  description: "Shop anti-tarnish, waterproof, and hypoallergenic jewellery in India. Discover 18k gold plated earrings, necklaces, and everyday luxury at The Luxe Jewels.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Luxe Jewels | Premium Jewellery for Everyday Luxury",
    description: "Discover handcrafted anti-tarnish jewellery made for daily wear, gifting, and modern styling in India.",
    url: "https://www.theluxejewels.in",
    siteName: "The Luxe Jewels",
    type: "website",
  },
};

export const revalidate = 60;

export default async function Home() {
  const supabase = getServiceClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*");

  const categoryProducts = await Promise.all(
    (categories || []).map(async (cat) => {
      const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", cat.id)
        .order("created_at", { ascending: false })
        .limit(6);
      
      const productsWithDiscounts = (products || []).map(withCalculatedDiscount);
      
      return { ...cat, products: productsWithDiscounts };
    })
  );

  const activeCategories = categoryProducts
    .filter(cat => cat.products.length > 0)
    .sort((a, b) => {
      const aSlug = a.slug?.toLowerCase();
      const bSlug = b.slug?.toLowerCase();

      const order = {
        'the-necklace-edit': -1,
        'sparkle-jewellery-duo': 1,
        'uniqueness': 2
      };

      const aOrder = order[aSlug] || 0;
      const bOrder = order[bSlug] || 0;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.name.localeCompare(b.name);
    });

  const allProductIds = [
    ...new Set(activeCategories.flatMap((cat) => cat.products.map((p) => p.id))),
  ];
  const reviewCounts = await getReviewCounts(allProductIds);
  const featuredReviews = await getFeaturedReviews(3);
  const reviewStats = await getSiteReviewStats();

  return (
    <main className="min-h-screen bg-white">
      <HeroSlider />

      <FeaturedCollections categories={categories || []} />

      <section className="bg-gray-50/50 py-0">
        {(() => {
          const bestSellerProducts = activeCategories
            .flatMap(cat => cat.products)
            .filter(p => p.is_bestseller)
            .slice(0, 8);

          if (bestSellerProducts.length > 0) {
            return (
              <ProductRow
                title="Best Sellers"
                products={bestSellerProducts}
                viewAllLink="/shop"
                reviewCounts={reviewCounts}
              />
            );
          }
          return null;
        })()}
      </section>

      {reviewStats.count > 0 && (
        <div className={`${HOME_CONTAINER} text-center py-8`}>
          <p className="text-sm font-semibold text-gray-700">
            Loved by our community — <span className="text-amber-500">{reviewStats.average}★</span> from {reviewStats.count} verified review{reviewStats.count === 1 ? "" : "s"}
          </p>
        </div>
      )}

      {activeCategories.map((cat) => (
        <ProductRow
          key={cat.id}
          title={cat.name}
          products={cat.products}
          viewAllLink={`/shop/${cat.slug}`}
          reviewCounts={reviewCounts}
        />
      ))}

      <Testimonials reviews={featuredReviews} reviewStats={reviewStats} />

      <InstagramFeed />

      <Newsletter />
    </main>
  );
}
