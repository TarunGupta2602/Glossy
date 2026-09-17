import { revalidatePath } from "next/cache";
import { getProductPath } from "@/lib/seo";

/** Bust ISR for PDP + shop surfaces after admin product mutations. */
export function revalidateProductSurfaces(product) {
    try {
        revalidatePath("/sitemap.xml");
        revalidatePath("/shop");
        revalidatePath("/earrings");
        revalidatePath("/necklaces");
        revalidatePath("/bracelets");
        revalidatePath("/rings");
        revalidatePath("/collection");

        if (product?.slug || product?.id) {
            revalidatePath(getProductPath(product));
        }

        const catSlug = product?.categories?.slug;
        if (catSlug) {
            const clean = String(catSlug).replace(/^-+/, "");
            if (clean) revalidatePath(`/shop/${clean}`);
        }
    } catch (error) {
        console.error("revalidateProductSurfaces failed:", error);
    }
}
