import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const oldImageUrl = formData.get('oldImageUrl');

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

        // Delete old image if exists
        if (oldImageUrl) {
            const oldFileName = oldImageUrl.split('/').pop();
            console.log("Deleting old image:", oldFileName);
            const { error: deleteError } = await supabaseService
                .storage
                .from('category-images')
                .remove([oldFileName]);
            if (deleteError) {
                console.error("Delete error:", deleteError);
                // Continue with upload even if delete fails
            }
        }

        // Upload new image
        const fileName = `category-${Date.now()}-${file.name}`;
        console.log("Uploading new image:", fileName);

        const { error: uploadError } = await supabaseService
            .storage
            .from('category-images')
            .upload(fileName, file);

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Get public URL
        const { data } = supabaseService
            .storage
            .from('category-images')
            .getPublicUrl(fileName);

        return NextResponse.json({ 
            success: true, 
            publicUrl: data.publicUrl 
        });

    } catch (error) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
