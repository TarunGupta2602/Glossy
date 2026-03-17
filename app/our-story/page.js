import Image from "next/image";

export const dynamic = "force-static"; // ✅ SSG

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
                        At Glossy, we believe jewelry is more than an accessory — it’s a statement of identity, confidence, and timeless beauty.
                    </p>

                    <p>
                        Our journey started with a simple idea: to create pieces that feel luxurious yet accessible, modern yet timeless.
                    </p>

                    <p>
                        Every design is thoughtfully crafted with attention to detail, ensuring that each piece tells a story — your story.
                    </p>

                    <p>
                        From everyday elegance to statement pieces, Glossy is here to elevate your style.
                    </p>
                </div>
            </div>
        </section>
    );
}