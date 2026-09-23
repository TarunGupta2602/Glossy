import Image from "next/image";
import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";
import ProductCard from "./ProductCard";
import SiteFaqSection from "./SiteFaqSection";
import { PROMO_LABEL } from "@/lib/promo";
import { reviewCardProps } from "@/lib/reviewCounts";
import { GIFT_FAQS } from "@/lib/faqs";

export default function GiftLandingContent({
    title,
    subtitle,
    maxPrice,
    products = [],
    reviewCounts = {},
    breadcrumbs = [],
    heroImage = "/festive/gifts-under-499-hero.jpg",
    heroAlt = "Everyday gold jewellery gift with a blush ribbon",
}) {
    return (
        <main className="min-h-screen bg-white">
            <section className="relative overflow-hidden border-b border-[#efeae4] bg-[#fdf8f6]">
                <div className={`${SITE_CONTAINER} py-6 md:py-10`}>
                    <nav className="text-[12px] text-gray-500 mb-5" aria-label="Breadcrumb">
                        <ol className="flex flex-wrap items-center gap-1.5">
                            <li>
                                <Link href="/" className="hover:text-[#E91E63]">
                                    Home
                                </Link>
                            </li>
                            {breadcrumbs.map((item) => (
                                <li key={item.href || item.label} className="flex items-center gap-1.5">
                                    <span aria-hidden>/</span>
                                    {item.href ? (
                                        <Link href={item.href} className="hover:text-[#E91E63]">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-800">{item.label}</span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 items-center">
                        <div className="max-w-xl">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E91E63] mb-2">
                                Gift edit · under ₹{maxPrice.toLocaleString("en-IN")}
                            </p>
                            <h1 className="font-playfair text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight mb-3 leading-[1.1]">
                                {title}
                            </h1>
                            <p className="text-[15px] text-gray-600 leading-relaxed mb-4">{subtitle}</p>
                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className="rounded-full bg-[#fdf2f6] border border-[#E91E63]/20 px-3 py-1.5 text-[11px] font-semibold text-[#E91E63]">
                                    {PROMO_LABEL}
                                </span>
                                <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600">
                                    Gift wrap included
                                </span>
                                <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600">
                                    Pan-India shipping
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href="/earrings"
                                    className="inline-flex min-h-10 items-center rounded-full bg-[#E91E63] px-4 text-[12px] font-semibold text-white hover:bg-[#c2185b] transition-colors"
                                >
                                    Shop earrings
                                </Link>
                                <Link
                                    href="/festive/diwali"
                                    className="inline-flex min-h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-[12px] font-semibold text-gray-900 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                                >
                                    Diwali edit
                                </Link>
                                <Link
                                    href="/festive/navratri"
                                    className="inline-flex min-h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-[12px] font-semibold text-gray-900 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                                >
                                    Navratri edit
                                </Link>
                            </div>
                        </div>

                        <div className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#f6f0ec] min-h-[200px]">
                            <Image
                                src={heroImage}
                                alt={heroAlt}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 40vw"
                                quality={85}
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${SITE_CONTAINER} py-10 md:py-14`}>
                {products.length > 0 ? (
                    <>
                        <p className="text-[12px] text-gray-500 mb-5">
                            Showing {products.length} gift-ready pieces under ₹
                            {maxPrice.toLocaleString("en-IN")}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    {...reviewCardProps(reviewCounts, product.id)}
                                    priority={index < 1}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                        <p className="text-gray-700 font-medium mb-3">
                            We’re refreshing this gift edit.
                        </p>
                        <Link
                            href="/shop"
                            className="text-[#E91E63] font-semibold text-sm hover:underline"
                        >
                            Browse the full catalogue →
                        </Link>
                    </div>
                )}

                <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-4">
                    <Link
                        href="/festive/diwali"
                        className="group relative overflow-hidden rounded-[1.35rem] min-h-[180px] bg-[#f7f1e8]"
                    >
                        <Image
                            src="/festive/diwali-festive-hero.jpg"
                            alt="Diwali jewellery edit"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={80}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b5] mb-1">
                                Festival look
                            </p>
                            <p className="font-playfair text-[1.35rem] text-white font-medium">
                                Shop the Diwali edit
                            </p>
                        </div>
                    </Link>
                    <Link
                        href="/festive/navratri"
                        className="group relative overflow-hidden rounded-[1.35rem] min-h-[180px] bg-[#f3e6ec]"
                    >
                        <Image
                            src="/festive/navratri-festive-hero.jpg"
                            alt="Navratri jewellery edit"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={80}
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f3c6d6] mb-1">
                                Festival look
                            </p>
                            <p className="font-playfair text-[1.35rem] text-white font-medium">
                                Shop the Navratri edit
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="mt-12 md:mt-16 max-w-2xl">
                    <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
                        Why these make easy gifts
                    </h2>
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-3">
                        Every piece here is anti-tarnish and made for everyday Indian wear — so the
                        gift doesn’t sit unused in a box. Perfect for birthdays, office gifting, and
                        last-minute festive boxes. Add two paid pieces for {PROMO_LABEL}.
                    </p>
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        Want a festival look rather than a budget pick? Open the Diwali or Navratri
                        edit — those pages are curated by occasion, not just price.
                    </p>
                    <div className="flex flex-wrap gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#E91E63]">
                        <Link href="/earrings" className="hover:underline">
                            Earrings
                        </Link>
                        <Link href="/necklaces" className="hover:underline">
                            Necklaces
                        </Link>
                        <Link href="/festive/diwali" className="hover:underline">
                            Diwali jewellery
                        </Link>
                        <Link href="/festive/navratri" className="hover:underline">
                            Navratri jewellery
                        </Link>
                        <Link href="/shop" className="hover:underline">
                            Full catalogue
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFaqSection
                faqs={GIFT_FAQS}
                eyebrow="Gifting help"
                title="Gift"
                titleAccent="questions"
                description="Budget picks, anti-tarnish longevity, Buy 2 Get 1 Free, pan-India shipping, and returns."
                idPrefix={`gift-faq-${maxPrice}`}
            />
        </main>
    );
}
