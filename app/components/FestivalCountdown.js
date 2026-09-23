"use client";

import { useEffect, useState } from "react";
import { daysUntil, getLeadFestival } from "@/lib/festivalSeason";

export default function FestivalCountdown({ className = "" }) {
    const [days, setDays] = useState(null);
    const [name, setName] = useState("Diwali");

    useEffect(() => {
        const lead = getLeadFestival();
        setName(lead.name);
        setDays(daysUntil(lead.date));
    }, []);

    if (days == null || days < 0) return null;

    return (
        <p className={className}>
            {days === 0 ? `${name} is today` : `${name} in ${days} day${days === 1 ? "" : "s"}`}
        </p>
    );
}
