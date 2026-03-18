import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

        const { data, error } = await supabaseAdmin
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
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Fetch Orders Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, orders: data });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { id, order_status, user_id } = await req.json();

        if (!id || !order_status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let query = supabaseAdmin
            .from("orders")
            .update({ order_status })
            .eq("id", id);

        // If user_id is provided (from client-side cancellation), ensure they own the order
        if (user_id) {
            query = query.eq("user_id", user_id);
        }

        const { data, error } = await query.select();

        if (error) {
            console.error("Update Order Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (data.length === 0) {
            return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order: data[0] });
    } catch (error) {
        console.error("Order Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
