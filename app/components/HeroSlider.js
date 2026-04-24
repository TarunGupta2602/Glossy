"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSlider() {
    const slides = [
        {
            image: "/hero2.jpg",
            subtitle: "The New Season",
            title: "Lustre & Light",
            description: "Handcrafted anti-tarnish jewelry designed for your daily brilliance.",
            buttonText: "Shop the Collection",
            buttonLink: "/shop",
            isSale: false
        },
        {
            image: "/hero3.jpg",
            subtitle: "Limited Time Offer",
            title: "The Luxe Sale",
            description: "Curated favorites, now available at exceptional price points.",
            buttonText: "Explore the Sale",
            buttonLink: "/shop",
            isSale: true
        }
    ];

    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx((prevIdx) => (prevIdx + 1) % slides.length);
        }, 6000); // 6 seconds for better reading
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section className="relative h-[65vh] md:h-[85vh] flex items-center overflow-hidden bg-[#fafafa]">
            {/* Background Image Slider */}
            <div className="absolute inset-0 z-0">
                {slides.map((slide, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIdx ? "opacity-100" : "opacity-0"}`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority={idx === 0}
                            unoptimized={true}
                            sizes="100vw"
                            className="object-cover"
                        />
                        {/* Subtle Overlay - lighter than before to show photographic quality */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 w-full">
                <div className="max-w-3xl">
                    {slides.map((slide, idx) => (
                        <div
                            key={idx}
                            className={`transition-all duration-1000 ${idx === currentIdx ? "opacity-100 translate-y-0 relative" : "opacity-0 translate-y-8 absolute inset-0 pointer-events-none"}`}
                        >
                            {/* Script Subtitle inspired by "Hello" in reference */}
                            <p className={`text-white italic font-serif text-2xl md:text-3xl mb-4 tracking-wide ${idx === currentIdx ? "animate-in fade-in slide-in-from-bottom-4 duration-700" : ""}`}>
                                {idx === 1 ? "Hello" : slide.subtitle}
                            </p>

                            <h1 className={`text-5xl md:text-8xl font-playfair font-bold text-white tracking-tight leading-[0.95] mb-8 ${idx === currentIdx ? "animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100" : ""}`}>
                                {slide.title.split('&').map((part, i) => (
                                    <span key={i} className="block">
                                        {part}{i === 0 && slides[idx].title.includes('&') && <span className="opacity-60">&</span>}
                                    </span>
                                ))}
                            </h1>

                            <div className={`flex flex-col gap-8 ${idx === currentIdx ? "animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300" : ""}`}>
                                <p className="text-lg md:text-xl font-medium text-white/90 max-w-lg leading-relaxed lowercase tracking-wider">
                                    {slide.description}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-start gap-8">
                                    <Link
                                        href={slide.buttonLink}
                                        className="group relative inline-flex items-center gap-4 text-white font-black text-sm uppercase tracking-[0.25em] transition-all"
                                    >
                                        <span className="relative pb-2">
                                            {slide.buttonText}
                                            <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#E91E63] transition-all group-hover:w-full"></span>
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-2 transition-transform duration-300">
                                            <path d="M5 12h14m-7-7 7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-12 right-12 md:right-24 z-20 flex gap-4">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`group relative h-12 w-1 flex items-center justify-center transition-all duration-500`}
                        aria-label={`Go to slide ${idx + 1}`}
                    >
                        <div className={`w-full transition-all duration-500 ${idx === currentIdx ? "bg-[#E91E63] h-full" : "bg-white/30 h-1/2 group-hover:h-3/4 group-hover:bg-white/60"}`}></div>
                    </button>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-40">
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
            </div>
        </section>
    );
}
