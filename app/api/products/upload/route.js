import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

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

function getStoragePath(imageUrl) {
    try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split(`/storage/v1/object/public/${BUCKET}/`);
        return pathParts[1] ? decodeURIComponent(pathParts[1]) : null;
    } catch {
        return null;
    }
}

// POST: Upload image to product-images bucket (server-side to bypass client StorageApiError)
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const path = formData.get("path");
        const oldImageUrl = formData.get("oldImageUrl");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        if (!path) {
            return NextResponse.json(
                { success: false, error: "No storage path provided" },
                { status: 400 }
            );
        }

        const supabase = getStorageClient();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Storage upload error:", JSON.stringify(uploadError));
            throw uploadError;
        }

        const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(path);

        if (oldImageUrl) {
            const oldPath = getStoragePath(oldImageUrl);
            if (oldPath) {
                await supabase.storage.from(BUCKET).remove([oldPath]);
            }
        }

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
        });
    } catch (error) {
        console.error("POST /api/products/upload error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE: Remove image from product-images bucket
export async function DELETE(request) {
    try {
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json(
                { success: false, error: "No image URL provided" },
                { status: 400 }
            );
        }

        const storagePath = getStoragePath(imageUrl);
        if (!storagePath) {
            return NextResponse.json(
                { success: false, error: "Invalid image URL" },
                { status: 400 }
            );
        }

        const supabase = getStorageClient();
        const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/products/upload error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
