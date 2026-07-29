import Image from "next/image";

export const dynamic = "force-static"; // ✅ SSG
export const metadata = {
    title: "Our Story | Handcrafted Sustainable Jewellery",
    description: "Discover the journey behind The luxe jewels. We are committed to crafting timeless, premium anti-tarnish jewellery with ethical sourcing and intentional design.",
    alternates: {
        canonical: "/our-story",
    },
    keywords: [
        "about the luxe jewels",
        "sustainable jewellery brand india",
        "ethical jewellery story",
        "handcrafted fine jewellery india",
        "luxury jewellery journey"
    ],
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};

export default function OurStoryPage() {
    return (
        <section className="bg-white py-24 px-6 md:px-12">
            <div className="max-w-5xl mx-auto text-center">

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Our Story
                </h1>

                <p className="text-gray-500 max-w-2xl mx-auto mb-16">
                    Crafted with passion. Designed for timeless elegance.
                </p>



                {/* Content */}
                <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
                    <p>
                        At The luxe jewels, we believe jewellery is more than an accessory — it’s a statement of identity, confidence, and timeless beauty.
                    </p>

                    <p>
                        Our journey started with a simple idea: to create pieces that feel luxurious yet accessible, modern yet timeless.
                    </p>

                    <p>
                        Every design is thoughtfully crafted with attention to detail, ensuring that each piece tells a story — your story.
                    </p>

                    <p>
                        From everyday elegance to statement pieces, The luxe jewels is here to elevate your style.
                    </p>
                </div>

                {/* Contact Information */}
                <div className="mt-16 pt-12 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a href="tel:+917456096455" className="flex items-center gap-3 text-gray-600 hover:text-[#E91E63] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-medium">+91 7456096455</span>
                        </a>
                        <a href="mailto:supporttheluxejewels@gmail.com" className="flex items-center gap-3 text-gray-600 hover:text-[#E91E63] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">supporttheluxejewels@gmail.com</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}