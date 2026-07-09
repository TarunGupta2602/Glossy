import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServiceClient";

export async function GET(req, { params }) {
    try {
        const { id: productId } = await params;
        
        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const supabase = getServiceClient();

        // Fetch approved reviews for this product
        const { data: reviews, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("product_id", productId)
            .eq("is_approved", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Fetch Reviews Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Calculate rating statistics
        const totalReviews = reviews?.length || 0;
        const avgRating = totalReviews > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
            : 0;

        // Count ratings by star
        const ratingCounts = {
            5: reviews?.filter(r => r.rating === 5).length || 0,
            4: reviews?.filter(r => r.rating === 4).length || 0,
            3: reviews?.filter(r => r.rating === 3).length || 0,
            2: reviews?.filter(r => r.rating === 2).length || 0,
            1: reviews?.filter(r => r.rating === 1).length || 0,
        };

        return NextResponse.json({
            success: true,
            reviews: reviews || [],
            stats: {
                totalReviews,
                avgRating: parseFloat(avgRating.toFixed(2)),
                ratingCounts
            }
        });
    } catch (error) {
        console.error("Reviews API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
