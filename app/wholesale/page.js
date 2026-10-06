import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, BRAND_URL } from "@/lib/constants";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { getStorefrontCatalog } from "@/lib/storefrontCatalog";
import { isProductOutOfStock } from "@/lib/productAvailability";
import { getDisplayCategoryName } from "@/lib/categoryLanding";
import {
    WHOLESALE_MIN_PIECES,
    formatRupee,
    wholesalePiecePrice,
    wholesaleWhatsAppUrl,
    WHOLESALE_INTRO_MESSAGE,
} from "@/lib/wholesale";

export const revalidate = 300;

export const metadata = {
    title: "Wholesale jewellery for resellers",
    description:
        "Reseller price is 30% of the current website price. Minimum 30 pieces of 18k gold plated anti-tarnish jewellery. Mix designs. Dispatch from Noida.",
    alternates: { canonical: "/wholesale" },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
        title: "Wholesale jewellery for resellers",
        description:
            "30% of the website price. Minimum 30 pieces. 18k gold plated anti-tarnish jewellery for boutiques and Instagram sellers.",
        url: `${BRAND_URL}/wholesale`,
        siteName: BRAND_NAME,
        type: "website",
    },
};

function designMessage(product, wholesale) {
    return `Hi, I want ${product.name} for my shop at the wholesale price of ${formatRupee(wholesale)}. My order will be at least ${WHOLESALE_MIN_PIECES} pieces.`;
}

export default async function WholesalePage() {
    const { products } = await getStorefrontCatalog();
    const groups = new Map();

    for (const product of products) {
        const retail = Number(product.price) || 0;
        if (retail <= 0 || isProductOutOfStock(product)) continue;
        const category = getDisplayCategoryName(product.categories, "Jewellery");
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(product);
    }

    const sections = [...groups.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([category, items]) => ({
            category,
            items: items.sort((a, b) => Number(a.price) - Number(b.price)),
        }));

    const pieceCount = sections.reduce((sum, section) => sum + section.items.length, 0);
    const orderUrl = wholesaleWhatsAppUrl(WHOLESALE_INTRO_MESSAGE);

    return (
        <main className="bg-[#fdfbf7] pb-28">
            <section className={`${SITE_CONTAINER} pt-8 pb-6 md:pt-12`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a5a28]">
                    For shops and Instagram sellers
                </p>
                <h1 className="mt-2 font-playfair text-[2rem] md:text-5xl font-medium text-[#2a2724] tracking-tight leading-tight">
                    Wholesale rate is 30% of the website price
                </h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6b6560]">
                    {pieceCount} designs you can mix. Minimum {WHOLESALE_MIN_PIECES} pieces.
                    This is 18k gold plated fashion jewellery, anti-tarnish, not hallmarked gold.
                    Single pieces stay on the shop at the full price. Buy 2 Get 1 Free does not apply here.
                </p>

                <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        ["Your price", "30% of website price"],
                        ["Minimum", `${WHOLESALE_MIN_PIECES} pieces, any mix`],
                        ["Payment", "50% advance, rest before dispatch"],
                        ["Dispatch", "From Noida, pan-India"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-white border border-[#efeae4] px-4 py-3">
                            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a847c]">
                                {label}
                            </dt>
                            <dd className="mt-1 text-[14px] font-semibold text-[#2a2724] leading-snug">{value}</dd>
                        </div>
                    ))}
                </dl>

                <a
                    href={orderUrl}
                    className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-[13px] font-semibold text-white"
                >
                    WhatsApp to place a wholesale order
                </a>
                <p className="mt-3 text-[13px] text-[#6b6560]">
                    Buying one piece for yourself?{" "}
                    <Link href="/shop" className="font-semibold text-[#2a2724] underline underline-offset-2">
                        Shop at the website price
                    </Link>
                    . Cash on delivery stays on those orders.
                </p>
            </section>

            {sections.map((section) => (
                <section key={section.category} className={`${SITE_CONTAINER} pb-10`}>
                    <h2 className="mb-4 font-playfair text-2xl text-[#2a2724]">{section.category}</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                        {section.items.map((product) => {
                            const retail = Number(product.price) || 0;
                            const wholesale = wholesalePiecePrice(retail);
                            return (
                                <article
                                    key={product.id}
                                    className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.04]"
                                >
                                    <div className="relative aspect-square bg-[#f4f2f0]">
                                        <Image
                                            src={product.main_image || "/logo.png"}
                                            alt={product.image_alt || product.name}
                                            fill
                                            sizes="(max-width: 1024px) 50vw, 25vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-3">
                                        <h3 className="font-playfair text-[14px] leading-snug text-[#2a2724] line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="mt-2 text-[12px] text-[#8a847c] line-through tabular-nums">
                                            Website {formatRupee(retail)}
                                        </p>
                                        <p className="text-[18px] font-semibold text-[#2a2724] tabular-nums">
                                            {formatRupee(wholesale)}
                                            <span className="ml-1 text-[11px] font-medium text-[#8a847c]">each</span>
                                        </p>
                                        <a
                                            href={wholesaleWhatsAppUrl(designMessage(product, wholesale))}
                                            className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full bg-[#2a2724] px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
                                        >
                                            Order on WhatsApp
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            ))}

            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[#efeae4] bg-white/95 backdrop-blur px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:hidden">
                <a
                    href={orderUrl}
                    className="flex min-h-12 items-center justify-center rounded-full bg-[#25D366] text-[13px] font-semibold text-white"
                >
                    WhatsApp a {WHOLESALE_MIN_PIECES}-piece order
                </a>
            </div>
        </main>
    );
}
