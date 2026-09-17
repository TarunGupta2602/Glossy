import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { getServiceClient } from "@/lib/supabaseServiceClient";

const BUCKET = "product-images";

/**
 * POST /api/admin/gallery-detail-crops
 *
 * Accepts pre-cropped images (from real main photos) and attaches them to
 * product galleries. Avoids server-side sharp so uploads stay reliable.
 *
 * Body:
 * {
 *   items: [{ product_id: string, image_base64: string, filename?: string }]
 * }
 */
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const body = await request.json();
        const items = Array.isArray(body?.items) ? body.items : [];
        if (!items.length) {
            return NextResponse.json(
                { success: false, error: "items[] required" },
                { status: 400 }
            );
        }

        const supabase = getServiceClient();
        const results = [];
        let created = 0;
        let skipped = 0;
        let failed = 0;

        for (const item of items.slice(0, 20)) {
            const productId = item?.product_id;
            const b64 = item?.image_base64;
            if (!productId || !b64) {
                failed += 1;
                results.push({ product_id: productId, status: "error", error: "missing fields" });
                continue;
            }

            try {
                const { count, error: countErr } = await supabase
                    .from("product_images")
                    .select("id", { count: "exact", head: true })
                    .eq("product_id", productId);
                if (countErr) throw countErr;
                if ((count || 0) >= 2) {
                    skipped += 1;
                    results.push({ product_id: productId, status: "skipped" });
                    continue;
                }

                const buffer = Buffer.from(
                    String(b64).replace(/^data:image\/\w+;base64,/, ""),
                    "base64"
                );
                if (buffer.length < 1000) throw new Error("image too small");

                const storagePath = `${productId}/gallery-detail-${Date.now()}.webp`;
                const { error: uploadError } = await supabase.storage
                    .from(BUCKET)
                    .upload(storagePath, buffer, {
                        contentType: "image/webp",
                        upsert: false,
                    });
                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(storagePath);

                const { error: insertError } = await supabase
                    .from("product_images")
                    .insert({
                        product_id: productId,
                        image_url: urlData.publicUrl,
                    });
                if (insertError) throw insertError;

                created += 1;
                results.push({
                    product_id: productId,
                    status: "created",
                    url: urlData.publicUrl,
                });
            } catch (err) {
                failed += 1;
                results.push({
                    product_id: productId,
                    status: "error",
                    error: err.message || String(err),
                });
            }
        }

        return NextResponse.json({
            success: true,
            created,
            skipped,
            failed,
            results,
        });
    } catch (error) {
        console.error("gallery-detail-crops error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed" },
            { status: 500 }
        );
    }
}
