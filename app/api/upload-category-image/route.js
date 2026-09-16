import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { guardAdmin } from "@/lib/requireAdmin";
import { optimizeImageUpload, withWebpPath } from "@/lib/optimizeImageUpload";

export async function POST(req) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const formData = await req.formData();
        const file = formData.get('file');
        const oldImageUrl = formData.get('oldImageUrl');

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const supabaseService = getServiceClient();

        if (oldImageUrl) {
            const oldFileName = oldImageUrl.split('/').pop();
            const { error: deleteError } = await supabaseService
                .storage
                .from('category-images')
                .remove([oldFileName]);
            if (deleteError) {
                console.error("Delete error:", deleteError);
            }
        }

        const arrayBuffer = await file.arrayBuffer();
        const optimized = await optimizeImageUpload(Buffer.from(arrayBuffer), file.type);
        const fileName = withWebpPath(`category-${Date.now()}-${file.name}`, optimized.ext);

        const { error: uploadError } = await supabaseService
            .storage
            .from('category-images')
            .upload(fileName, optimized.buffer, {
                contentType: optimized.contentType,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

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
