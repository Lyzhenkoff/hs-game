import { NextResponse } from "next/server";
import { getPayment } from "@/lib/yookassa";
import { markPromoUsedByPayment, releasePromoByPayment, makeTicketId } from "@/lib/promoStore";
import { sendTelegram, sendTicketEmail } from "@/lib/notify";

export async function POST(req: Request) {
    try {
        // простая защита URL
        const url = new URL(req.url);
        const secret = url.searchParams.get("secret");
        if (!process.env.YOOKASSA_WEBHOOK_SECRET || secret !== process.env.YOOKASSA_WEBHOOK_SECRET) {
            return NextResponse.json({ ok: false }, { status: 401 });
        }

        const body = await req.json();

        const event = body?.event;
        const paymentId = body?.object?.id;

        if (!event || !paymentId) return NextResponse.json({ ok: true }); // не валим ЮKassa

        // Подтверждаем платёж через API (важно!)
        const payment = await getPayment(paymentId);

        const status = payment?.status;
        const meta = payment?.metadata || {};

        if (event === "payment.succeeded" && status === "succeeded") {
            // ТРАТИМ промокод (если был)
            const promoCode = (meta.promo_code || "").toString().trim();
            if (promoCode) {
                const u = markPromoUsedByPayment(paymentId);
                if (!u.ok) {
                    // не валим webhook, просто сообщим
                    await sendTelegram(`⚠️ Оплата прошла, но промокод не найден для payment ${paymentId}`);
                }
            }

            const ticketId = (meta.ticket_id || makeTicketId()).toString();
            const email = (meta.email || "").toString();
            const name = (meta.name || "").toString();
            const eventTitle = (meta.eventTitle || "").toString();
            const eventDate = (meta.eventDate || "").toString();
            const city = (meta.city || "").toString();
            const qty = Number(meta.qty || 1);
            const amount = payment?.amount?.value;

            // TG тебе
            await sendTelegram(
                `✅ <b>Оплата успешна</b>\n` +
                `Игра: <b>${eventTitle}</b>\n` +
                `${eventDate ? `Дата: ${eventDate}\n` : ""}` +
                `${city ? `Город: ${city}\n` : ""}` +
                `Имя: <b>${name}</b>\n` +
                `${email ? `Email: ${email}\n` : ""}` +
                `Кол-во: <b>${qty}</b>\n` +
                `Сумма: <b>${amount} ₽</b>\n` +
                `${promoCode ? `Промо списан: <b>${promoCode}</b>\n` : ""}` +
                `TicketID: <code>${ticketId}</code>\n` +
                `Payment: <code>${paymentId}</code>`
            );

            // Email игроку — “билет”
            if (email) {
                const html =
                    `<div style="font-family:Arial,sans-serif;line-height:1.5">` +
                    `<h2>Ваш билет на HS Game</h2>` +
                    `<p><b>Игра:</b> ${escapeHtml(eventTitle)}</p>` +
                    (eventDate ? `<p><b>Дата:</b> ${escapeHtml(eventDate)}</p>` : "") +
                    (city ? `<p><b>Город:</b> ${escapeHtml(city)}</p>` : "") +
                    `<p><b>Участник:</b> ${escapeHtml(name)}</p>` +
                    `<p><b>Количество:</b> ${qty}</p>` +
                    `<p><b>Номер билета:</b> <code>${escapeHtml(ticketId)}</code></p>` +
                    `<p>Покажите номер билета организатору (или это письмо).</p>` +
                    `<hr/>` +
                    `<p style="color:#666;font-size:12px">Если письмо попало в спам — отметьте как “Не спам”.</p>` +
                    `</div>`;

                await sendTicketEmail({
                    to: email,
                    subject: `Билет HS Game • ${eventTitle}`,
                    html,
                });
            }

            return NextResponse.json({ ok: true });
        }

        // Если платеж отменён — можно разморозить промо, чтобы оно снова работало
        if (event === "payment.canceled" || status === "canceled") {
            await releasePromoByPayment(paymentId);
            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ ok: true });
    } catch {
        // webhook нельзя “ронять”
        return NextResponse.json({ ok: true });
    }
}

function escapeHtml(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}