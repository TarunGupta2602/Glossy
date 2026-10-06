import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, BRAND_URL } from "@/lib/constants";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { getStorefrontCatalog } from "@/lib/storefrontCatalog";
import { isProductOutOfStock } from "@/lib/productAvailability";
import { getDisplayCategoryName } from "@/lib/categoryLanding";
import {
    WHOLESALE_MIN_AMOUNT,
    WHOLESALE_NECKLACE_RATE,
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
        "Mix any designs, even one piece of each. Minimum wholesale order is ₹4,000. Earrings, bracelets and rings are 30% of the website price. Necklaces are 40%.",
    alternates: { canonical: "/wholesale" },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
        title: "Wholesale jewellery for shops",
        description:
            "Mix any designs. Minimum ₹4,000. 30% of the website price, 40% on necklaces. Dispatch from Noida.",
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

const STEPS = [
    "Pick any designs below. One piece of a design is enough. You do not have to take a full set of the same piece.",
    "Mix earrings, necklaces, bracelets and rings in one order.",
    `Keep adding until the wholesale total is at least ${formatRupee(WHOLESALE_MIN_AMOUNT)}.`,
    "Send the list on WhatsApp. Pay 50% to confirm. Pay the rest before we dispatch from Noida.",
];

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
                <h1 className="mt-2 max-w-3xl font-playfair text-[2rem] font-medium leading-tight tracking-tight text-[#2a2724] md:text-5xl">
                    Wholesale. Mix any pieces. Minimum {formatRupee(WHOLESALE_MIN_AMOUNT)}.
                </h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6b6560]">
                    Earrings, bracelets and rings are {Math.round(WHOLESALE_RATE * 100)}% of today’s website price.
                    Necklaces are {Math.round(WHOLESALE_NECKLACE_RATE * 100)}%.
                    This rate is only for a shop order on this page.
                    One piece from the shop stays at the full price, with cash on delivery and Buy 2 Get 1 Free.
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        ["Minimum", `${formatRupee(WHOLESALE_MIN_AMOUNT)} total`],
                        ["Mix", "1 piece of each design is fine"],
                        ["Your rate", "30% · necklaces 40%"],
                        ["Payment", "50% now, rest before dispatch"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-[#efeae4] bg-white px-4 py-3">
                            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a847c]">
                                {label}
                            </dt>
                            <dd className="mt-1 text-[14px] font-semibold leading-snug text-[#2a2724]">{value}</dd>
                        </div>
                    ))}
                </dl>

                <ol className="mt-6 max-w-2xl space-y-2">
                    {STEPS.map((step, index) => (
                        <li key={step} className="flex gap-3 text-[14px] leading-relaxed text-[#2a2724]">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2a2724] text-[11px] font-semibold text-white">
                                {index + 1}
                            </span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>

                <a
                    href={orderUrl}
                    className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-[13px] font-semibold text-white"
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
                    <h2 className="mb-4 font-playfair text-2xl text-[#2a2724]">{section.category}</h2>
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
                                        <h3 className="line-clamp-2 font-playfair text-[14px] leading-snug text-[#2a2724]">
                                            {product.name}
                                        </h3>
                                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a5a28]">
                                            {Math.round(rate * 100)}% of shop price
                                        </p>
                                        <p className="text-[18px] font-semibold tabular-nums text-[#2a2724]">
                                            {formatRupee(wholesale)}
                                            <span className="ml-1 text-[11px] font-medium text-[#8a847c]">each</span>
                                        </p>
                                        <p className="mt-1 text-[12px] tabular-nums text-[#6b6560]">
                                            Shop price for 1 piece stays {formatRupee(retail)}
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
