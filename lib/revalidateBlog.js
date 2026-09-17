import { normalizeBlogSlug } from "@/lib/seo";
import { revalidatePath } from "next/cache";
import { revalidateStorefront } from "@/lib/revalidateSite";

/** Bust ISR for journal + sitemap after admin blog mutations. */
export function revalidateBlogSurfaces(slug) {
    try {
        // Homepage links to journal / story surfaces in nav + footer.
        revalidateStorefront(["/blog", "/feed.xml"]);

        const clean = normalizeBlogSlug(slug || "");
        if (clean) {
            revalidatePath(`/blog/${clean}`);
        }
    } catch (error) {
        console.error("revalidateBlogSurfaces failed:", error);
    }
}
