"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSlider() {
    const images = [
        "/hero2.jpg",
        "/hero3.jpg",
    ];




    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx((prevIdx) => (prevIdx + 1) % images.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="relative h-[90vh] flex items-center overflow-hidden">
            {/* Background Image Slider */}
            <div className="absolute inset-0 z-0">
                {images.map((img, idx) => (
                    <div
                        key={img}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIdx ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Luxury Jewelry Hero ${idx + 1}`}
                            fill
                            priority={idx === 0}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 "></div>
                    </div>
                ))}
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

            {/* Slider Dots (Optional but nice) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-3">

                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIdx ? "bg-[#E91E63] w-8" : "bg-white/40 hover:bg-white/60"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
