import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { guardAdmin } from "@/lib/requireAdmin";
import { auditProductMrp } from "@/lib/mrpAudit";
import { revalidateStorefront } from "@/lib/revalidateSite";
import { revalidatePath } from "next/cache";
import { getProductPath } from "@/lib/seo";

/**
 * POST /api/products/audit-mrp
 * Clear synthetic / inflated original_price values (autofill ~33% OFF pattern).
 * Body: { dryRun?: boolean } — dryRun=true reports only (default false).
 */
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const body = await request.json().catch(() => ({}));
        const dryRun = Boolean(body?.dryRun);

        const supabase = getServiceClient();
        const { data: products, error } = await supabase
            .from("products")
            .select("id, name, slug, price, original_price");

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const cleared = [];
        const kept = [];
        const noop = [];

        for (const product of products || []) {
            const result = auditProductMrp(product);
            if (result.action === "clear") {
                cleared.push({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: result.price,
                    original_price: result.original_price,
                    discountPercent: result.discountPercent,
                });
            } else if (result.action === "keep") {
                kept.push({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: result.price,
                    original_price: result.original_price,
                    discountPercent: result.discountPercent,
                });
            } else {
                noop.push(product.id);
            }
        }

        if (!dryRun && cleared.length) {
            const ids = cleared.map((c) => c.id);
            const { error: updateError } = await supabase
                .from("products")
                .update({ original_price: null })
                .in("id", ids);

            if (updateError) {
                return NextResponse.json(
                    { success: false, error: updateError.message, preview: { cleared: cleared.length } },
                    { status: 500 }
                );
            }

            try {
                revalidateStorefront(cleared.map((c) => getProductPath(c)).filter(Boolean));
                revalidatePath("/", "layout");
            } catch (revalidateError) {
                console.error("audit-mrp revalidate:", revalidateError);
            }
        }

        return NextResponse.json({
            success: true,
            dryRun,
            scanned: (products || []).length,
            cleared: cleared.length,
            kept: kept.length,
            alreadyClean: noop.length,
            clearedSamples: cleared.slice(0, 15),
            keptSamples: kept.slice(0, 15),
            message: dryRun
                ? `Dry run: would clear ${cleared.length} synthetic MRPs, keep ${kept.length}.`
                : `Cleared ${cleared.length} synthetic MRPs. Kept ${kept.length} real compare-at prices.`,
        });
    } catch (error) {
        console.error("POST /api/products/audit-mrp error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
