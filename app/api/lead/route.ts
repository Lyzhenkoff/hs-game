import { NextResponse } from "next/server";
import { z } from "zod";

const LeadSchema = z.object({
    name: z.string().min(2),
    contact: z.string().min(3),
    guests: z.string().min(1),
    city: z.string().optional().default(""),
    date: z.string().optional().default(""),
    format: z.string().min(1),
    message: z.string().optional().default(""),
});

export async function POST(req: Request) {
    try {
        const data = LeadSchema.parse(await req.json());

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            return NextResponse.json(
                { ok: false, error: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не настроены" },
                { status: 500 }
            );
        }

        const text =
            `🕯 Заявка: Ход Судьбы\n\n` +
            `Имя: ${data.name}\n` +
            `Контакт: ${data.contact}\n` +
            `Формат: ${data.format}\n` +
            `Гостей: ${data.guests}\n` +
            `Город: ${data.city || "—"}\n` +
            `Дата: ${data.date || "—"}\n\n` +
            `Комментарий:\n${data.message || "—"}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                disable_web_page_preview: true,
            }),
        });

        if (!tgRes.ok) {
            const errText = await tgRes.text();
            return NextResponse.json({ ok: false, error: errText }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message ?? "Ошибка" }, { status: 400 });
    }
}
