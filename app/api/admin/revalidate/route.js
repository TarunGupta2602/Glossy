import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/requireAdmin";
import { revalidateStorefront } from "@/lib/revalidateSite";
import { revalidatePath } from "next/cache";

/**
 * POST /api/admin/revalidate
 * Force-refresh homepage + core storefront ISR cache.
 *
 * Auth: admin Bearer JWT, or Authorization: Bearer <REVALIDATE_SECRET>
 * Body (optional): { "paths": ["/","/earrings"] }
 */
function authorizedBySecret(request) {
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret) return false;
    const header = request.headers.get("authorization") || "";
    if (!header.startsWith("Bearer ")) return false;
    return header.slice(7) === secret;
}

export async function POST(request) {
    try {
        if (!authorizedBySecret(request)) {
            const denied = await guardAdmin(request);
            if (denied) return denied;
        }

        const body = await request.json().catch(() => ({}));
        const extra = Array.isArray(body?.paths)
            ? body.paths.filter((p) => typeof p === "string" && p.startsWith("/"))
            : [];

        const paths = revalidateStorefront(extra);

        // Layout/nav/footer share the root layout — bust layout tree too.
        try {
            revalidatePath("/", "layout");
        } catch (layoutError) {
            console.error("revalidatePath layout failed:", layoutError);
        }

        return NextResponse.json({
            success: true,
            revalidated: paths,
            message: "Homepage and storefront cache marked for refresh.",
        });
    } catch (error) {
        console.error("POST /api/admin/revalidate error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
