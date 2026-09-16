import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { normalizeBlogSlug } from "@/lib/seo";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { revalidateBlogSurfaces } from "@/lib/revalidateBlog";

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

// GET: Fetch single blog by ID (admin only)
export async function GET(request, { params }) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const supabase = getServiceClient();
        const { id } = await params;

        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("GET /api/blogs/[id] error:", JSON.stringify(error));
            throw error;
        }

        return NextResponse.json({ success: true, blog: data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PATCH: Update a blog
export async function PATCH(request, { params }) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const supabase = getServiceClient();
        const { id } = await params;
        const body = await request.json();
        if (body.slug) {
            body.slug = normalizeBlogSlug(body.slug);
        }

        const { data, error } = await supabase
            .from("blogs")
            .update({ ...body, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error && isMissingColumnError(error)) {
            const fallback = withoutOptionalCmsFields(body);
            const retry = await supabase
                .from("blogs")
                .update({ ...fallback, updated_at: new Date().toISOString() })
                .eq("id", id)
                .select()
                .single();
            if (retry.error) {
                console.error("PATCH /api/blogs/[id] error:", JSON.stringify(retry.error));
                throw retry.error;
            }
            revalidateBlogSurfaces(retry.data?.slug || body.slug);
            return NextResponse.json({
                success: true,
                blog: retry.data,
                warning:
                    "Updated without author_bio/content_sections — run supabase/migrations/20260316_blog_content_sections.sql",
            });
        }

        if (error) {
            console.error("PATCH /api/blogs/[id] error:", JSON.stringify(error));
            throw error;
        }

        revalidateBlogSurfaces(data?.slug || body.slug);

        return NextResponse.json({ success: true, blog: data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE: Delete a blog
export async function DELETE(request, { params }) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const supabase = getServiceClient();
        const { id } = await params;

        const { data: existing } = await supabase
            .from("blogs")
            .select("slug, image")
            .eq("id", id)
            .maybeSingle();

        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get("imageUrl") || existing?.image;
        if (imageUrl) {
            try {
                const parsedUrl = new URL(imageUrl);
                const pathParts = parsedUrl.pathname.split(
                    "/storage/v1/object/public/blog-images/"
                );
                if (pathParts[1]) {
                    await supabase.storage
                        .from("blog-images")
                        .remove([decodeURIComponent(pathParts[1])]);
                }
            } catch (e) {
                console.error("Error deleting blog image:", e);
            }
        }

        const { error } = await supabase.from("blogs").delete().eq("id", id);

        if (error) {
            console.error("DELETE /api/blogs/[id] error:", JSON.stringify(error));
            throw error;
        }

        revalidateBlogSurfaces(existing?.slug);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
