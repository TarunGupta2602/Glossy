import { getProductPath } from "@/lib/seo";
import { revalidateStorefront } from "@/lib/revalidateSite";

/** Bust ISR for PDP + shop surfaces after admin product mutations. */
export function revalidateProductSurfaces(product) {
    try {
        const extra = [];

        if (product?.slug || product?.id) {
            extra.push(getProductPath(product));
        }

        const catSlug = product?.categories?.slug;
        if (catSlug) {
            const clean = String(catSlug).replace(/^-+/, "");
            if (clean) extra.push(`/shop/${clean}`);
        }

        revalidateStorefront(extra);
    } catch (error) {
        console.error("revalidateProductSurfaces failed:", error);
    }
}
