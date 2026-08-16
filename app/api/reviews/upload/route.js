import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser, isAdminUser } from "@/lib/requireAuth";

export async function POST(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const formData = await req.formData();
        const file = formData.get("file");
        const userId = auth.user.id;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
                { status: 400 }
            );
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        const supabase = getServiceClient();

        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${timestamp}-${random}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
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
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const { searchParams } = new URL(req.url);
        const imagePath = searchParams.get("path");

        if (!imagePath) {
            return NextResponse.json(
                { error: "Image path required" },
                { status: 400 }
            );
        }

        const admin = await isAdminUser(auth.user.id);
        const ownsPath = imagePath.startsWith(`${auth.user.id}/`);
        if (!admin && !ownsPath) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
