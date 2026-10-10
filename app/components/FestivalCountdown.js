"use client";

import { useEffect, useState } from "react";
import { daysUntil, getLeadFestival, FESTIVAL_SEASON } from "@/lib/festivalSeason";

export default function FestivalCountdown({ className = "", style, slug }) {
    const [days, setDays] = useState(null);
    const [name, setName] = useState("Diwali");

    useEffect(() => {
        if (slug === "diwali" || !slug) {
            const lead = slug === "diwali" ? { name: "Diwali", date: FESTIVAL_SEASON.diwali } : getLeadFestival();
            setName(lead.name);
            setDays(daysUntil(lead.date));
            return;
        }
        // Retired festival slugs fall back to Diwali.
        setName("Diwali");
        setDays(daysUntil(FESTIVAL_SEASON.diwali));
    }, [slug]);

    if (days == null || days < 0) return null;

    return (
        <p className={className} style={style}>
            {days === 0 ? `${name} is today` : `${name} in ${days} day${days === 1 ? "" : "s"}`}
        </p>
    );
}
