import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { normalizeBlogSlug } from "@/lib/seo";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { revalidateBlogSurfaces } from "@/lib/revalidateBlog";

function sanitizeBlogPayload(body) {
    const payload = { ...body };
    if (payload.slug) {
        payload.slug = normalizeBlogSlug(payload.slug);
    } else if (payload.title) {
        payload.slug = normalizeBlogSlug(payload.title);
    }
    return payload;
}

function withoutOptionalCmsFields(payload) {
    const next = { ...payload };
    delete next.author_bio;
    delete next.content_sections;
    return next;
}

function isMissingColumnError(error) {
    const msg = String(error?.message || error?.details || "");
    return /author_bio|content_sections|schema cache|Could not find/i.test(msg);
}

// GET: Fetch all blogs (admin only)
export async function GET(req) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const supabase = getServiceClient();
        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .order("date_posted", { ascending: false });

        if (error) {
            console.error("GET /api/blogs error:", JSON.stringify(error));
            throw error;
        }

        return NextResponse.json({ success: true, blogs: data });
    } catch (error) {
        console.error("GET /api/blogs catch:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST: Create a new blog
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const supabase = getServiceClient();
        const body = sanitizeBlogPayload(await request.json());

        if (!body.slug) {
            return NextResponse.json(
                { success: false, error: "A URL slug is required before publishing." },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("blogs")
            .insert([body])
            .select()
            .single();

        if (error && isMissingColumnError(error)) {
            const fallback = withoutOptionalCmsFields(body);
            const retry = await supabase
                .from("blogs")
                .insert([fallback])
                .select()
                .single();
            if (retry.error) {
                console.error("POST /api/blogs insert error:", JSON.stringify(retry.error));
                throw retry.error;
            }
            revalidateBlogSurfaces(retry.data?.slug || body.slug);
            return NextResponse.json({
                success: true,
                blog: retry.data,
                warning:
                    "Saved without author_bio/content_sections — run supabase/migrations/20260316_blog_content_sections.sql",
            });
        }

        if (error) {
            console.error("POST /api/blogs insert error:", JSON.stringify(error));
            throw error;
        }

        revalidateBlogSurfaces(data?.slug || body.slug);

        return NextResponse.json({ success: true, blog: data });
    } catch (error) {
        console.error("POST /api/blogs catch:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
