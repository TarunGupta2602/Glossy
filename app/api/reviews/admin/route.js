import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

// GET - Fetch all reviews (including unapproved) for admin
export async function GET(req) {
    try {
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

// DELETE - Delete a review
export async function DELETE(req) {
    try {
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
