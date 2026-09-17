import { revalidatePath } from "next/cache";

/** Core storefront surfaces that must refresh together after CMS / SEO edits. */
export const CORE_STOREFRONT_PATHS = [
    "/",
    "/shop",
    "/earrings",
    "/necklaces",
    "/bracelets",
    "/rings",
    "/collection",
    "/sitemap.xml",
];

/**
 * Bust ISR for homepage + category landings.
 * Homepage must always be included — it is the strongest internal-link hub.
 */
export function revalidateStorefront(extraPaths = []) {
    const paths = [...CORE_STOREFRONT_PATHS, ...extraPaths];
    const seen = new Set();

    for (const path of paths) {
        if (!path || seen.has(path)) continue;
        seen.add(path);
        try {
            revalidatePath(path);
        } catch (error) {
            console.error(`revalidatePath(${path}) failed:`, error);
        }
    }

    return [...seen];
}
