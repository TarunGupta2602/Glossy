import { NextResponse } from "next/server";

/** Block indexing of admin UI; auth gate is handled in app/admin/layout.js */
export function proxy(request) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
