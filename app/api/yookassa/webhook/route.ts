import { NextResponse } from "next/server";
import { getPayment } from "@/lib/yookassa";
import {
    markPromoUsedByPayment,
    releasePromoByPayment,
    makeTicketId,
} from "@/lib/promoStore";
import { sendTelegram, sendTicketEmail } from "@/lib/notify";

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const secret = url.searchParams.get("secret");

        if (
            !process.env.YOOKASSA_WEBHOOK_SECRET ||
            secret !== process.env.YOOKASSA_WEBHOOK_SECRET
        ) {
            return NextResponse.json({ ok: false }, { status: 401 });
        }

        const body = await req.json();
        const event = body?.event;
        const paymentId = body?.object?.id;

        if (!event || !paymentId) {
            return NextResponse.json({ ok: true });
        }

        const payment = await getPayment(paymentId);
        const status = payment?.status;
        const meta = payment?.metadata || {};

        if (event === "payment.succeeded" && status === "succeeded") {
            const promoCode = String(meta.promo_code || "").trim();

            if (promoCode) {
                const reserveResult = markPromoUsedByPayment(paymentId);
                if (!reserveResult.ok) {
                    await sendTelegram(
                        `⚠️ Оплата прошла, но промокод не найден для payment ${paymentId}`
                    );
                }
            }

            const ticketId = String(meta.ticket_id || makeTicketId());
            const email = String(meta.email || "").trim();
            const name = String(meta.name || "").trim();
            const contact = String(meta.contact || "").trim();
            const eventTitle = String(meta.eventTitle || "").trim();
            const eventDate = String(meta.eventDate || "").trim();
            const city = String(meta.city || "").trim();
            const teamName = String(meta.teamName || "").trim();
            const faction = String(meta.faction || "").trim();
            const message = String(meta.message || "").trim();
            const qty = Number(meta.qty || 1);
            const ticket = String(meta.ticket || "").trim();
            const amount = String(payment?.amount?.value || "");

            await sendTelegram(
                [
                    "✅ Оплата успешна",
                    eventTitle ? `Игра: ${eventTitle}` : "",
                    eventDate ? `Дата: ${eventDate}` : "",
                    city ? `Город: ${city}` : "",
                    name ? `Имя: ${name}` : "",
                    contact ? `Контакт: ${contact}` : "",
                    email ? `Email: ${email}` : "",
                    ticket ? `Тариф: ${ticket}` : "",
                    `Кол-во: ${qty}`,
                    amount ? `Сумма: ${amount} ₽` : "",
                    teamName ? `Команда: ${teamName}` : "",
                    faction ? `Фракция: ${faction}` : "",
                    promoCode ? `Промокод: ${promoCode}` : "",
                    message ? `Комментарий: ${message}` : "",
                    `Ticket ID: ${ticketId}`,
                    `Payment ID: ${paymentId}`,
                ]
                    .filter(Boolean)
                    .join("\n")
            );

            if (email) {
                const html = buildTicketHtml({
                    ticketId,
                    name,
                    eventTitle,
                    eventDate,
                    city,
                    qty,
                    ticket,
                    teamName,
                    faction,
                });

                await sendTicketEmail({
                    to: email,
                    subject: `Билет HS Game${eventTitle ? ` • ${eventTitle}` : ""}`,
                    html,
                });
            }

            return NextResponse.json({ ok: true });
        }

        if (event === "payment.canceled" || status === "canceled") {
            await releasePromoByPayment(paymentId);
            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: true });
    }
}

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function row(label: string, value?: string | number) {
    if (value === undefined || value === null || value === "") return "";
    return `
    <tr>
      <td style="padding:8px 0;color:#a1a1aa;vertical-align:top;">${escapeHtml(
        label
    )}</td>
      <td style="padding:8px 0;color:#ffffff;vertical-align:top;">${escapeHtml(
        String(value)
    )}</td>
    </tr>
  `;
}

function buildTicketHtml(params: {
    ticketId: string;
    name: string;
    eventTitle: string;
    eventDate?: string;
    city?: string;
    qty?: number;
    ticket?: string;
    teamName?: string;
    faction?: string;
}) {
    return `
    <div style="background:#0a0a0a;padding:32px;font-family:Arial,sans-serif;color:#fff;">
      <div style="max-width:640px;margin:0 auto;background:#111111;border:1px solid #27272a;border-radius:20px;padding:28px;">
        <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#a1a1aa;">
          Ход Судьбы
        </div>

        <h1 style="margin:12px 0 8px;font-size:28px;line-height:1.2;">
          Ваш билет
        </h1>

        <p style="margin:0 0 20px;color:#d4d4d8;line-height:1.6;">
          Спасибо за оплату. Сохраните это письмо и покажите билет организатору на входе.
        </p>

        <table style="width:100%;border-collapse:collapse;">
          ${row("Игра", params.eventTitle)}
          ${row("Дата", params.eventDate)}
          ${row("Город", params.city)}
          ${row("Участник", params.name)}
          ${row("Количество мест", params.qty)}
          ${row("Тариф", params.ticket)}
          ${row("Команда", params.teamName)}
          ${row("Фракция", params.faction)}
          ${row("Номер билета", params.ticketId)}
        </table>

        <div style="margin-top:24px;padding:16px;border-radius:14px;background:#18181b;border:1px solid #27272a;">
          <div style="font-size:12px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.12em;">
            Ticket ID
          </div>
          <div style="font-size:22px;font-weight:700;margin-top:6px;">
            ${escapeHtml(params.ticketId)}
          </div>
        </div>

        <p style="margin:20px 0 0;color:#a1a1aa;font-size:13px;line-height:1.6;">
          Если письма нет во входящих, проверьте папку “Спам”.
        </p>
      </div>
    </div>
  `;
}