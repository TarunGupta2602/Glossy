import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
    try {
        const {
            user_id,
            razorpay_order_id,
            razorpay_payment_id,
            total_amount,
            shipping_address,
            contact_phone
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
                    status: 'paid'
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
