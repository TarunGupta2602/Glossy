import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function POST(req) {
    try {
        const body = await req.json(); // Expected [{product_id, image_url}, ...]
        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("product_images")
            .insert(Array.isArray(body) ? body : [body])
            .select();

        if (error) {
            console.error("Create Product Images Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, images: data });
    } catch (error) {
        console.error("Product Images POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json(); // Image ID
        const supabaseService = getServiceClient();

        const { error } = await supabaseService
            .from("product_images")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Delete Product Image Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Gallery image deleted" });
    } catch (error) {
        console.error("Product Images DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
