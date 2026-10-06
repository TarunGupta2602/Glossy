import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, BRAND_URL } from "@/lib/constants";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { getStorefrontCatalog } from "@/lib/storefrontCatalog";
import { isProductOutOfStock } from "@/lib/productAvailability";
import { getDisplayCategoryName } from "@/lib/categoryLanding";
import {
    WHOLESALE_MIN_AMOUNT,
    WHOLESALE_PREMIUM_RATE,
    WHOLESALE_RATE,
    formatRupee,
    wholesalePiecePrice,
    wholesaleRate,
    wholesaleWhatsAppUrl,
    WHOLESALE_INTRO_MESSAGE,
} from "@/lib/wholesale";

export const revalidate = 300;

export const metadata = {
    title: "Wholesale jewellery for shops",
    description:
        "Mix any designs, even one piece of each. Minimum wholesale order is ₹4,000. Bracelets, rings, sets and necklaces from ₹299 are 60% of the website price. Smaller pieces are 50%. Earrings around ₹150–₹200 stay at 40%.",
    alternates: { canonical: "/wholesale" },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
        title: "Wholesale jewellery for shops",
        description:
            "Mix any designs. Minimum ₹4,000. Premium pieces are 60% of the website price. Dispatch from Noida.",
        url: `${BRAND_URL}/wholesale`,
        siteName: BRAND_NAME,
        type: "website",
    },
};

function designMessage(product, wholesale) {
    return [
        "Hi, I want this in a wholesale order.",
        "",
        product.name,
        `Wholesale rate: ${formatRupee(wholesale)} each`,
        "Quantity: I will confirm. One piece is fine.",
        "",
        `I will mix other designs in the same order. The bill will be at least ${formatRupee(WHOLESALE_MIN_AMOUNT)}.`,
        "Please confirm this rate.",
    ].join("\n");
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

    const categoryOrder = [
        "The Necklace Edit",
        "Statement Pieces",
        "Sparkle Jewelry Duo",
        "Glimmer Bracelet",
        "Uniqueness Rings",
    ];
    const sections = [...groups.entries()]
        .sort((a, b) => {
            const rank = (name) => {
                const index = categoryOrder.indexOf(name);
                return index === -1 ? categoryOrder.length : index;
            };
            return rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]);
        })
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
                <h1 className="mt-2 max-w-3xl font-playfair text-[2rem] font-medium leading-tight tracking-tight text-[#2a2724] md:text-5xl">
                    Wholesale for shops
                </h1>
                <p className="mt-2 text-[15px] text-[#6b6560]">
                    Mix any designs. One piece of each is fine. Minimum {formatRupee(WHOLESALE_MIN_AMOUNT)}.
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                    {[
                        ["Minimum", `${formatRupee(WHOLESALE_MIN_AMOUNT)}`],
                        ["Mix", "1 piece each"],
                        ["Rate", `${Math.round(WHOLESALE_PREMIUM_RATE * 100)}% premium · ${Math.round(WHOLESALE_RATE * 100)}% rest`],
                        ["Payment", "50% now, rest before dispatch"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-[#efeae4] bg-white px-3.5 py-3">
                            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a847c]">
                                {label}
                            </dt>
                            <dd className="mt-1 text-[14px] font-semibold leading-snug text-[#2a2724]">{value}</dd>
                        </div>
                    ))}
                </dl>

                <a
                    href={orderUrl}
                    className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-[13px] font-semibold text-white"
                >
                    WhatsApp your mix
                </a>
                <p className="mt-3 text-[13px] text-[#6b6560]">
                    {pieceCount} designs are listed below. Buying one piece for yourself?{" "}
                    <Link href="/shop" className="font-semibold text-[#2a2724] underline underline-offset-2">
                        Shop at the website price
                    </Link>
                    .
                </p>
            </section>

            {sections.map((section) => (
                <section key={section.category} className={`${SITE_CONTAINER} pb-10`}>
                    <h2 className="mb-4 font-playfair text-2xl text-[#2a2724]">
                        {section.category}
                        <span className="ml-2 align-middle text-[13px] font-sans font-medium text-[#8a847c]">
                            {section.items.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
                        {section.items.map((product) => {
                            const retail = Number(product.price) || 0;
                            const rate = wholesaleRate(product);
                            const wholesale = wholesalePiecePrice(retail, rate);
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
                                        <h3 className="line-clamp-2 min-h-10 font-playfair text-[14px] leading-snug text-[#2a2724]">
                                            {product.name}
                                        </h3>
                                        <p className="mt-2 text-[18px] font-semibold tabular-nums text-[#2a2724]">
                                            {formatRupee(wholesale)}
                                            <span className="ml-1 text-[11px] font-medium text-[#8a847c]">each</span>
                                        </p>
                                        <p className="mt-0.5 text-[12px] tabular-nums text-[#6b6560]">
                                            {Math.round(rate * 100)}% of shop price {formatRupee(retail)}
                                        </p>
                                        <a
                                            href={wholesaleWhatsAppUrl(designMessage(product, wholesale))}
                                            className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full bg-[#2a2724] px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
                                        >
                                            Add to mix
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            ))}

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#efeae4] bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur md:hidden">
                <a
                    href={orderUrl}
                    className="flex min-h-12 items-center justify-center rounded-full bg-[#25D366] text-[13px] font-semibold text-white"
                >
                    WhatsApp a {formatRupee(WHOLESALE_MIN_AMOUNT)} mix
                </a>
            </div>
        </main>
    );
}
