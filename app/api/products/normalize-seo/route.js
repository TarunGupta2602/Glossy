import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import {
    buildProductSeo,
    scrubCategoryTypos,
    truncateMetaDescription,
    truncateMetaTitle,
} from "@/lib/seo";
import { getDisplayCategoryName } from "@/lib/categoryLanding";

/**
 * POST /api/products/normalize-seo
 * Admin-only:
 * - Fix "Statement Piecess" category name/slug
 * - Shorten product meta_title to ≤42 (name-based)
 * - Scrub Piecess from other SEO fields
 */
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

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
                "id, name, description, price, meta_title, meta_description, meta_keywords, image_alt, categories(name, slug)"
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
            });

            const nextTitle = truncateMetaTitle(
                product.meta_title || product.name || autoSeo.meta_title,
                42
            );
            // Prefer rebuilt short title from name when current title is long or has typo/category suffix
            const preferredTitle =
                !product.meta_title?.trim() ||
                product.meta_title.length > 42 ||
                /piecess/i.test(product.meta_title) ||
                /\|\s*/.test(product.meta_title)
                    ? autoSeo.meta_title
                    : nextTitle;

            const payload = {};

            if (preferredTitle && preferredTitle !== product.meta_title) {
                payload.meta_title = preferredTitle;
            }

            if (product.meta_description) {
                const scrubbed = scrubCategoryTypos(product.meta_description);
                const nextDesc = truncateMetaDescription(scrubbed, 160);
                if (nextDesc !== product.meta_description) {
                    payload.meta_description = nextDesc;
                }
            }

            if (product.meta_keywords) {
                const nextKw = scrubCategoryTypos(product.meta_keywords);
                if (nextKw !== product.meta_keywords) {
                    payload.meta_keywords = nextKw;
                }
            }

            if (product.image_alt) {
                const nextAlt = scrubCategoryTypos(product.image_alt);
                if (nextAlt !== product.image_alt) {
                    payload.image_alt = nextAlt;
                }
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
                fromTitle: product.meta_title,
                toTitle: payload.meta_title || product.meta_title,
                fields: Object.keys(payload).filter((k) => k !== "updated_at"),
            });
        }

        return NextResponse.json({
            success: true,
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
