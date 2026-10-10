"use client";

import { useEffect, useState } from "react";
import { daysUntil, FESTIVAL_SEASON } from "@/lib/festivalSeason";

/** Storefront countdown is Diwali-only. Navratri is retired. */
export default function FestivalCountdown({ className = "", style }) {
    const [days, setDays] = useState(null);

    useEffect(() => {
        setDays(daysUntil(FESTIVAL_SEASON.diwali));
    }, []);

    if (days == null || days < 0) return null;

    return (
        <p className={className} style={style}>
            {days === 0 ? "Diwali is today" : `Diwali in ${days} day${days === 1 ? "" : "s"}`}
        </p>
    );
}
