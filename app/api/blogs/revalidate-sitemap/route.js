import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { revalidateBlogSurfaces } from "@/lib/revalidateBlog";

/**
 * POST /api/blogs/revalidate-sitemap
 * Force-refresh sitemap + blog hub after publishing (admin only).
 */
export async function POST(request) {
    try {
        const denied = await guardAdmin(request);
        if (denied) return denied;

        const body = await request.json().catch(() => ({}));
        revalidateBlogSurfaces(body?.slug || "");

        return NextResponse.json({
            success: true,
            message: "Sitemap and blog pages will refresh on the next request.",
        });
    } catch (error) {
        console.error("POST /api/blogs/revalidate-sitemap error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
