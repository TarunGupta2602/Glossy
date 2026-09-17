import { NextResponse } from "next/server";
import sharp from "sharp";
import { guardAdmin } from "@/lib/requireAdmin";
import { getServiceClient } from "@/lib/supabaseServiceClient";

const BUCKET = "product-images";

async function makeDetailCrop(imageUrl) {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`download failed (${res.status})`);
    const input = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(input, { failOn: "none" }).rotate().metadata();
    const w = meta.width || 1000;
    const h = meta.height || 1000;
    const crop = Math.max(200, Math.floor(Math.min(w, h) * 0.62));
    const left = Math.max(0, Math.floor((w - crop) / 2));
    const top = Math.max(0, Math.floor((h - crop) / 2));

    return sharp(input, { failOn: "none" })
        .rotate()
        .extract({ left, top, width: Math.min(crop, w), height: Math.min(crop, h) })
        .resize(1200, 1200, { fit: "cover" })
        .webp({ quality: 84 })
        .toBuffer();
}

/**
 * POST /api/admin/gallery-detail-crops
 * For products with fewer than 2 gallery rows, create a center detail crop
 * from the real main_image and insert it into product_images.
 * Body: { limit?: number, productIds?: string[] }
 */
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        let limit = 80;
        let productIds = null;
        try {
            const body = await request.json();
            if (typeof body?.limit === "number") limit = body.limit;
            if (Array.isArray(body?.productIds)) productIds = body.productIds;
        } catch {
            // empty body OK
        }

        const supabase = getServiceClient();

        let query = supabase
            .from("products")
            .select("id, name, slug, main_image")
            .not("main_image", "is", null)
            .order("created_at", { ascending: true });

        if (productIds?.length) {
            query = query.in("id", productIds);
        } else {
            query = query.limit(limit);
        }

        const { data: products, error } = await query;
        if (error) throw error;

        const results = [];
        let created = 0;
        let skipped = 0;
        let failed = 0;

        for (const product of products || []) {
            try {
                const { data: gallery, error: gErr } = await supabase
                    .from("product_images")
                    .select("id")
                    .eq("product_id", product.id);
                if (gErr) throw gErr;

                if ((gallery || []).length >= 2) {
                    skipped += 1;
                    results.push({ id: product.id, slug: product.slug, status: "skipped" });
                    continue;
                }

                if (!product.main_image) {
                    skipped += 1;
                    results.push({ id: product.id, slug: product.slug, status: "no_main" });
                    continue;
                }

                const cropBuffer = await makeDetailCrop(product.main_image);
                const storagePath = `${product.id}/gallery-detail-${Date.now()}.webp`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET)
                    .upload(storagePath, cropBuffer, {
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
                        product_id: product.id,
                        image_url: urlData.publicUrl,
                    });
                if (insertError) throw insertError;

                created += 1;
                results.push({
                    id: product.id,
                    slug: product.slug,
                    status: "created",
                    url: urlData.publicUrl,
                });
            } catch (err) {
                failed += 1;
                results.push({
                    id: product.id,
                    slug: product.slug,
                    status: "error",
                    error: err.message || String(err),
                });
            }
        }

        return NextResponse.json({
            success: true,
            scanned: (products || []).length,
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
