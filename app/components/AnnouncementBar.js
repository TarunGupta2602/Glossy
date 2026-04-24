"use client";

import React from "react";

const announcements = [
    { text: "Buy 2 Get 1 Free on All Products", highlight: true },
    { text: "Free Shipping on All Prepaid Orders Across India", highlight: false },
    { text: "Premium Anti-Tarnish & Waterproof Jewelry", highlight: false },
    { text: "Handcrafted Luxury for Every Moment", highlight: false },
];

export default function AnnouncementBar() {
    return (
        <div className="relative overflow-hidden bg-black border-b border-white/5 h-8 md:h-9 flex items-center shadow-sm z-50">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />

            <div className="flex whitespace-nowrap animate-marquee">
                {/* Loop the content multiple times for a seamless flow */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center">
                        {announcements.map((item, index) => (
                            <div key={`${i}-${index}`} className="flex items-center mx-6 md:mx-10">
                                {item.highlight ? (
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E91E63] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E91E63]"></span>
                                        </span>
                                        <span className="text-white font-black tracking-[0.15em] text-[9px] md:text-[10px] uppercase">
                                            {item.text}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 font-medium tracking-[0.1em] text-[9px] md:text-[10px] uppercase">
                                        {item.text}
                                    </span>
                                )}

                                {/* Refined separator */}
                                <span className="mx-6 md:mx-10 text-white/20 font-light text-xs">/</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 50s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
