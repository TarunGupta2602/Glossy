import DOMPurify from "isomorphic-dompurify";

/** Sanitize HTML from markdown before dangerouslySetInnerHTML. */
export function sanitizeHtml(html) {
    if (!html) return "";
    return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
    });
}
