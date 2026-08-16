import dynamic from "next/dynamic";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { getFeaturedReviews } from "@/lib/featuredReviews";
import { getSiteReviewStats } from "@/lib/reviewStats";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { attachHoverImagesToLists } from "@/lib/hoverImages";
import {
  findEarringsCategory,
  findNecklacesCategory,
  getCategoryHref,
} from "@/lib/categoryLanding";
import HomeTrustBar from "./components/HomeTrustBar";
import HomeCollections from "./components/HomeCollections";
import HomeGiftEdits from "./components/HomeGiftEdits";
import HeroSlider from "./components/HeroSlider";
import ProductRow from "./components/ProductRow";
import TopStyles from "./components/TopStyles";
import RevealOnScroll from "./components/RevealOnScroll";

const Testimonials = dynamic(() => import("./components/testimonials"), {
  loading: () => <div className="h-[300px] bg-gray-50 animate-pulse" />,
});

const Newsletter = dynamic(() => import("./components/newsletter"), {
  loading: () => <div className="h-[200px] bg-gray-50 animate-pulse" />,
});

const InstagramFeed = dynamic(() => import("./components/InstagramFeed"), {
  loading: () => <div className="h-[300px] bg-gray-50 animate-pulse" />,
});

const RecentlyViewed = dynamic(() => import("./components/RecentlyViewed"), {
  loading: () => null,
});

export const metadata = {
  title: {
    absolute: "Luxe Jewels Noida | Anti-Tarnish Jewellery Shop India",
  },
  description:
    "Shop The Luxe Jewels in Noida & Delhi NCR — anti-tarnish, waterproof 18k gold plated earrings, necklaces & more. Buy 2 Get 1 Free + free delivery over ₹1000 across India.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Luxe Jewels Noida | Anti-Tarnish Jewellery Shop India",
    description:
      "Anti-tarnish jewellery for daily wear and gifting — serving Noida, Delhi NCR, and pan-India. Buy 2 Get 1 Free.",
    url: "https://www.theluxejewels.in",
    siteName: "The Luxe Jewels",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxe Jewels Noida | Anti-Tarnish Jewellery Shop India",
    description:
      "Anti-tarnish, waterproof jewellery for Noida, Delhi NCR & pan-India. Buy 2 Get 1 Free.",
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

function pickMatchedCategories(categories = []) {
  const used = new Set();
  const matched = [];
  for (const meta of COLLECTION_META) {
    const category = categories.find((c) => !used.has(c.id) && meta.match(c));
    if (!category) continue;
    used.add(category.id);
    matched.push(category);
  }
  return matched;
}

async function fetchHomeProducts(supabase, categories = []) {
  const matchedCategories = pickMatchedCategories(categories);
  const earringsCat = findEarringsCategory(categories);
  const necklacesCat = findNecklacesCategory(categories);

  const [
    { data: bestsellers },
    { data: newArrivals },
    { data: latest },
    categoryProductResults,
  ] = await Promise.all([
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
    Promise.all(
      matchedCategories.map(async (cat) => [
        cat.id,
        await fetchCategoryProducts(supabase, cat.id, 8),
      ])
    ),
  ]);

  const productsByCategoryId = Object.fromEntries(categoryProductResults);

  const latestProducts = (latest || []).map(withCalculatedDiscount);
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
      name: category.name || meta.label,
      href: getCategoryHref(category),
      order: meta.order,
      image: pickImage(
        category.image_url,
        category.image,
        products[0]?.main_image,
        products[1]?.main_image,
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
      // Cap payload — only first 8 products per tab are shown
      products: (c.products || []).slice(0, 8),
    })),
  ];
}

export default async function Home() {
  const supabase = getServiceClient();

  const [
    { data: categories },
    featuredReviews,
    reviewStats,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, image_url, description"),
    getFeaturedReviews(6),
    getSiteReviewStats(),
  ]);

  const {
    bestSellerProducts: bestRaw,
    newArrivalProducts: newRaw,
    latestProducts: latestRaw,
    productsByCategoryId,
  } = await fetchHomeProducts(supabase, categories || []);

  const collections = buildCollections(categories || [], productsByCategoryId);
  const topStyleTabsRaw = buildTopStyleTabs(collections, latestRaw);

  const tabProductLists = topStyleTabsRaw.map((t) => t.products || []);
  const [bestSellerProducts, newArrivalProducts, ...tabLists] =
    await attachHoverImagesToLists(supabase, [
      bestRaw,
      newRaw,
      ...tabProductLists,
    ]);

  const topStyleTabs = topStyleTabsRaw.map((tab, i) => ({
    ...tab,
    products: tabLists[i] || tab.products,
  }));

  const allProductIds = [
    ...new Set(
      [
        ...bestSellerProducts,
        ...newArrivalProducts,
        ...topStyleTabs.flatMap((t) => t.products || []),
      ].map((p) => p.id)
    ),
  ];
  const reviewCounts = await getReviewCounts(allProductIds);

  return (
    <main className="min-h-screen bg-white">
      <HeroSlider />
      <HomeTrustBar />
      <HomeGiftEdits />

      <RevealOnScroll>
        <HomeCollections collections={collections} />
      </RevealOnScroll>

      <RevealOnScroll>
        <TopStyles tabs={topStyleTabs} reviewCounts={reviewCounts} />
      </RevealOnScroll>

      {bestSellerProducts.length > 0 && (
        <RevealOnScroll>
          <ProductRow
            title="Bestsellers"
            eyebrow="Most loved"
            accent="warm"
            products={bestSellerProducts}
            viewAllLink="/shop?sort=popular"
            reviewCounts={reviewCounts}
          />
        </RevealOnScroll>
      )}

      {newArrivalProducts.length > 0 && (
        <RevealOnScroll>
          <ProductRow
            title="New Arrivals"
            eyebrow="Just in"
            products={newArrivalProducts}
            viewAllLink="/shop?sort=newest"
            reviewCounts={reviewCounts}
          />
        </RevealOnScroll>
      )}

      <RecentlyViewed />

      <RevealOnScroll>
        <Testimonials reviews={featuredReviews} reviewStats={reviewStats} />
      </RevealOnScroll>

      <RevealOnScroll>
        <InstagramFeed />
      </RevealOnScroll>

      <Newsletter />
    </main>
  );
}
