"use client";

import { BUSINESS_HOURS, BRAND_NAME } from "@/lib/constants";
import { getFestivalAnnouncements } from "@/lib/festivalSeason";

const announcements = getFestivalAnnouncements();

function MarqueeTrack({ trackId }) {
    return (
        <div className="announce-marquee-track" aria-hidden="true">
            {announcements.map((text) => (
                <div key={`${trackId}-${text}`} className="flex items-center shrink-0">
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
    const accessibleSummary = `${announcements.join(". ")}. Store hours: ${BUSINESS_HOURS}.`;

    return (
        <div
            className="announce-bar group relative overflow-hidden h-10 md:h-11 flex items-center z-40 border-b border-[#eadfce]"
            style={{
                background: "linear-gradient(180deg, #f7f1e8 0%, #f0e6d8 100%)",
            }}
            role="region"
            aria-label={`${BRAND_NAME} announcements`}
        >
            <p className="sr-only">{accessibleSummary}</p>

            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 z-10"
                style={{
                    background: "linear-gradient(90deg, #f3ebe0 0%, transparent 100%)",
                }}
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 z-10"
                style={{
                    background: "linear-gradient(270deg, #f3ebe0 0%, transparent 100%)",
                }}
                aria-hidden
            />

            <div className="announce-marquee">
                <MarqueeTrack trackId="a" />
                <MarqueeTrack trackId="b" />
            </div>
        </div>
    );
}
