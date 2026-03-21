import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        const expectedPassword = process.env.TICKETS_ADMIN_PASSWORD || "";

        if (!expectedPassword) {
            return NextResponse.json(
                { ok: false, error: "Пароль админки не настроен" },
                { status: 500 }
            );
        }

        if (!password || password !== expectedPassword) {
            return NextResponse.json(
                { ok: false, error: "Неверный пароль" },
                { status: 401 }
            );
        }

        const res = NextResponse.json({ ok: true });

        res.cookies.set("tickets_admin_auth", "1", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: e?.message || "Ошибка входа" },
            { status: 500 }
        );
    }
}