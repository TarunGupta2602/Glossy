import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function POST(req) {
    try {
        const {
            user_id,
            razorpay_order_id,
            razorpay_payment_id,
            total_amount,
            shipping_address,
            contact_phone,
            items
        } = await req.json();

        if (!user_id || !razorpay_order_id || !razorpay_payment_id || !total_amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Use service role client to bypass RLS for order creation
        const supabaseService = getServiceClient();

        const { data, error } = await supabaseService
            .from("orders")
            .insert([
                {
                    user_id,
                    razorpay_order_id,
                    razorpay_payment_id,
                    total_amount,
                    shipping_address,
                    contact_phone,
                    items,
                    status: 'paid',
                    order_status: 'processing'
                }
            ])
            .select();

        if (error) {
            console.error("Supabase Order Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: data[0] });
    } catch (error) {
        console.error("Order Storage Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        // Use service role client on the server to bypass RLS
        const supabaseService = getServiceClient();

        let query = supabaseService
            .from("orders")
            .select("*", { count: 'exact' })
            .order("created_at", { ascending: false });

        if (userId) {
            query = query.eq("user_id", userId);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("Fetch Orders Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, orders: data, totalCount: count });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { id, order_status } = await req.json();

        if (!id || !order_status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Use service role client to bypass RLS
        const supabaseService = getServiceClient();

        // Handle setting delivered_at timestamp when status becomes 'delivered'
        const updateData = { order_status };
        if (order_status === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
        }

        const { data, error } = await supabaseService
            .from("orders")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) {
            console.error("Update Order Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: data[0] });
    } catch (error) {
        console.error("Order Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}