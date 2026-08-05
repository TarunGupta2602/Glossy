import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!id || !userId) {
            return NextResponse.json({ error: "Missing order id or user id" }, { status: 400 });
        }

        const supabase = getServiceClient();
        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.user_id !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Fetch order error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
