import dynamic from "next/dynamic";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { getFeaturedReviews } from "@/lib/featuredReviews";
import { getSiteReviewStats } from "@/lib/reviewStats";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import {
  findEarringsCategory,
  findNecklacesCategory,
  getCategoryHref,
} from "@/lib/categoryLanding";
import SeoIntro from "./components/SeoIntro";
import HomeTrustBar from "./components/HomeTrustBar";
import HomeCollections from "./components/HomeCollections";

const FeaturedCollections = dynamic(() => import("./components/featured-collections"), {
  loading: () => <div className="h-[420px] bg-[#faf7f8] animate-pulse" />,
});

const Testimonials = dynamic(() => import("./components/testimonials"), {
  loading: () => <div className="h-[300px] bg-gray-50 animate-pulse" />,
});

const Newsletter = dynamic(() => import("./components/newsletter"), {
  loading: () => <div className="h-[200px] bg-gray-50 animate-pulse" />,
});

const InstagramFeed = dynamic(() => import("./components/InstagramFeed"), {
  loading: () => <div className="h-[300px] bg-gray-50 animate-pulse" />,
});

const HeroSlider = dynamic(() => import("./components/HeroSlider"), {
  loading: () => <div className="h-[65vh] md:h-[85vh] bg-[#1a1214] animate-pulse" />,
});

const ProductRow = dynamic(() => import("./components/ProductRow"), {
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />,
});

const TopStyles = dynamic(() => import("./components/TopStyles"), {
  loading: () => <div className="h-[480px] bg-white animate-pulse" />,
});

const RecentlyViewed = dynamic(() => import("./components/RecentlyViewed"), {
  loading: () => null,
});

export const metadata = {
  title: "The Luxe Jewels | Premium Anti-Tarnish & Waterproof Jewellery India",
  description:
    "Shop anti-tarnish, waterproof, and hypoallergenic jewellery in India. Discover 18k gold plated earrings, necklaces, and everyday luxury at The Luxe Jewels.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Luxe Jewels | Premium Jewellery for Everyday Luxury",
    description:
      "Discover handcrafted anti-tarnish jewellery made for daily wear, gifting, and modern styling in India.",
    url: "https://www.theluxejewels.in",
    siteName: "The Luxe Jewels",
    type: "website",
  },
};

export const revalidate = 60;

function pickImage(...candidates) {
  return candidates.find((src) => typeof src === "string" && src.trim().length > 0) || "/logo.png";
}

/** Short shopper-facing labels for circular collection nav */
const COLLECTION_META = [
  {
    match: (c) =>
      c.slug?.includes("statement") || c.name?.toLowerCase().includes("earring"),
    label: "Earrings",
    order: 1,
    fallbackImage: "/earring.png",
  },
  {
    match: (c) =>
      c.slug === "the-necklace-edit" || c.name?.toLowerCase().includes("necklace"),
    label: "Necklaces",
    order: 2,
    fallbackImage: "/neck.png",
  },
  {
    match: (c) => c.slug === "glimmer-bracelet" || c.name?.toLowerCase().includes("bracelet"),
    label: "Bracelets",
    order: 3,
    fallbackImage: "/iloveimg-resized/hero4.png",
  },
  {
    match: (c) => c.slug === "sparkle-jewelry-duo" || c.slug?.includes("sparkle"),
    label: "Jewelry Duos",
    order: 4,
    fallbackImage: "/iloveimg-resized/hero5.png",
  },
  {
    match: (c) => c.slug === "uniqueness-rings" || c.name?.toLowerCase().includes("ring"),
    label: "Rings",
    order: 5,
    fallbackImage: "/iloveimg-resized/hero2.jpg",
  },
];

async function fetchCategoryProducts(supabase, categoryId, limit = 8) {
  if (!categoryId) return [];
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data || []).map(withCalculatedDiscount);
}

async function fetchHomeProducts(supabase, categories = []) {
  const earringsCat = findEarringsCategory(categories);
  const necklacesCat = findNecklacesCategory(categories);

  const [{ data: bestsellers }, { data: newArrivals }, { data: latest }] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_CARD_SELECT)
      .eq("is_bestseller", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select(PRODUCT_CARD_SELECT)
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select(PRODUCT_CARD_SELECT)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const productsByCategoryId = {};
  await Promise.all(
    (categories || []).map(async (cat) => {
      productsByCategoryId[cat.id] = await fetchCategoryProducts(supabase, cat.id, 8);
    })
  );

  const latestProducts = (latest || []).map(withCalculatedDiscount);
  // Only products explicitly tagged as bestseller / new — never fill bestsellers with new arrivals
  const bestSellerProducts = (bestsellers || []).map(withCalculatedDiscount);
  let newArrivalProducts = (newArrivals || []).map(withCalculatedDiscount);

  if (newArrivalProducts.length < 4) {
    const bestIds = new Set(bestSellerProducts.map((p) => p.id));
    const merged = [...newArrivalProducts];
    for (const product of latestProducts) {
      if (merged.length >= 8) break;
      if (bestIds.has(product.id)) continue;
      if (!merged.some((p) => p.id === product.id)) merged.push(product);
    }
    newArrivalProducts = merged;
  }

  const necklaceProducts = necklacesCat ? productsByCategoryId[necklacesCat.id] || [] : [];

  return {
    bestSellerProducts,
    newArrivalProducts,
    featuredProducts: necklaceProducts.slice(0, 3),
    latestProducts,
    productsByCategoryId,
    earringsCat,
    necklacesCat,
  };
}

function buildCollections(categories = [], productsByCategoryId = {}) {
  const used = new Set();
  const items = [];

  for (const meta of COLLECTION_META) {
    const category = categories.find((c) => !used.has(c.id) && meta.match(c));
    if (!category) continue;
    used.add(category.id);

    const products = productsByCategoryId[category.id] || [];
    items.push({
      id: category.id,
      label: meta.label,
      href: getCategoryHref(category),
      order: meta.order,
      image: pickImage(
        products[0]?.main_image,
        products[1]?.main_image,
        category.image_url,
        category.image,
        meta.fallbackImage
      ),
      products,
    });
  }

  return items.sort((a, b) => a.order - b.order);
}

function buildTopStyleTabs(collections, latestProducts) {
  const allProducts = [];
  const seen = new Set();

  for (const collection of collections) {
    for (const product of collection.products || []) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      allProducts.push(product);
    }
  }

  // Prefer a mix; fall back to latest if categories are thin
  const all =
    allProducts.length >= 4
      ? allProducts.slice(0, 8)
      : [...allProducts, ...latestProducts.filter((p) => !seen.has(p.id))].slice(0, 8);

  return [
    { id: "all", label: "All", href: "/shop", products: all },
    ...collections.map((c) => ({
      id: c.id,
      label: c.label,
      href: c.href,
      products: c.products || [],
    })),
  ];
}

export default async function Home() {
  const supabase = getServiceClient();

  const { data: categories } = await supabase.from("categories").select("*");

  const [
    {
      bestSellerProducts,
      newArrivalProducts,
      featuredProducts,
      latestProducts,
      productsByCategoryId,
      necklacesCat,
    },
    featuredReviews,
    reviewStats,
  ] = await Promise.all([
    fetchHomeProducts(supabase, categories || []),
    getFeaturedReviews(3),
    getSiteReviewStats(),
  ]);

  const collections = buildCollections(categories || [], productsByCategoryId);
  const topStyleTabs = buildTopStyleTabs(collections, latestProducts);

  const allProductIds = [
    ...new Set(
      [
        ...bestSellerProducts,
        ...newArrivalProducts,
        ...featuredProducts,
        ...topStyleTabs.flatMap((t) => t.products || []),
      ].map((p) => p.id)
    ),
  ];
  const reviewCounts = await getReviewCounts(allProductIds);

  const featuredFallback = pickImage(
    necklacesCat?.image_url,
    featuredProducts[0]?.main_image,
    "/iloveimg-resized/hero3.png"
  );

  return (
    <main className="min-h-screen bg-white">
      <HeroSlider />
      <HomeTrustBar />
      <HomeCollections collections={collections} />
      <TopStyles tabs={topStyleTabs} reviewCounts={reviewCounts} />

      {bestSellerProducts.length > 0 && (
        <ProductRow
          title="Bestsellers"
          eyebrow="Most loved"
          accent="warm"
          products={bestSellerProducts}
          viewAllLink="/shop?sort=popular"
          reviewCounts={reviewCounts}
        />
      )}

      <FeaturedCollections
        categories={categories || []}
        featuredProducts={featuredProducts}
        fallbackImage={featuredFallback}
      />

      {newArrivalProducts.length > 0 && (
        <ProductRow
          title="New Arrivals"
          eyebrow="Just in"
          products={newArrivalProducts}
          viewAllLink="/shop?sort=newest"
          reviewCounts={reviewCounts}
        />
      )}

      <RecentlyViewed />

      <Testimonials reviews={featuredReviews} reviewStats={reviewStats} />

      <SeoIntro
        title="Anti-tarnish jewellery made for everyday India"
        links={[
          { href: "/earrings", label: "Earrings" },
          { href: "/necklaces", label: "Necklaces" },
          { href: "/shop/glimmer-bracelet", label: "Bracelets" },
          { href: "/shop/sparkle-jewelry-duo", label: "Jewelry Duos" },
          { href: "/shop/uniqueness-rings", label: "Rings" },
          { href: "/shop", label: "Shop All" },
        ]}
      >
        <p>
          The Luxe Jewels crafts waterproof, hypoallergenic 18k gold plated jewellery for daily wear
          and gifting — from statement earrings to layered necklaces that stay lustrous without
          constant care.
        </p>
      </SeoIntro>

      <InstagramFeed />
      <Newsletter />
    </main>
  );
}
