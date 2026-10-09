import nextDynamic from "next/dynamic";
import { getFeaturedReviews } from "@/lib/featuredReviews";
import { getSiteReviewStats } from "@/lib/reviewStats";
import { getCategoryHref } from "@/lib/categoryLanding";
import HomeCollections from "./components/HomeCollections";
import HomeInstagramReels from "./components/HomeInstagramReels";
import HomeStoryTeaser from "./components/HomeStoryTeaser";
import HomeGiftEdits from "./components/HomeGiftEdits";
import SiteFaqSection from "./components/SiteFaqSection";
import HeroSlider from "./components/HeroSlider";
import ProductRow from "./components/ProductRow";
import TopStyles from "./components/TopStyles";
import RevealOnScroll from "./components/RevealOnScroll";
import { fetchInstagramReels } from "@/lib/instagram";
import { HOME_FAQS } from "@/lib/faqs";
import { getStorefrontCatalog, reviewCountsFor } from "@/lib/storefrontCatalog";
import { isRealBestseller } from "@/lib/unitsSold";
import { isProductOutOfStock } from "@/lib/productAvailability";

const Testimonials = nextDynamic(() => import("./components/testimonials"), {
  loading: () => <div className="h-[200px] bg-white" />,
});

const Newsletter = nextDynamic(() => import("./components/newsletter"), {
  loading: () => <div className="h-[160px] bg-white" />,
});

export const metadata = {
  title: {
    absolute: "The Luxe Jewels | Anti-Tarnish Jewellery Online India | Noida",
  },
  description:
    "Shop anti-tarnish earrings and necklaces from The Luxe Jewels, Noida. Buy 2 Get 1 Free. Flat ₹50 shipping. Cash on delivery needs no account.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Luxe Jewels | Anti-Tarnish Jewellery Online India | Noida",
    description:
      "Shop anti-tarnish earrings and necklaces. Buy 2 Get 1 Free. Flat ₹50 shipping. Cash on delivery needs no account.",
    url: "https://www.theluxejewels.in",
    siteName: "The Luxe Jewels",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Luxe Jewels | Anti-Tarnish Jewellery Online India | Noida",
    description:
      "Anti-tarnish jewellery for Noida, Delhi NCR & pan-India. Buy 2 Get 1 Free.",
  },
};

/** Cached for 5 minutes. Product edits call revalidateStorefront(), which includes "/". */
export const revalidate = 300;

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
    href: "/earrings",
    order: 1,
    fallbackImage: "/earring.png",
  },
  {
    match: (c) =>
      c.slug === "the-necklace-edit" || c.name?.toLowerCase().includes("necklace"),
    label: "Necklaces",
    href: "/necklaces",
    order: 2,
    fallbackImage: "/neck.png",
  },
  {
    match: (c) =>
      c.slug === "glimmer-bracelet" ||
      c.slug?.includes("bracelet") ||
      c.name?.toLowerCase().includes("bracelet"),
    label: "Bracelets",
    href: "/bracelets",
    order: 3,
    fallbackImage: "/iloveimg-resized/hero4.jpg",
  },
  {
    match: (c) => c.slug === "sparkle-jewelry-duo" || c.slug?.includes("sparkle"),
    label: "Bangle + Ring Sets",
    order: 4,
    fallbackImage: "/iloveimg-resized/hero5.jpg",
  },
  {
    match: (c) => {
      const slug = c.slug?.toLowerCase() || "";
      const name = c.name?.toLowerCase() || "";
      if (/earring/.test(slug) || /earring/.test(name)) return false;
      return (
        slug === "uniqueness-rings" ||
        slug.includes("uniqueness") ||
        /(^|-)rings?(-|$)/.test(slug) ||
        /\brings?\b/.test(name)
      );
    },
    label: "Rings",
    href: "/rings",
    order: 5,
    fallbackImage: "/iloveimg-resized/hero2.jpg",
  },
];

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
      name: meta.label,
      href: meta.href || getCategoryHref(category),
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
  const [
    { categories, products: catalog, reviewCounts: allReviewCounts },
    featuredReviews,
    reviewStats,
    instagramReels,
  ] = await Promise.all([
    getStorefrontCatalog(),
    getFeaturedReviews(4),
    getSiteReviewStats(),
    fetchInstagramReels(3),
  ]);

  const productsByCategoryId = {};
  for (const category of categories || []) {
    productsByCategoryId[category.id] = catalog
      .filter(
        (product) =>
          product.category_id === category.id && !isProductOutOfStock(product)
      )
      .slice(0, 8);
  }
  const collections = buildCollections(categories || [], productsByCategoryId);

  const buyableCatalog = catalog.filter((product) => !isProductOutOfStock(product));
  const latestProducts = buyableCatalog.slice(0, 12);
  const topStyleTabs = buildTopStyleTabs(collections, latestProducts);
  const shownOnHome = new Set(
    topStyleTabs.flatMap((tab) => tab.products || []).map((product) => product.id)
  );

  const takeFresh = (products, limit = 8) => {
    const picked = [];
    for (const product of products) {
      if (picked.length >= limit) break;
      if (shownOnHome.has(product.id)) continue;
      shownOnHome.add(product.id);
      picked.push(product);
    }
    return picked;
  };

  let newArrivalProducts = takeFresh(buyableCatalog.filter((product) => product.is_new));
  if (newArrivalProducts.length < 4) {
    newArrivalProducts = [
      ...newArrivalProducts,
      ...takeFresh(buyableCatalog, 8 - newArrivalProducts.length),
    ];
  }
  const bestSellerProducts = takeFresh(
    [...buyableCatalog]
      .filter((product) => isRealBestseller(product.units_sold))
      .sort((a, b) => (b.units_sold || 0) - (a.units_sold || 0))
  );
  const reviewCounts = reviewCountsFor(allReviewCounts, [
    ...bestSellerProducts,
    ...newArrivalProducts,
    ...topStyleTabs.flatMap((tab) => tab.products || []),
  ]);

  return (
    <main className="min-h-screen bg-[#fdfbf7]" data-home-rev="20261009b">
      {/* home-rev:20260918a — if View Source lacks this, you are on a stale cache */}
      <HeroSlider />

      <RevealOnScroll startVisible>
        <TopStyles
          tabs={topStyleTabs}
          reviewCounts={reviewCounts}
          className="pt-8 pb-14 md:pt-8 md:pb-14 lg:pt-10 lg:pb-16"
        />
      </RevealOnScroll>

      {newArrivalProducts.length > 0 && (
        <RevealOnScroll>
          <ProductRow
            title="New"
            titleAccent="arrivals"
            eyebrow="Just in"
            products={newArrivalProducts}
            reviewCounts={reviewCounts}
            surfaceClassName="bg-[#fdfbf7] border-t border-[#efeae4]"
          />
        </RevealOnScroll>
      )}

      {bestSellerProducts.length > 0 && (
        <RevealOnScroll>
          <ProductRow
            title="Our best"
            titleAccent="sellers"
            eyebrow="From real orders"
            products={bestSellerProducts}
            reviewCounts={reviewCounts}
            surfaceClassName="bg-[#faf7f2] border-t border-[#efeae4]"
          />
        </RevealOnScroll>
      )}

      <RevealOnScroll>
        <HomeCollections collections={collections} />
      </RevealOnScroll>

      <RevealOnScroll>
        <HomeGiftEdits />
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
