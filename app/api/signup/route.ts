import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

const Schema = z.object({
    eventTitle: z.string().min(1),
    eventDate: z.string().optional().default(""),
    city: z.string().optional().default(""),
    name: z.string().min(2),
    contact: z.string().min(3),
    seats: z.string().optional().default("1"),
    message: z.string().optional().default(""),
    mode: z.enum(["team", "solo"]),
    ticket: z.enum(["1000", "1500", "2000", "3000"]),
    teamName: z.string().optional().default(""),
    faction: z.string().optional().default(""),
});

type Reg = z.infer<typeof Schema> & {
    id: string;
    createdAt: string;
};

function dataFilePath() {
    return path.join(process.cwd(), "data", "registrations.json");
}

function readRegs(): Reg[] {
    const p = dataFilePath();
    try {
        const raw = fs.readFileSync(p, "utf8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeRegs(regs: Reg[]) {
    const p = dataFilePath();
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(regs, null, 2), "utf8");
}

function escapeTg(text: string) {
    // для обычного text без Markdown — не нужно, но пусть будет безопаснее
    return text;
}

function buildRosterText(regs: Reg[]) {
    const lines: string[] = [];
    lines.push("📋 РЕГИСТРАЦИИ (последние сверху)");
    lines.push("");

    const last = regs.slice(-30).reverse(); // показываем последние 30, чтобы не было лимита на длину
    for (const r of last) {
        const when = new Date(r.createdAt).toLocaleString("ru-RU");
        const head = `• ${when} — ${r.eventTitle}${r.eventDate ? ` (${r.eventDate})` : ""}`;
        const body = `  ${r.name} | ${r.contact} | мест: ${r.seats}${r.city ? ` | ${r.city}` : ""}`;
        const note = r.message ? `  ✎ ${r.message}` : "";
        lines.push(head);
        lines.push(body);
        if (note) lines.push(note);
        lines.push("");
    }

    lines.push("—");
    lines.push(`Всего записей: ${regs.length}`);
    return lines.join("\n").trim();
}

async function tg(method: string, body: any) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN не настроен");
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.description || "Telegram error");
    return json.result;
}

export async function POST(req: Request) {
    try {
        const chatId = process.env.TELEGRAM_CHAT_ID;
        if (!chatId) {
            return NextResponse.json({ ok: false, error: "TELEGRAM_CHAT_ID не настроен" }, { status: 500 });
        }

        const data = Schema.parse(await req.json());

        const reg: Reg = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...data,
        };

        const regs = readRegs();
        regs.push(reg);
        writeRegs(regs);

        // 1) Уведомление о новой записи
        const newText: string =
            `✅ Новая запись\n\n` +
            `Событие: ${escapeTg(reg.eventTitle)}\n` +
            (reg.eventDate ? `Дата/время: ${escapeTg(reg.eventDate)}\n` : "") +
            (reg.city ? `Город: ${escapeTg(reg.city)}\n` : "") +
            `Формат: ${reg.mode === "team" ? "Команда" : "Один игрок"}\n` +
            `Билет: ${escapeTg(reg.ticket)} ₽ / человек\n` +
            (reg.teamName ? `Команда: ${escapeTg(reg.teamName)}\n` : "") +
            (reg.faction ? `Фракция: ${escapeTg(reg.faction)}\n` : "") +
            `Имя: ${escapeTg(reg.name)}\n` +
            `Контакт: ${escapeTg(reg.contact)}\n` +
            `Мест: ${escapeTg(reg.seats)}\n` +
            (reg.message ? `Комментарий: ${escapeTg(reg.message)}\n` : "");

        await tg("sendMessage", {
            chat_id: chatId,
            text: newText,
            disable_web_page_preview: true,
        });

        // 2) Обновляем единый список (roster) в одном сообщении
        const rosterText = buildRosterText(regs);

        const rosterMessageId = process.env.TELEGRAM_ROSTER_MESSAGE_ID;

        if (rosterMessageId) {
            await tg("editMessageText", {
                chat_id: chatId,
                message_id: Number(rosterMessageId),
                text: rosterText,
                disable_web_page_preview: true,
            });
        } else {
            // Если roster message id ещё не задан — создаём сообщение и просим тебя вставить id
            const msg = await tg("sendMessage", {
                chat_id: chatId,
                text: rosterText,
                disable_web_page_preview: true,
            });

            return NextResponse.json({
                ok: true,
                rosterMessageId: msg.message_id,
                note: "Добавь TELEGRAM_ROSTER_MESSAGE_ID в .env.local и перезапусти dev сервер",
            });
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message ?? "Ошибка" }, { status: 400 });
    }
}
