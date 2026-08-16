import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser, isAdminUser } from "@/lib/requireAuth";
import {
    resolveCheckoutCart,
} from "@/lib/checkoutTotals";

const CUSTOMER_ALLOWED_STATUSES = new Set(["cancelled", "return requested"]);
const ADMIN_ALLOWED_STATUSES = new Set([
    "processing",
    "confirmed",
    "shipped",
    "out for delivery",
    "delivered",
    "cancelled",
    "return requested",
    "returned",
]);

function getRazorpay() {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !orderId || !paymentId || !signature) return false;
    const expected = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    try {
        return crypto.timingSafeEqual(
            Buffer.from(expected),
            Buffer.from(String(signature))
        );
    } catch {
        return false;
    }
}

async function decrementStock(supabase, items) {
    for (const item of items) {
        const qty = Number(item.quantity) || 1;
        const { data: product } = await supabase
            .from("products")
            .select("id, stock_count")
            .eq("id", item.id)
            .single();

        if (!product || product.stock_count == null) continue;

        if (product.stock_count < qty) {
            throw new Error(`Insufficient stock for ${item.name || item.id}`);
        }

        const { error } = await supabase
            .from("products")
            .update({ stock_count: product.stock_count - qty })
            .eq("id", item.id)
            .gte("stock_count", qty);

        if (error) throw error;
    }
}

export async function POST(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shipping_address,
            contact_phone,
        } = body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !shipping_address ||
            !contact_phone
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (
            !verifyRazorpaySignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            )
        ) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        const razorpay = getRazorpay();
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (payment.order_id !== razorpay_order_id) {
            return NextResponse.json(
                { error: "Payment order mismatch" },
                { status: 400 }
            );
        }

        if (!["captured", "authorized"].includes(payment.status)) {
            return NextResponse.json(
                { error: "Payment not successful" },
                { status: 400 }
            );
        }

        const supabaseService = getServiceClient();

        const { data: existing } = await supabaseService
            .from("orders")
            .select("id")
            .eq("razorpay_payment_id", razorpay_payment_id)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({
                success: true,
                order: existing,
                duplicate: true,
            });
        }

        const clientItems = Array.isArray(body.items) ? body.items : [];

        const { checkout, error: checkoutError } = await resolveCheckoutCart(
            supabaseService,
            auth.user.id,
            clientItems,
            { persistFallback: true }
        );

        if (checkoutError || !checkout) {
            return NextResponse.json(
                { error: checkoutError || "Cart is empty" },
                { status: checkoutError?.includes("stock") ? 409 : 400 }
            );
        }

        const expectedPaise = Math.round(checkout.cartTotal * 100);
        if (Number(payment.amount) !== expectedPaise) {
            return NextResponse.json(
                { error: "Payment amount mismatch" },
                { status: 400 }
            );
        }

        if (String(payment.notes?.user_id || "") !== auth.user.id) {
            // notes may be missing on older orders; still require amount + signature
            if (payment.notes?.user_id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        await decrementStock(supabaseService, checkout.checkoutItems);

        const { data, error } = await supabaseService
            .from("orders")
            .insert([
                {
                    user_id: auth.user.id,
                    razorpay_order_id,
                    razorpay_payment_id,
                    total_amount: checkout.cartTotal,
                    shipping_address,
                    contact_phone,
                    items: checkout.checkoutItems,
                    status: "paid",
                    order_status: "processing",
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase Order Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        await supabaseService
            .from("cart_items")
            .delete()
            .eq("user_id", auth.user.id);

        return NextResponse.json({ success: true, order: data });
    } catch (error) {
        console.error("Order Storage Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const supabaseService = getServiceClient();
        const admin = await isAdminUser(auth.user.id);

        let query = supabaseService
            .from("orders")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false });

        if (!admin) {
            query = query.eq("user_id", auth.user.id);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("Fetch Orders Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            orders: data,
            totalCount: count,
        });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const { id, order_status } = await req.json();

        if (!id || !order_status) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const supabaseService = getServiceClient();
        const admin = await isAdminUser(auth.user.id);

        const { data: existing, error: fetchError } = await supabaseService
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !existing) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (!admin && existing.user_id !== auth.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (admin) {
            if (!ADMIN_ALLOWED_STATUSES.has(order_status)) {
                return NextResponse.json(
                    { error: "Invalid status" },
                    { status: 400 }
                );
            }
        } else {
            if (!CUSTOMER_ALLOWED_STATUSES.has(order_status)) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            if (
                order_status === "cancelled" &&
                !["processing", "confirmed"].includes(existing.order_status)
            ) {
                return NextResponse.json(
                    { error: "Order can no longer be cancelled" },
                    { status: 400 }
                );
            }
            if (
                order_status === "return requested" &&
                existing.order_status !== "delivered"
            ) {
                return NextResponse.json(
                    { error: "Only delivered orders can be returned" },
                    { status: 400 }
                );
            }
        }

        const updateData = { order_status };
        if (order_status === "delivered") {
            updateData.delivered_at = new Date().toISOString();
        }

        const { data, error } = await supabaseService
            .from("orders")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Update Order Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: data });
    } catch (error) {
        console.error("Order Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
