import Link from "next/link";
import { listCityLandings } from "@/lib/cityLandings";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import { BRAND_URL, SERVICE_AREA_LABEL } from "@/lib/constants";
import RelatedGuides from "../components/RelatedGuides";

export const metadata = {
    title: "Jewellery Shop Near You | Noida & Delhi NCR",
    description:
        "Local pages for Noida, Greater Noida, Ghaziabad & Delhi NCR — anti-tarnish jewellery with pan-India shipping.",
    alternates: { canonical: "/jewellery-shop" },
    openGraph: {
        title: "Jewellery Shop Near You | Noida & Delhi NCR",
        description: SERVICE_AREA_LABEL,
        url: `${BRAND_URL}/jewellery-shop`,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
};

export default function JewelleryShopIndexPage() {
    const cities = listCityLandings();

    return (
        <main className="min-h-screen bg-[#fdfbf7]">
            <div className={`${HOME_CONTAINER} py-14 md:py-20`}>
                <p
                    className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                    style={{ color: "#b89a6a" }}
                >
                    Local SEO
                </p>
                <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-medium text-[#2a2724] tracking-tight max-w-3xl">
                    Jewellery shop pages for Noida & Delhi NCR
                </h1>
                <p className="mt-4 text-[15px] text-[#6b6560] max-w-2xl leading-relaxed">
                    {SERVICE_AREA_LABEL}. Pick your city page for local search intent, then shop
                    anti-tarnish everyday wear online.
                </p>
                <ul className="mt-10 grid sm:grid-cols-2 gap-4 max-w-3xl">
                    {cities.map((city) => (
                        <li key={city.slug}>
                            <Link
                                href={`/jewellery-shop/${city.slug}`}
                                className="block rounded-2xl border border-[#efeae4] bg-white px-5 py-5 hover:border-[#b89a6a] transition-colors"
                            >
                                <span className="font-playfair text-xl text-[#2a2724]">
                                    Jewellery shop in {city.name}
                                </span>
                                <span className="mt-1 block text-[12px] uppercase tracking-[0.14em] text-[#8a847c]">
                                    View local page →
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <RelatedGuides page="jewelleryShop" title="Shop from your city" />
        </main>
    );
}
