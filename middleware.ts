import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
    const session = await auth();
    const path = req.nextUrl.pathname;

    const isLogged = !!session?.user?.id;
    const role = session?.user?.role;

    if (path.startsWith("/account") && !isLogged) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/admin")) {
        if (!isLogged) return NextResponse.redirect(new URL("/login", req.url));

        // /admin/media доступен ADMIN и SMM
        if (path.startsWith("/admin/media")) {
            if (role !== "ADMIN" && role !== "SMM") {
                return NextResponse.redirect(new URL("/", req.url));
            }
            return NextResponse.next();
        }

        // остальная админка — только ADMIN
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/account/:path*", "/admin/:path*"],
};