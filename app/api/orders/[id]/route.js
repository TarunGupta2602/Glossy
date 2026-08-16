import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser, isAdminUser } from "@/lib/requireAuth";

export async function GET(req, { params }) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Missing order id" }, { status: 400 });
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

        const admin = await isAdminUser(auth.user.id);
        if (!admin && order.user_id !== auth.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Fetch order error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
