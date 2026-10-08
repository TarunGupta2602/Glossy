import { PROMO_LABEL } from "@/lib/promo";

/**
 * 2026 festive window. Flip these dates next year — no DB change needed.
 * Sharad Navratri 2026: 11–20 Oct. Diwali 2026: 8 Nov.
 */
export const FESTIVAL_SEASON = {
    start: "2026-09-15",
    end: "2026-11-15",
    navratriStart: "2026-10-11",
    navratriEnd: "2026-10-20",
    diwali: "2026-11-08",
};

export const NAVRATRI_COLOURS = [
    { day: 1, name: "White", hex: "#f4efe6" },
    { day: 2, name: "Red", hex: "#b4232c" },
    { day: 3, name: "Royal blue", hex: "#1e3a6e" },
    { day: 4, name: "Yellow", hex: "#e2b13c" },
    { day: 5, name: "Green", hex: "#2f6b4f" },
    { day: 6, name: "Grey", hex: "#8a847c" },
    { day: 7, name: "Orange", hex: "#d46a1e" },
    { day: 8, name: "Peacock", hex: "#0f6b6b" },
    { day: 9, name: "Pink", hex: "#c45b7a" },
];

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

/** Lead with the next festival; after Navratri ends, lead Diwali. */
export function getLeadFestival(now = new Date()) {
    const navratriOver = now.getTime() > atNoon(FESTIVAL_SEASON.navratriEnd).getTime();
    if (navratriOver) {
        return {
            slug: "diwali",
            name: "Diwali",
            href: "/festive/diwali",
            date: FESTIVAL_SEASON.diwali,
        };
    }
    return {
        slug: "navratri",
        name: "Navratri",
        href: "/festive/navratri",
        date: FESTIVAL_SEASON.navratriStart,
    };
}

export function getSeasonPhase(now = new Date()) {
    const toDiwali = daysUntil(FESTIVAL_SEASON.diwali, now);
    if (toDiwali <= 3 && toDiwali >= 0) return "last_minute";
    if (toDiwali > 14) return "early";
    return "peak";
}

export function getFestivalHero(now = new Date()) {
    const lead = getLeadFestival(now);
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
                  : lead.slug === "navratri"
                    ? "Navratri is on"
                    : `${PROMO_LABEL} this festive season`,
        title: lead.slug === "diwali"
            ? "Diwali edit — light up in anti-tarnish gold"
            : "Navratri edit — nine days, everyday sparkle",
        titleAccent: lead.slug === "diwali" ? "anti-tarnish gold" : "everyday sparkle",
        body:
            phase === "last_minute"
                ? "Last-minute gifts still ship pan-India. Buy 2 Get 1 Free on every order."
                : phase === "early"
                  ? "Shop early so gifts arrive before the puja. Buy 2 Get 1 Free on every order."
                  : "Office to puja, desk to dandiya. Buy 2 Get 1 Free on every order.",
        image:
            lead.slug === "diwali"
                ? "/festive/diwali-festive-portrait.jpg"
                : "/festive/navratri-festive-portrait.jpg",
        primary: { href: lead.href, label: `Shop ${lead.name}` },
        secondary:
            lead.slug === "diwali"
                ? { href: "/festive/navratri", label: "Shop Navratri" }
                : { href: "/festive/diwali", label: "Shop Diwali" },
    };
}

export function getFestivalAnnouncements(now = new Date()) {
    if (!isFestivalSeason(now)) {
        return [
            "Buy 2 Get 1 Free — we add the lowest-priced gift",
            "Shipping ₹50–₹150",
            "Anti-tarnish & waterproof jewellery",
            "Pan-India delivery from The Luxe Jewels",
        ];
    }

    const lead = getLeadFestival(now);
    const days = daysUntil(lead.date, now);
    const countdown =
        days > 0
            ? `${lead.name} in ${days} day${days === 1 ? "" : "s"} — shop the edit`
            : days === 0
              ? `${lead.name} is today — shop the edit`
              : lead.slug === "navratri"
                ? "Navratri is on — shop the edit"
                : `${lead.name} jewellery still ships pan-India`;

    return [
        countdown,
        "Buy 2 Get 1 Free — we add the lowest-priced gift",
        "Complimentary festive gift wrap on every order",
        "Shipping ₹50–₹150",
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
            href: festive ? "/festive/navratri" : "/earrings",
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
