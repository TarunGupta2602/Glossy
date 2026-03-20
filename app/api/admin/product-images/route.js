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
