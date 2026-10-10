import { PROMO_SHORT } from "@/lib/promo";

/**
 * 2026 festive window. Diwali-led after Navratri has ended.
 */
export const FESTIVAL_SEASON = {
    start: "2026-09-15",
    end: "2026-11-15",
    diwali: "2026-11-08",
};

function atNoon(iso) {
    return new Date(`${iso}T12:00:00+05:30`);
}

export function getFestivalNow(now = new Date()) {
    return now;
}

export function isFestivalSeason(now = new Date()) {
    const t = now.getTime();
    return t >= atNoon(FESTIVAL_SEASON.start).getTime() && t <= atNoon(FESTIVAL_SEASON.end).getTime();
}

function istDay(now = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now);
}

/** Whole days from today in India to an ISO date. Negative after that date. */
export function daysUntil(iso, now = new Date()) {
    const start = atNoon(istDay(now)).getTime();
    const end = atNoon(iso).getTime();
    return Math.round((end - start) / 86400000);
}

/** Always lead Diwali — Navratri edit is retired for this season. */
export function getLeadFestival() {
    return {
        slug: "diwali",
        name: "Diwali",
        href: "/festive/diwali",
        date: FESTIVAL_SEASON.diwali,
    };
}

export function getSeasonPhase(now = new Date()) {
    const toDiwali = daysUntil(FESTIVAL_SEASON.diwali, now);
    if (toDiwali <= 3 && toDiwali >= 0) return "last_minute";
    if (toDiwali > 14) return "early";
    return "peak";
}

export function getFestivalHero(now = new Date()) {
    const lead = getLeadFestival();
    const days = daysUntil(lead.date, now);
    const phase = getSeasonPhase(now);

    return {
        active: isFestivalSeason(now),
        lead,
        daysLeft: days,
        phase,
        eyebrow:
            days > 0
                ? `${lead.name} in ${days} day${days === 1 ? "" : "s"}`
                : days === 0
                  ? `${lead.name} is today`
                  : PROMO_SHORT,
        title: "Diwali edit — light up in anti-tarnish gold",
        titleAccent: "anti-tarnish gold",
        body:
            phase === "last_minute"
                ? `Last-minute gifts still ship pan-India. ${PROMO_SHORT}.`
                : phase === "early"
                  ? `Shop early so gifts arrive before the puja. ${PROMO_SHORT}.`
                  : `Office to puja — gold-look pieces she can wear after. ${PROMO_SHORT}.`,
        image: "/festive/diwali-festive-portrait.jpg",
        primary: { href: lead.href, label: `Shop ${lead.name}` },
        secondary: { href: "/gifts/under-499", label: "Gifts under ₹499" },
    };
}

export function getFestivalAnnouncements(now = new Date()) {
    if (!isFestivalSeason(now)) {
        return [
            PROMO_SHORT,
            "Flat ₹50 shipping",
            "Anti-tarnish fashion jewellery",
            "Pan-India delivery from The Luxe Jewels",
        ];
    }

    const lead = getLeadFestival();
    const days = daysUntil(lead.date, now);
    const countdown =
        days > 0
            ? `${lead.name} in ${days} day${days === 1 ? "" : "s"} — shop the edit`
            : days === 0
              ? `${lead.name} is today — shop the edit`
              : `${lead.name} jewellery still ships pan-India`;

    return [
        countdown,
        PROMO_SHORT,
        "Complimentary festive gift wrap on every order",
        "Flat ₹50 shipping",
    ];
}

/** Real remaining units, only when a handful are left. Not a sales-velocity badge. */
export function lowStockCount(product) {
    const stock = Number(product?.stock_count);
    if (!Number.isFinite(stock) || stock <= 0 || stock > 3) return 0;
    return stock;
}

/** Suggest the missing half of a festive pair from what's already in the bag. */
export function getCompleteTheLook(cart = [], now = new Date()) {
    const blob = cart
        .map((item) => `${item.name || ""} ${item.category || ""}`)
        .join(" ")
        .toLowerCase();
    const hasEarring = /earring|stud|hoop|jhumka|drop/.test(blob);
    const hasNecklace = /necklace|pendant|chain|choker|lariat/.test(blob);
    const festive = isFestivalSeason(now);

    if (hasEarring && !hasNecklace) {
        return {
            href: festive ? "/festive/diwali" : "/necklaces",
            label: "Add a necklace to complete the look",
        };
    }
    if (hasNecklace && !hasEarring) {
        return {
            href: festive ? "/festive/diwali" : "/earrings",
            label: "Add earrings to complete the look",
        };
    }
    if (festive) {
        return {
            href: "/festive/diwali",
            label: "Complete your festive look",
        };
    }
    return null;
}
