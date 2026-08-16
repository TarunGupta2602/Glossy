/**
 * Lightweight HTML sanitizer for trusted markdown output.
 * Avoids isomorphic-dompurify/jsdom, which can crash Next.js on Vercel.
 */
export function sanitizeHtml(html) {
    if (!html) return "";

    return String(html)
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
        .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
        .replace(/<embed\b[^>]*>/gi, "")
        .replace(/<link\b[^>]*>/gi, "")
        .replace(/<meta\b[^>]*>/gi, "")
        .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\s(href|src|xlink:href)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, ' $1="#"')
        .replace(/\s(href|src|xlink:href)\s*=\s*javascript:[^\s>]*/gi, ' $1="#"');
}
