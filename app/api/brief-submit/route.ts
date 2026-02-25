import { NextResponse } from "next/server";

function safeJsonParse<T>(s: string | undefined, fallback: T): T {
    try {
        return s ? (JSON.parse(s) as T) : fallback;
    } catch {
        return fallback;
    }
}

type BriefLink = { password: string; title?: string };
type BriefLinksMap = Record<string, BriefLink>;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            slug,
            password,
            answers,
            contact,
        }: {
            slug: string;
            password: string;
            answers: Record<string, any>;
            contact: { name?: string; phone?: string; telegram?: string; email?: string };
        } = body;

        const links = safeJsonParse<BriefLinksMap>(process.env.BRIEF_LINKS_JSON, {});
        const entry = links[slug];

        if (!entry) {
            return NextResponse.json({ ok: false, error: "unknown_slug" }, { status: 404 });
        }
        if (!password || password !== entry.password) {
            return NextResponse.json({ ok: false, error: "wrong_password" }, { status: 401 });
        }

        const title = entry.title ?? `Бриф персональной игры (${slug})`;

        const lines: string[] = [];
        lines.push(`🜂 *${title}*`);
        lines.push(``);
        lines.push(`👤 *Контакт*`);
        lines.push(`• Имя: ${contact?.name ?? "—"}`);
        lines.push(`• Телефон: ${contact?.phone ?? "—"}`);
        lines.push(`• Telegram: ${contact?.telegram ?? "—"}`);
        lines.push(`• Email: ${contact?.email ?? "—"}`);
        lines.push(``);
        lines.push(`🧾 *Ответы*`);

        // Красивый вывод: только заполненные поля
        const flat: Array<[string, any]> = Object.entries(answers ?? {});
        for (const [key, value] of flat) {
            if (value === undefined || value === null) continue;
            if (typeof value === "string" && value.trim() === "") continue;
            if (Array.isArray(value) && value.length === 0) continue;

            const pretty =
                Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : String(value);

            lines.push(`• *${key}*: ${pretty}`);
        }

        const text = lines.join("\n");

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            return NextResponse.json({ ok: false, error: "missing_telegram_env" }, { status: 500 });
        }

        const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            }),
        });

        const data = await resp.json();
        if (!data?.ok) {
            return NextResponse.json({ ok: false, error: "telegram_failed", details: data }, { status: 502 });
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: "server_error", details: e?.message ?? String(e) }, { status: 500 });
    }
}