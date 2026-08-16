import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { requireUser, isAdminUser } from "@/lib/requireAuth";

export async function POST(req) {
    try {
        const auth = await requireUser(req);
        if (auth.error) return auth.error;

        const body = await req.json();
        const { product_id, rating, title, comment, images } = body;

        if (!product_id || !rating || !comment) {
            return NextResponse.json(
                {
                    error: "Missing required fields: product_id, rating, comment",
                },
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

        if (images && (!Array.isArray(images) || images.length > 5)) {
            return NextResponse.json(
                { error: "You can upload maximum 5 images" },
                { status: 400 }
            );
        }

        const supabaseService = getServiceClient();
        const userId = auth.user.id;
        const userName =
            auth.user.user_metadata?.full_name ||
            auth.user.user_metadata?.name ||
            auth.user.email?.split("@")[0] ||
            "Customer";
        const userEmail = auth.user.email;

        const { data: existingReview } = await supabaseService
            .from("reviews")
            .select("id")
            .eq("product_id", product_id)
            .eq("user_id", userId)
            .maybeSingle();

        if (existingReview) {
            return NextResponse.json(
                { error: "You have already reviewed this product" },
                { status: 409 }
            );
        }

        const { data: review, error } = await supabaseService
            .from("reviews")
            .insert([
                {
                    product_id,
                    user_id: userId,
                    user_name: userName,
                    user_email: userEmail,
                    rating,
                    title: title || null,
                    comment,
                    images: images || [],
                    is_approved: false,
                    is_verified_purchase: false,
                },
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
            message: "Review submitted successfully and is pending approval",
        });
    } catch (error) {
        console.error("Review POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("product_id");
        const userId = searchParams.get("user_id");
        const approvedOnlyParam = searchParams.get("approved_only");
        const limit = parseInt(searchParams.get("limit") || "50", 10);

        let approvedOnly = approvedOnlyParam !== "false";

        if (approvedOnlyParam === "false") {
            const auth = await requireUser(req);
            if (auth.error) return auth.error;
            const admin = await isAdminUser(auth.user.id);
            if (!admin) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            approvedOnly = false;
        }

        const supabaseService = getServiceClient();

        let query = supabaseService
            .from("reviews")
            .select(
                "id, product_id, user_id, user_name, rating, title, comment, images, is_approved, is_verified_purchase, created_at"
            )
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
            reviews: reviews || [],
        });
    } catch (error) {
        console.error("Reviews GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
