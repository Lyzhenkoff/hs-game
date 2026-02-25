import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();
    const role = session?.user?.role;

    if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (role !== "ADMIN" && role !== "SMM") return NextResponse.json({ error: "forbidden" }, { status: 403 });

    const body = await req.json();
    const rows: { key: string; url: string }[] = body.rows || [];

    for (const r of rows) {
        const key = String(r.key || "").trim();
        const url = String(r.url || "").trim();
        if (!key) continue;

        await prisma.siteImage.upsert({
            where: { key },
            update: { url },
            create: { key, url },
        });
    }

    return NextResponse.json({ ok: true });
}