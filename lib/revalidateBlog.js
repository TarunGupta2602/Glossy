import { revalidatePath } from "next/cache";
import { normalizeBlogSlug } from "@/lib/seo";

/** Bust ISR for journal + sitemap after admin blog mutations. */
export function revalidateBlogSurfaces(slug) {
    try {
        revalidatePath("/sitemap.xml");
        revalidatePath("/blog");
        revalidatePath("/feed.xml");

        const clean = normalizeBlogSlug(slug || "");
        if (clean) {
            revalidatePath(`/blog/${clean}`);
        }
    } catch (error) {
        console.error("revalidateBlogSurfaces failed:", error);
    }
}
