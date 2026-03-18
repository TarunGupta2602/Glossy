import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

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

        const { data, error } = await supabase
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
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        console.log("Supabase URL present:", !!supabaseUrl);
        console.log("Service Role Key present:", !!serviceRoleKey);

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
        }

        // Initialize service role client on the server to bypass RLS
        const supabaseService = createClient(supabaseUrl, serviceRoleKey);

        const { data, error, count } = await supabaseService
            .from("orders")
            .select("*", { count: 'exact' })
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Fetch Orders Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("Fetched orders count:", count);
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
        const supabaseService = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data, error } = await supabaseService
            .from("orders")
            .update({ order_status })
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
