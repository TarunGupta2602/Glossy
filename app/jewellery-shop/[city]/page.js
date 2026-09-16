import { notFound } from "next/navigation";
import {
    CityLandingPage,
    getCityLanding,
    listCityLandings,
} from "@/lib/cityLandings";
import { BRAND_URL } from "@/lib/constants";

export const revalidate = 3600;

export function generateStaticParams() {
    return listCityLandings().map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
    const { city: citySlug } = await params;
    const city = getCityLanding(citySlug);
    if (!city) {
        return { title: "Not Found", robots: { index: false, follow: false } };
    }

    return {
        title: city.title,
        description: city.description,
        alternates: { canonical: `/jewellery-shop/${city.slug}` },
        openGraph: {
            title: city.title,
            description: city.description,
            url: `${BRAND_URL}/jewellery-shop/${city.slug}`,
            siteName: "The Luxe Jewels",
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
        },
    };
}

export default async function JewelleryShopCityPage({ params }) {
    const { city: citySlug } = await params;
    const city = getCityLanding(citySlug);
    if (!city) notFound();
    return <CityLandingPage city={city} />;
}
