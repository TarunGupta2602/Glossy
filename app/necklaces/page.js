import Image from "next/image";
import Link from "next/link";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Premium Anti-Tarnish Necklaces | Waterproof Gold Chains",
    description: "Discover the finest anti-tarnish necklaces in India. Our collection includes waterproof 18k gold plated chains, pendants, and layered sets designed for everyday elegance.",
    alternates: {
        canonical: "/necklaces",
    },
    keywords: [
        "anti tarnish necklaces india",
        "waterproof gold chains india",
        "gold plated pendants online",
        "tarnish resistant jewellery brand",
        "minimalist necklaces for women",
        "daily wear jewellery india",
        "ethical fine jewellery online"
    ],
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Anti-Tarnish Necklaces | Luxury Waterproof Jewellery | The luxe jewels",
        description: "Luminous accents for every style. Handcrafted waterproof fine necklaces. Designed to never fade.",
        url: "https://www.theluxejewels.in/necklaces",
        siteName: "The luxe jewels",
        images: [{ url: "/logo.png" }],
        type: "website",
    },
};

export default async function NecklacesPage() {
    const supabase = getServiceClient();
    const slug = "the-necklace-edit";

    const { data: category } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", slug)
        .single();

    const { data: products } = await supabase
        .from("products")
        .select("*, categories(name, id, slug)")
        .eq("category_id", category?.id)
        .order("created_at", { ascending: false });

    // Breadcrumb Schema
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.theluxejewels.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://www.theluxejewels.in/shop"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Anti-Tarnish Necklaces",
                "item": "https://www.theluxejewels.in/necklaces"
            }
        ]
    };

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: "Anti-Tarnish Necklaces" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Anti-Tarnish Necklaces</h1>
                    <p className="text-gray-500 max-w-xl mx-auto italic font-medium">Timeless chains. Sustainable luxury. Designed to never fade.</p>
                </div>
                {!products || products.length === 0 ? (
                    <p className="text-center text-gray-500 font-medium py-12">Coming Soon.</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* SEO Footnote - Visually Hidden */}
            <div className="sr-only">
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Elegant Anti-Tarnish Necklaces for Modern Styling</h2>
                <p>
                    Shop our exclusive curation of **anti-tarnish necklaces** at The luxe jewels.
                    From delicate 18k gold plated chains meant for layering to bold statement pendants, each design is realized with a focus on sustainable luxury.
                    Our jewellery is designed in India and crafted to be **waterproof and sweat-proof**, ensuring your shine lasts a lifetime.
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Sustainable Luxury Fine Jewellery India</h2>
                <p>
                    At <Link href="/" className="text-gray-900 font-bold underline decoration-pink-100 underline-offset-4">The luxe jewels</Link>, we believe in beauty that lasts.
                    Explore our <Link href="/shop" className="text-gray-900 transition-colors font-semibold">fine jewellery collections</Link> and find pieces that
                    resonate with your personal style. Pair your necklace with our <Link href="/earrings" className="text-gray-900 transition-colors font-semibold">premium earrings</Link>
                    for a complete, sophisticated look.
                </p>
            </div>
        </section>
    );
}