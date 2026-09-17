import { normalizeBlogSlug } from "@/lib/seo";

export function looksLikeHtml(content) {
    const value = String(content || "").trim();
    if (!value) return false;
    return /^</.test(value) || /<\/(p|h2|h3|div|ul|ol)>/i.test(value);
}

export function extractHtmlHeadings(html) {
    const items = [];
    const re = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
    let match;
    while ((match = re.exec(String(html || "")))) {
        const depth = Number(match[1]);
        const text = String(match[3] || "")
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
        if (!text) continue;
        items.push({
            text,
            depth,
            slug: normalizeBlogSlug(text),
        });
    }
    return items;
}

/**
 * Normalize CMS HTML so headings get ids (TOC), first paragraph reads as a lead,
 * and absolute same-site links become relative paths for cleaner interlinking.
 */
export function enhanceBlogHtml(html) {
    let value = String(html || "");
    if (!value.trim()) return value;

    // Absolute site URLs → relative
    value = value.replace(
        /https?:\/\/(?:www\.)?theluxejewels\.in(\/[^"'\s>]*)/gi,
        "$1"
    );

    // Ensure h2/h3 have stable ids for TOC + anchor jumps
    value = value.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level, attrs, inner) => {
        const text = String(inner)
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
        const id = normalizeBlogSlug(text) || `section-${level}`;
        const cleanedAttrs = String(attrs || "")
            .replace(/\s*id\s*=\s*("|'|)[^"']*\1/i, "")
            .replace(/\s*class\s*=\s*("|'|)[^"']*\1/i, "")
            .trim();
        return `<h${level} id="${id}" class="scroll-mt-24"${cleanedAttrs ? ` ${cleanedAttrs}` : ""}>${inner}</h${level}>`;
    });

    // First <p> → lead for stronger opening hierarchy
    let leadApplied = false;
    value = value.replace(/<p(\s[^>]*)?>/i, (full) => {
        if (leadApplied) return full;
        leadApplied = true;
        if (/class\s*=/.test(full)) {
            return full.replace(/class\s*=\s*("|'|)([^"']*)\1/i, (_, q, cls) => {
                return `class=${q}${cls} blog-lead${q}`;
            });
        }
        return `<p class="blog-lead">`;
    });

    return value;
}

/**
 * If the body has almost no shop/category links, inject a short interlink callout
 * after the first heading (or at the end).
 */
export function ensureBlogInterlinks(html, { shopLinks = [], blogLinks = [] } = {}) {
    const value = String(html || "");
    if (!value.trim()) return value;

    const hasShop =
        /href=["']\/(shop|earrings|necklaces|bracelets|rings|gifts|product)\b/i.test(
            value
        ) || /href=["']https?:\/\/(?:www\.)?theluxejewels\.in\/(shop|earrings)/i.test(value);

    if (hasShop && blogLinks.length === 0) return value;

    const shopBits = (shopLinks.length
        ? shopLinks
        : [
              { href: "/earrings", label: "anti-tarnish earrings" },
              { href: "/necklaces", label: "everyday necklaces" },
              { href: "/bracelets", label: "daily-wear bracelets" },
              { href: "/shop?sort=popular", label: "bestsellers" },
          ]
    )
        .slice(0, 4)
        .map((l) => `<a href="${l.href}">${l.label}</a>`)
        .join(" · ");

    const blogBits = (blogLinks || [])
        .slice(0, 3)
        .map((l) => `<a href="${l.href}">${l.label}</a>`)
        .join(" · ");

    const callout = `
<aside class="blog-inline-cta not-prose my-8 rounded-2xl border border-[#efeae4] bg-[#fdfbf7] px-5 py-5 sm:px-6">
  <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b89a6a] mb-2">Keep exploring</p>
  <p class="text-[15px] text-[#6b6560] leading-relaxed mb-0">
    Shop ${shopBits}${blogBits ? ` · Read next: ${blogBits}` : ""}.
  </p>
</aside>`;

    if (!hasShop) {
        const withCallout = value.replace(
            /<\/h2>/i,
            (m) => `${m}\n${callout}`
        );
        if (withCallout !== value) return withCallout;
        return `${value}\n${callout}`;
    }

    if (blogBits && !/href=["']\/blog\//i.test(value)) {
        return `${value}\n${callout}`;
    }

    return value;
}
