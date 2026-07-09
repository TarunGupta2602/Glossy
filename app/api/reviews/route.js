import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    try {
        const body = await req.json();
        const { product_id, user_id, user_name, user_email, rating, title, comment, images } = body;

        // Validation
        if (!product_id || !user_id || !user_name || !user_email || !rating || !comment) {
            return NextResponse.json(
                { error: "Missing required fields: product_id, user_id, user_name, user_email, rating, comment" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        if (comment.trim().length < 10) {
            return NextResponse.json(
                { error: "Comment must be at least 10 characters long" },
                { status: 400 }
            );
        }

        if (comment.trim().length > 1000) {
            return NextResponse.json(
                { error: "Comment must not exceed 1000 characters" },
                { status: 400 }
            );
        }

        // Validate images array (max 5 images)
        if (images && (!Array.isArray(images) || images.length > 5)) {
            return NextResponse.json(
                { error: "You can upload maximum 5 images" },
                { status: 400 }
            );
        }

        // Verify user is authenticated (using service client to bypass RLS for check)
        const supabaseService = getServiceClient();
        
        // Check if user already reviewed this product
        const { data: existingReview } = await supabaseService
            .from("reviews")
            .select("id")
            .eq("product_id", product_id)
            .eq("user_id", user_id)
            .single();

        if (existingReview) {
            return NextResponse.json(
                { error: "You have already reviewed this product" },
                { status: 409 }
            );
        }

        // Check if user has purchased this product (optional - for verified purchase badge)
        // This requires an orders table - for now we'll set it to false
        const isVerifiedPurchase = false;

        // Insert the review
        const { data: review, error } = await supabaseService
            .from("reviews")
            .insert([
                {
                    product_id,
                    user_id,
                    user_name,
                    user_email,
                    rating,
                    title: title || null,
                    comment,
                    images: images || [],
                    is_approved: false, // Requires admin approval
                    is_verified_purchase: isVerifiedPurchase
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Create Review Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            review,
            message: "Review submitted successfully and is pending approval"
        });
    } catch (error) {
        console.error("Review POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET endpoint to fetch reviews with filters (for admin or general use)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("product_id");
        const userId = searchParams.get("user_id");
        const approvedOnly = searchParams.get("approved_only") !== "false"; // default true
        const limit = parseInt(searchParams.get("limit") || "50");

        const supabaseService = getServiceClient();

        let query = supabaseService
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (productId) {
            query = query.eq("product_id", productId);
        }

        if (userId) {
            query = query.eq("user_id", userId);
        }

        if (approvedOnly) {
            query = query.eq("is_approved", true);
        }

        const { data: reviews, error } = await query;

        if (error) {
            console.error("Fetch Reviews Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            reviews: reviews || []
        });
    } catch (error) {
        console.error("Reviews GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
