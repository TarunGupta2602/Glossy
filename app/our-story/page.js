import Image from "next/image";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { INSTAGRAM_HANDLE, SUPPORT_EMAIL, SUPPORT_PHONE, WHATSAPP_URL } from "@/lib/constants";

export const dynamic = "force-static";

export const metadata = {
    title: "Our Story | Handcrafted Sustainable Jewellery",
    description: "Discover the journey behind The Luxe Jewels. We are committed to crafting timeless, premium anti-tarnish jewellery with ethical sourcing and intentional design.",
    alternates: {
        canonical: "/our-story",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};

const TIMELINE = [
    {
        year: "2023",
        title: "The idea takes shape",
        description: "We set out to create anti-tarnish jewellery that feels luxurious, wears beautifully every day, and stays accessible.",
    },
    {
        year: "2024",
        title: "The Luxe Jewels launches",
        description: "Our first collections of waterproof earrings and gold-plated necklaces go live — crafted for modern women across India.",
    },
    {
        year: "2025",
        title: "Growing the community",
        description: "Thousands of customers trust us for daily wear pieces, gifting, and styling that never fades — backed by real reviews and care.",
    },
    {
        year: "Today",
        title: "Designed for everyday luxury",
        description: "Every piece is thoughtfully made with 18k gold plating, skin-safe finishes, and the promise of tarnish-resistant brilliance.",
    },
];

export default function OurStoryPage() {
    return (
        <section className="bg-white py-24">
            <div className={`${SITE_CONTAINER} max-w-5xl`}>
                <div className="text-center mb-16">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#E91E63] mb-3">Our Journey</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Crafted with passion. Designed for timeless elegance.
                    </p>
                </div>

                <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-lg">
                    <Image
                        src="/iloveimg-resized/hero3.png"
                        alt="The Luxe Jewels — handcrafted anti-tarnish jewellery"
                        fill
                        sizes="(max-width: 768px) 100vw, 1024px"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white max-w-md">
                        <p className="text-sm font-bold uppercase tracking-wider text-pink-200 mb-2">The Luxe Jewels</p>
                        <p className="text-xl md:text-2xl font-playfair font-bold leading-snug">
                            Jewellery that celebrates confidence, not compromise.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mb-20 text-gray-600 leading-relaxed text-lg">
                    <p>
                        At The Luxe Jewels, we believe jewellery is more than an accessory — it&apos;s a statement of identity, confidence, and timeless beauty.
                    </p>
                    <p>
                        Our journey started with a simple idea: to create pieces that feel luxurious yet accessible, modern yet timeless — made to be worn, not stored away.
                    </p>
                </div>

                <div className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">Milestones</h2>
                    <ol className="relative border-l-2 border-pink-100 ml-4 md:ml-8 space-y-10">
                        {TIMELINE.map((item) => (
                            <li key={item.year} className="relative pl-8 md:pl-10">
                                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#E91E63] ring-4 ring-pink-50" />
                                <p className="text-xs font-black uppercase tracking-wider text-[#E91E63] mb-1">{item.year}</p>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-base leading-relaxed">{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
                    {["/iloveimg-resized/hero1.jpg", "/iloveimg-resized/hero4.png", "/iloveimg-resized/hero5.png"].map((src, i) => (
                        <div key={src} className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ${i === 0 ? "md:col-span-1" : ""}`}>
                            <Image
                                src={src}
                                alt={`The Luxe Jewels collection highlight ${i + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center pt-12 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet the makers behind the sparkle</h2>
                    <p className="text-gray-600 mb-2">A small, passionate team curating and quality-checking every piece.</p>
                    <p className="text-sm text-[#E91E63] font-semibold mb-8">{INSTAGRAM_HANDLE} on Instagram</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="flex items-center justify-center gap-3 text-gray-600 hover:text-[#E91E63] transition-colors">
                            <span className="font-medium">{SUPPORT_PHONE}</span>
                        </a>
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center justify-center gap-3 text-gray-600 hover:text-[#E91E63] transition-colors">
                            <span className="font-medium">{SUPPORT_EMAIL}</span>
                        </a>
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#25D366] transition-colors font-medium">
                            WhatsApp us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
