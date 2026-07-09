import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const userId = formData.get("userId");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        const supabase = getServiceClient();

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${timestamp}-${random}.${fileExt}`;

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("review-images")
            .upload(fileName, file, {
                upsert: false,
                contentType: file.type,
            });

        if (uploadError) {
            console.error("Upload Error:", uploadError);
            return NextResponse.json(
                { error: uploadError.message || "Failed to upload image" },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("review-images")
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            imageUrl: urlData.publicUrl,
            path: fileName,
        });
    } catch (error) {
        console.error("Review Image Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const imagePath = searchParams.get("path");

        if (!imagePath) {
            return NextResponse.json(
                { error: "Image path required" },
                { status: 400 }
            );
        }

        const supabase = getServiceClient();

        const { error } = await supabase.storage
            .from("review-images")
            .remove([imagePath]);

        if (error) {
            console.error("Delete Error:", error);
            return NextResponse.json(
                { error: error.message || "Failed to delete image" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Image deleted successfully",
        });
    } catch (error) {
        console.error("Review Image Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
