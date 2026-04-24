import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getBlogServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Missing Supabase URL or Service Role Key");
    }

    return createClient(url, key, {
        db: { schema: "public" },
        auth: { persistSession: false },
    });
}

// GET: Fetch single blog by ID
export async function GET(request, { params }) {
    try {
        const supabase = getBlogServiceClient();
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
        const supabase = getBlogServiceClient();
        const { id } = await params;
        const body = await request.json();

        const { data, error } = await supabase
            .from("blogs")
            .update({ ...body, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("PATCH /api/blogs/[id] error:", JSON.stringify(error));
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

// DELETE: Delete a blog
export async function DELETE(request, { params }) {
    try {
        const supabase = getBlogServiceClient();
        const { id } = await params;

        // Clean up image from storage if provided
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get("imageUrl");
        if (imageUrl) {
            try {
                const parsedUrl = new URL(imageUrl);
                const pathParts = parsedUrl.pathname.split("/storage/v1/object/public/blog-images/");
                if (pathParts[1]) {
                    await supabase.storage.from("blog-images").remove([decodeURIComponent(pathParts[1])]);
                }
            } catch (e) {
                console.error("Error deleting blog image:", e);
            }
        }

        const { error } = await supabase
            .from("blogs")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("DELETE /api/blogs/[id] error:", JSON.stringify(error));
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
