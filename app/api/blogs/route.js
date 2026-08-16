import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { normalizeBlogSlug } from "@/lib/seo";
import { getServiceClient } from "@/lib/supabaseServiceClient";

function sanitizeBlogPayload(body) {
    const payload = { ...body };
    if (payload.slug) {
        payload.slug = normalizeBlogSlug(payload.slug);
    }
    return payload;
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

        const { data, error } = await supabase
            .from("blogs")
            .insert([body])
            .select()
            .single();

        if (error) {
            console.error("POST /api/blogs insert error:", JSON.stringify(error));
            throw error;
        }

        return NextResponse.json({ success: true, blog: data });
    } catch (error) {
        console.error("POST /api/blogs catch:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
