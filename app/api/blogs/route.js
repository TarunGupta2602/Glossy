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

// GET: Fetch all blogs
export async function GET() {
    try {
        const supabase = getBlogServiceClient();
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
        const supabase = getBlogServiceClient();
        const body = await request.json();

        console.log("POST /api/blogs body keys:", Object.keys(body));

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
