import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { guardAdmin } from "@/lib/requireAdmin";
import { applyProductDetailsDefaults } from "@/lib/productDefaults";
import { buildProductSeo, generateProductSlug } from "@/lib/seo";

/** Only columns we intentionally autofill — never send relations or unknown keys. */
const ALLOWED_UPDATE_KEYS = [
    "material",
    "plating",
    "care_instructions",
    "weight",
    "size_info",
    "stock_count",
    "original_price",
    "description",
    "is_new",
    "is_bestseller",
    "meta_title",
    "meta_description",
    "meta_keywords",
    "image_alt",
    "slug",
];

function pickAllowed(details) {
    const payload = {};
    for (const key of ALLOWED_UPDATE_KEYS) {
        if (details[key] !== undefined) payload[key] = details[key];
    }
    return payload;
}

function isMissingColumnError(message = "") {
    return /could not find|schema cache|column .* does not exist/i.test(message);
}

function missingColumnName(message = "") {
    const match =
        message.match(/Could not find the '([^']+)' column/i) ||
        message.match(/column ["']?(\w+)["']? of relation/i) ||
        message.match(/column ["']?(\w+)["']? does not exist/i);
    return match?.[1] || null;
}

/**
 * Update one product; if a column is missing in DB, drop it and retry.
 */
async function updateProductResilient(supabase, id, payload) {
    let attempt = { ...payload };
    const dropped = [];

    for (let i = 0; i < 8; i += 1) {
        if (!Object.keys(attempt).length) {
            return { error: "No updatable columns left after schema retries", dropped };
        }

        const { error } = await supabase.from("products").update(attempt).eq("id", id);
        if (!error) return { error: null, dropped, saved: attempt };

        const msg = error.message || "";
        if (!isMissingColumnError(msg)) {
            return { error: msg, dropped };
        }

        const col = missingColumnName(msg);
        if (!col || !(col in attempt)) {
            // Unknown missing-column shape — strip optional detail cols and retry once more path
            const optional = ["weight", "size_info", "care_instructions", "material", "plating"];
            let removed = false;
            for (const key of optional) {
                if (key in attempt) {
                    delete attempt[key];
                    dropped.push(key);
                    removed = true;
                }
            }
            if (!removed) return { error: msg, dropped };
            continue;
        }

        delete attempt[col];
        dropped.push(col);
    }

    return { error: "Too many schema retries", dropped };
}

/**
 * POST /api/products/autofill
 * Fills empty product detail fields using smart defaults from name/category/price.
 */
export async function POST(req) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const supabase = getServiceClient();
        const { data: products, error } = await supabase
            .from("products")
            .select("*, categories(name, id, slug)")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const rows = products || [];
        const changed = [];
        const failures = [];
        let skipped = 0;
        const droppedColumns = new Set();

        for (const product of rows) {
            const { payload: details, filled } = applyProductDetailsDefaults(
                {},
                product
            );

            const categoryName = product.categories?.name;
            if (product.name) {
                const autoSeo = buildProductSeo({
                    name: product.name,
                    description: details.description || product.description,
                    categoryName,
                    price: product.price,
                    imageAlt: product.image_alt,
                });
                if (!product.meta_title?.trim()) {
                    details.meta_title = autoSeo.meta_title;
                    filled.push("meta_title");
                }
                if (!product.meta_description?.trim()) {
                    details.meta_description = autoSeo.meta_description;
                    filled.push("meta_description");
                }
                if (!product.meta_keywords?.trim()) {
                    details.meta_keywords = autoSeo.meta_keywords;
                    filled.push("meta_keywords");
                }
                if (!product.image_alt?.trim()) {
                    details.image_alt = autoSeo.image_alt;
                    filled.push("image_alt");
                }
                if (!product.slug?.trim()) {
                    details.slug = generateProductSlug(product.name, product.id);
                    filled.push("slug");
                }
            }

            const updatePayload = pickAllowed(details);
            const updateKeys = Object.keys(updatePayload);

            if (!updateKeys.length) {
                skipped += 1;
                continue;
            }

            const result = await updateProductResilient(
                supabase,
                product.id,
                updatePayload
            );

            if (result.dropped?.length) {
                result.dropped.forEach((c) => droppedColumns.add(c));
            }

            if (result.error) {
                failures.push({
                    id: product.id,
                    name: product.name,
                    error: result.error,
                });
            } else {
                const savedKeys = Object.keys(result.saved || updatePayload);
                changed.push({
                    id: product.id,
                    name: product.name,
                    filled: savedKeys,
                });
            }
        }

        return NextResponse.json({
            success: true,
            scanned: rows.length,
            updated: changed.length,
            skipped,
            failed: failures.length,
            changes: changed,
            failures,
            note:
                droppedColumns.size > 0
                    ? `Some DB columns were missing and skipped: ${[...droppedColumns].join(", ")}. Run the matching supabase/*.sql migrations if you need those fields.`
                    : null,
        });
    } catch (error) {
        console.error("POST /api/products/autofill error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Autofill failed" },
            { status: 500 }
        );
    }
}
