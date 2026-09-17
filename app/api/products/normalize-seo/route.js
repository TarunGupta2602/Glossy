import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import {
    buildProductSeo,
    enrichProductDescription,
    scrubCategoryTypos,
} from "@/lib/seo";
import { getDisplayCategoryName } from "@/lib/categoryLanding";
import { revalidatePath } from "next/cache";

/**
 * POST /api/products/normalize-seo
 * Admin-only full SEO rewrite for ranking PDPs:
 * - Fix Statement Piecess category
 * - Rebuild meta_title / meta_description / meta_keywords / image_alt
 * - Enrich thin descriptions with commercial SEO close
 * - Fill empty features[] with kind-based bullets
 *
 * Body: { force?: boolean } — force=true overwrites existing SEO fields (default true)
 */
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        let force = true;
        try {
            const body = await request.json();
            if (typeof body?.force === "boolean") force = body.force;
        } catch {
            // empty body OK
        }

        const supabase = getServiceClient();

        const categoryFixes = [];
        const { data: categories, error: catErr } = await supabase
            .from("categories")
            .select("id, name, slug, meta_title, meta_description, meta_keywords");

        if (catErr) throw catErr;

        for (const cat of categories || []) {
            const payload = {};
            const nextName = scrubCategoryTypos(String(cat.name || "").trim());
            if (nextName && nextName !== cat.name) payload.name = nextName;

            const slugLower = String(cat.slug || "").toLowerCase().replace(/^-+/, "");
            if (slugLower.includes("piecess") || slugLower === "statement-pieces") {
                payload.slug = "statement-pieces";
            } else if (String(cat.slug || "").startsWith("-")) {
                payload.slug = slugLower || "statement-pieces";
            }

            for (const key of ["meta_title", "meta_description", "meta_keywords"]) {
                const raw = cat[key];
                if (!raw) continue;
                const next = scrubCategoryTypos(raw);
                if (next !== raw) payload[key] = next;
            }

            if (Object.keys(payload).length === 0) continue;

            const { error } = await supabase
                .from("categories")
                .update(payload)
                .eq("id", cat.id);

            if (error) {
                categoryFixes.push({ id: cat.id, name: cat.name, error: error.message });
            } else {
                categoryFixes.push({
                    id: cat.id,
                    from: cat.name,
                    to: payload.name || cat.name,
                    slug: payload.slug || cat.slug,
                    ok: true,
                });
            }
        }

        const { data: products, error } = await supabase
            .from("products")
            .select(
                "id, name, slug, description, price, plating, meta_title, meta_description, meta_keywords, image_alt, categories(name, slug)"
            )
            .order("created_at", { ascending: true });

        if (error) throw error;

        const changes = [];
        const failures = [];
        let updated = 0;

        for (const product of products || []) {
            const categoryName = getDisplayCategoryName(
                product.categories,
                "Jewellery"
            );
            const autoSeo = buildProductSeo({
                name: product.name,
                description: product.description,
                categoryName,
                price: product.price,
                imageAlt: product.image_alt,
                plating: product.plating,
            });

            const nextDescription = enrichProductDescription({
                name: product.name,
                description: product.description,
                categoryName,
                price: product.price,
                plating: product.plating,
            });

            const payload = {};

            if (force || !product.meta_title?.trim() || product.meta_title.length > 42 || /piecess|\|/i.test(product.meta_title)) {
                if (autoSeo.meta_title !== product.meta_title) {
                    payload.meta_title = autoSeo.meta_title;
                }
            }

            if (force || !product.meta_description?.trim() || product.meta_description.length < 120 || /piecess/i.test(product.meta_description || "")) {
                if (autoSeo.meta_description !== product.meta_description) {
                    payload.meta_description = autoSeo.meta_description;
                }
            }

            if (force || !product.meta_keywords?.trim() || /piecess/i.test(product.meta_keywords || "") || (product.meta_keywords || "").split(",").length < 6) {
                if (autoSeo.meta_keywords !== product.meta_keywords) {
                    payload.meta_keywords = autoSeo.meta_keywords;
                }
            }

            if (force || !product.image_alt?.trim() || /piecess/i.test(product.image_alt || "")) {
                if (autoSeo.image_alt !== product.image_alt) {
                    payload.image_alt = autoSeo.image_alt;
                }
            }

            if (nextDescription && nextDescription !== product.description) {
                payload.description = nextDescription;
            }

            if (Object.keys(payload).length === 0) continue;

            payload.updated_at = new Date().toISOString();

            const { error: upErr } = await supabase
                .from("products")
                .update(payload)
                .eq("id", product.id);

            if (upErr) {
                failures.push({ id: product.id, name: product.name, error: upErr.message });
                continue;
            }

            updated += 1;
            changes.push({
                id: product.id,
                name: product.name,
                slug: product.slug || null,
                fromTitle: product.meta_title,
                toTitle: payload.meta_title || product.meta_title,
                fields: Object.keys(payload).filter((k) => k !== "updated_at"),
            });
        }

        try {
            revalidatePath("/sitemap.xml");
            revalidatePath("/shop");
            revalidatePath("/earrings");
            revalidatePath("/necklaces");
            revalidatePath("/collection");
            for (const change of changes) {
                if (change.slug) revalidatePath(`/product/${change.slug}`);
            }
            for (const fix of categoryFixes.filter((c) => c.ok && c.slug)) {
                const clean = String(fix.slug).replace(/^-+/, "");
                if (clean) revalidatePath(`/shop/${clean}`);
            }
        } catch (revalidateError) {
            console.error("normalize-seo revalidate:", revalidateError);
        }

        return NextResponse.json({
            success: true,
            force,
            scanned: (products || []).length,
            updated,
            skipped: (products || []).length - updated - failures.length,
            categoriesFixed: categoryFixes.filter((c) => c.ok).length,
            categoryFixes,
            changes,
            failures,
        });
    } catch (err) {
        console.error("normalize-seo error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Normalize failed" },
            { status: 500 }
        );
    }
}
