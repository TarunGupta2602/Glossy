"use client";

const announcements = [
    "Buy 2 Get 1 Free on every order",
    "Free shipping on prepaid orders over ₹1000",
    "Anti-tarnish & waterproof jewellery",
    "Pan-India delivery from The Luxe Jewels",
];

function MarqueeTrack({ id }) {
    return (
        <div className="flex items-center shrink-0" aria-hidden={id === "b" ? true : undefined}>
            {announcements.map((text) => (
                <div key={`${id}-${text}`} className="flex items-center shrink-0">
                    <span className="px-6 md:px-10 text-[12px] md:text-[13px] font-semibold tracking-[0.12em] uppercase text-[#3d342c]">
                        {text}
                    </span>
                    <span
                        className="inline-flex items-center justify-center w-5 text-[11px] md:text-[12px]"
                        style={{ color: "#c4a574" }}
                        aria-hidden
                    >
                        ✦
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function AnnouncementBar() {
    return (
        <div
            className="announce-bar group relative overflow-hidden h-10 md:h-11 flex items-center z-50 border-b border-[#eadfce]"
            style={{
                background:
                    "linear-gradient(180deg, #f7f1e8 0%, #f0e6d8 100%)",
            }}
            role="region"
            aria-label="Store announcements"
        >
            {/* Soft side fades so text enters/exits cleanly */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 z-10"
                style={{
                    background: "linear-gradient(90deg, #f3ebe0 0%, transparent 100%)",
                }}
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 z-10"
                style={{
                    background: "linear-gradient(270deg, #f3ebe0 0%, transparent 100%)",
                }}
            />

            <div className="announce-marquee flex whitespace-nowrap will-change-transform">
                <MarqueeTrack id="a" />
                <MarqueeTrack id="b" />
            </div>

            <style jsx>{`
                .announce-marquee {
                    animation: announce-marquee 40s linear infinite;
                }
                .announce-bar:hover .announce-marquee {
                    animation-play-state: paused;
                }
                @keyframes announce-marquee {
                    from {
                        transform: translate3d(0, 0, 0);
                    }
                    to {
                        transform: translate3d(-50%, 0, 0);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .announce-marquee {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}
