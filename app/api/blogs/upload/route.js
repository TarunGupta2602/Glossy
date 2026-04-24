import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getStorageClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Missing Supabase URL or Service Role Key");
    }

    return createClient(url, key, {
        auth: { persistSession: false },
    });
}

// POST: Upload image to blog-images bucket
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const oldImageUrl = formData.get("oldImageUrl");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        const supabase = getStorageClient();
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload new image
        const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Storage upload error:", JSON.stringify(uploadError));
            throw uploadError;
        }

        const { data: urlData } = supabase.storage
            .from("blog-images")
            .getPublicUrl(fileName);

        // Delete old image if provided
        if (oldImageUrl) {
            try {
                const url = new URL(oldImageUrl);
                const pathParts = url.pathname.split("/storage/v1/object/public/blog-images/");
                if (pathParts[1]) {
                    await supabase.storage.from("blog-images").remove([decodeURIComponent(pathParts[1])]);
                }
            } catch (e) {
                console.error("Error deleting old image:", e);
            }
        }

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
        });
    } catch (error) {
        console.error("POST /api/blogs/upload error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
