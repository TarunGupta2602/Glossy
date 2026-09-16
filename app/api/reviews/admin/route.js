import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { guardAdmin } from "@/lib/requireAdmin";

// GET - Fetch all reviews (including unapproved) for admin
export async function GET(req) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("product_id");
        const status = searchParams.get("status"); // 'pending', 'approved', 'all'
        const limit = parseInt(searchParams.get("limit") || "50");

        const supabase = getServiceClient();

        let query = supabase
            .from("reviews")
            .select(`
                *,
                products (
                    id,
                    name,
                    main_image
                )
            `)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (productId) {
            query = query.eq("product_id", productId);
        }

        if (status === "pending") {
            query = query.eq("is_approved", false);
        } else if (status === "approved") {
            query = query.eq("is_approved", true);
        }

        const { data: reviews, error } = await query;

        if (error) {
            console.error("Fetch Admin Reviews Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            reviews: reviews || []
        });
    } catch (error) {
        console.error("Admin Reviews GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Approve or reject reviews
export async function PATCH(req) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const body = await req.json();
        const { reviewId, action } = body; // action: 'approve' or 'reject'

        if (!reviewId || !action) {
            return NextResponse.json(
                { error: "Missing required fields: reviewId, action" },
                { status: 400 }
            );
        }

        if (!["approve", "reject"].includes(action)) {
            return NextResponse.json(
                { error: "Action must be 'approve' or 'reject'" },
                { status: 400 }
            );
        }

        const supabase = getServiceClient();

        const { data: review, error } = await supabase
            .from("reviews")
            .update({
                is_approved: action === "approve",
                updated_at: new Date().toISOString()
            })
            .eq("id", reviewId)
            .select()
            .single();

        if (error) {
            console.error("Update Review Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            review,
            message: action === "approve" ? "Review approved" : "Review rejected"
        });
    } catch (error) {
        console.error("Admin Reviews PATCH Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Manually import a review (WhatsApp / Instagram / offline)
export async function POST(req) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const body = await req.json();
        const {
            product_id,
            rating,
            comment,
            title,
            user_name,
            user_email,
            source,
            is_approved = true,
            is_verified_purchase = false,
        } = body;

        if (!product_id || !rating || !comment || !user_name) {
            return NextResponse.json(
                {
                    error: "Missing required fields: product_id, rating, comment, user_name",
                },
                { status: 400 }
            );
        }

        const ratingNum = Number(rating);
        if (ratingNum < 1 || ratingNum > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        if (String(comment).trim().length < 10) {
            return NextResponse.json(
                { error: "Comment must be at least 10 characters" },
                { status: 400 }
            );
        }

        const supabase = getServiceClient();
        const sourceNote = source ? ` [via ${String(source).trim()}]` : "";
        const finalComment = `${String(comment).trim()}${sourceNote}`;

        const { data: review, error } = await supabase
            .from("reviews")
            .insert([
                {
                    product_id,
                    user_id: null,
                    user_name: String(user_name).trim(),
                    user_email: user_email ? String(user_email).trim() : null,
                    rating: ratingNum,
                    title: title ? String(title).trim() : null,
                    comment: finalComment,
                    images: [],
                    is_approved: Boolean(is_approved),
                    is_verified_purchase: Boolean(is_verified_purchase),
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Import Review Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            review,
            message: "Review imported successfully",
        });
    } catch (error) {
        console.error("Admin Reviews POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete a review
export async function DELETE(req) {
    try {
        const denied = await guardAdmin(req);
        if (denied) return denied;

        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get("reviewId");

        if (!reviewId) {
            return NextResponse.json(
                { error: "Missing required parameter: reviewId" },
                { status: 400 }
            );
        }

        const supabase = getServiceClient();

        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", reviewId);

        if (error) {
            console.error("Delete Review Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Admin Reviews DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
