import Image from "next/image";
import Link from "next/link";
import FeaturedCollections from "./components/featured-collections";
import Testimonials from "./components/testimonials";
import Newsletter from "./components/newsletter";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/heroimage.png"
            alt="Luxury Jewelry Hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 "></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-white">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 animate-fade-in-up">
              Lustre <br />
              & Light.
            </h1>

            <p className="text-xl md:text-2xl font-normal max-w-xl mb-12 opacity-90 leading-relaxed animate-fade-in-up [animation-delay:200ms]">
              Elevate your presence with our curated collection of artisan-crafted jewelry
              designed to highlight your natural elegance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 animate-fade-in-up [animation-delay:400ms]">
              <Link
                href="/shop"
                className="px-10 py-4 bg-[#E91E63] text-white font-bold rounded-lg shadow-xl hover:bg-[#D81B60] transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto text-center"
              >
                SHOP NEW ARRIVALS
              </Link>
              <Link
                href="/collection"
                className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/40 text-white font-bold rounded-lg hover:bg-white/20 transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto text-center"
              >
                THE COLLECTION
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Featured Collections Section */}
      <FeaturedCollections />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  );
}