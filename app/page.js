import dynamic from "next/dynamic";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { getFeaturedReviews } from "@/lib/featuredReviews";
import { getSiteReviewStats } from "@/lib/reviewStats";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { attachHoverImagesToLists } from "@/lib/hoverImages";
import { getCategoryHref } from "@/lib/categoryLanding";
import HomeCollections from "./components/HomeCollections";
import HomeInstagramReels from "./components/HomeInstagramReels";
import HomeStoryTeaser from "./components/HomeStoryTeaser";
import SiteFaqSection from "./components/SiteFaqSection";
import HeroSlider from "./components/HeroSlider";
import ProductRow from "./components/ProductRow";
import TopStyles from "./components/TopStyles";
import RevealOnScroll from "./components/RevealOnScroll";
import { fetchInstagramReels } from "@/lib/instagram";
import { HOME_FAQS } from "@/lib/faqs";

const Testimonials = dynamic(() => import("./components/testimonials"), {
  loading: () => <div className="h-[200px] bg-white" />,
});

const Newsletter = dynamic(() => import("./components/newsletter"), {
  loading: () => <div className="h-[160px] bg-white" />,
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
  return (
    candidates.find((src) => typeof src === "string" && src.trim().length > 0) ||
    "/logo.png"
  );
}

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
    match: (c) =>
      c.slug === "glimmer-bracelet" || c.name?.toLowerCase().includes("bracelet"),
    label: "Bracelets",
    order: 3,
    fallbackImage: "/iloveimg-resized/hero4.png",
  },
  {
    match: (c) => c.slug === "sparkle-jewelry-duo" || c.slug?.includes("sparkle"),
    label: "Duos",
    order: 4,
    fallbackImage: "/iloveimg-resized/hero5.png",
  },
  {
    match: (c) =>
      c.slug === "uniqueness-rings" || c.name?.toLowerCase().includes("ring"),
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
      products: (c.products || []).slice(0, 8),
    })),
  ];
}

export default async function Home() {
  const supabase = getServiceClient();

  const [
    { data: categories },
    { data: bestsellers },
    { data: newArrivals },
    { data: latest },
    featuredReviews,
    reviewStats,
    instagramReels,
  ] = await Promise.all([
    supabase.from("categories").select("id, name, slug, image_url"),
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
    getFeaturedReviews(4),
    getSiteReviewStats(),
    fetchInstagramReels(6),
  ]);

  const matched = [];
  const used = new Set();
  for (const meta of COLLECTION_META) {
    const category = (categories || []).find((c) => !used.has(c.id) && meta.match(c));
    if (!category) continue;
    used.add(category.id);
    matched.push(category);
  }

  const categoryProductResults = await Promise.all(
    matched.map(async (cat) => [
      cat.id,
      await fetchCategoryProducts(supabase, cat.id, 8),
    ])
  );
  const productsByCategoryId = Object.fromEntries(categoryProductResults);
  const collections = buildCollections(categories || [], productsByCategoryId);

  let bestSellerProducts = (bestsellers || []).map(withCalculatedDiscount);
  let newArrivalProducts = (newArrivals || []).map(withCalculatedDiscount);
  const latestProducts = (latest || []).map(withCalculatedDiscount);

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

  const topStyleTabsRaw = buildTopStyleTabs(collections, latestProducts);
  const tabProductLists = topStyleTabsRaw.map((t) => t.products || []);

  const [bestWithHover, newWithHover, ...tabLists] = await attachHoverImagesToLists(
    supabase,
    [bestSellerProducts, newArrivalProducts, ...tabProductLists]
  );

  bestSellerProducts = bestWithHover;
  newArrivalProducts = newWithHover;

  const topStyleTabs = topStyleTabsRaw.map((tab, i) => ({
    ...tab,
    products: tabLists[i] || tab.products,
  }));

  const reviewCounts = await getReviewCounts([
    ...new Set([
      ...bestSellerProducts.map((p) => p.id),
      ...newArrivalProducts.map((p) => p.id),
      ...topStyleTabs.flatMap((t) => (t.products || []).map((p) => p.id)),
    ]),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <HeroSlider />

      <RevealOnScroll>
        <TopStyles tabs={topStyleTabs} reviewCounts={reviewCounts} />
      </RevealOnScroll>

      {newArrivalProducts.length > 0 && (
        <RevealOnScroll>
          <ProductRow
            title="New"
            titleAccent="arrivals"
            eyebrow="Just in"
            products={newArrivalProducts}
            viewAllLink="/shop?sort=newest"
            reviewCounts={reviewCounts}
          />
        </RevealOnScroll>
      )}

      {bestSellerProducts.length > 0 && (
        <RevealOnScroll>
          <ProductRow
            title="Our best"
            titleAccent="sellers"
            eyebrow="Most loved"
            products={bestSellerProducts}
            viewAllLink="/shop?sort=popular"
            reviewCounts={reviewCounts}
          />
        </RevealOnScroll>
      )}

      <RevealOnScroll>
        <HomeCollections collections={collections} />
      </RevealOnScroll>

      <RevealOnScroll>
        <HomeInstagramReels reels={instagramReels} />
      </RevealOnScroll>

      <RevealOnScroll>
        <HomeStoryTeaser />
      </RevealOnScroll>

      <RevealOnScroll>
        <Testimonials reviews={featuredReviews} reviewStats={reviewStats} />
      </RevealOnScroll>

      <Newsletter />

      <RevealOnScroll>
        <SiteFaqSection
          faqs={HOME_FAQS}
          idPrefix="home-faq"
          description="Anti-tarnish care, shipping across India, Buy 2 Get 1 Free, and returns — answered clearly."
        />
      </RevealOnScroll>
    </main>
  );
}
