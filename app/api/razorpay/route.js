import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser } from "@/lib/requireAuth";
import { resolveCheckoutCart } from "@/lib/checkoutTotals";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const limited = rateLimit(`razorpay:${auth.user.id}:${clientIp(req)}`, {
            limit: 10,
            windowMs: 60_000,
        });
        if (!limited.ok) {
            return NextResponse.json(
                { error: "Too many payment attempts. Please wait a moment." },
                { status: 429 }
            );
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { error: "Payment provider not configured" },
                { status: 500 }
            );
        }

        const body = await req.json().catch(() => ({}));
        const clientItems = Array.isArray(body.items) ? body.items : [];

        const supabase = getServiceClient();
        const { checkout, error } = await resolveCheckoutCart(
            supabase,
            auth.user.id,
            clientItems,
            { persistFallback: true }
        );

        if (error || !checkout) {
            return NextResponse.json(
                { error: error || "Cart is empty" },
                { status: error?.includes("stock") ? 409 : 400 }
            );
        }

        const options = {
            amount: Math.round(checkout.cartTotal * 100),
            currency: "INR",
            receipt: `rcpt_${auth.user.id.slice(0, 8)}_${Date.now()}`,
            notes: {
                user_id: auth.user.id,
                item_count: String(checkout.checkoutItems.length),
                paid_subtotal: String(checkout.cartSubtotal),
                shipping_fee: String(checkout.shippingFee),
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            ...order,
            cartTotal: checkout.cartTotal,
            shippingFee: checkout.shippingFee,
            discountAmount: checkout.discountAmount,
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
