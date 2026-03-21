import { NextResponse } from "next/server";
import { createPayment } from "@/lib/yookassa";
import {
    applyPromoToTotal,
    normCode,
    reservePromo,
    makeTicketId,
} from "@/lib/promoStore";
import { sendTelegram } from "@/lib/notify";
import prisma from "@/lib/prisma";

type Mode = "team" | "solo";
type Ticket = "1200" | "1500" | "2000" | "premium";

const ticketPrices: Record<Ticket, number> = {
    "1200": 1200,
    "1500": 1500,
    "2000": 2000,
    premium: 3000,
};

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const {
            eventTitle,
            eventDate,
            city,
            mode,
            ticket,
            seats,
            name,
            contact,
            email,
            message,
            promoCode,
            teamName,
            faction,
        } = data as {
            eventTitle: string;
            eventDate?: string;
            city?: string;
            mode: Mode;
            ticket: Ticket;
            seats: string;
            name: string;
            contact?: string;
            email?: string;
            message?: string;
            promoCode?: string;
            teamName?: string;
            faction?: string;
        };

        if (!eventTitle || !mode || !ticket || !name || !contact) {
            return NextResponse.json(
                { ok: false, error: "Некорректные данные" },
                { status: 400 }
            );
        }

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { ok: false, error: "Для оплаты нужен корректный email" },
                { status: 400 }
            );
        }

        const seatsCount =
            mode === "team"
                ? Math.min(8, Math.max(1, parseInt(seats || "1", 10) || 1))
                : 1;

        const ticketPrice = ticketPrices[ticket];
        if (!ticketPrice) {
            return NextResponse.json(
                { ok: false, error: "Неизвестный тип билета" },
                { status: 400 }
            );
        }

        const baseTotal = ticketPrice * seatsCount;

        let finalTotal = baseTotal;
        let promoLabel = "";
        let promoDiscount = 0;
        const promo = promoCode ? normCode(promoCode) : "";

        const ticketId = makeTicketId();

        if (promo) {
            const { findPromoByCode } = await import("@/lib/serverPromoRead");
            const found = findPromoByCode(promo);

            if (!found) {
                return NextResponse.json(
                    { ok: false, error: "Промокод не найден" },
                    { status: 400 }
                );
            }

            if (found.status !== "new") {
                return NextResponse.json(
                    { ok: false, error: "Промокод уже использован или зарезервирован" },
                    { status: 400 }
                );
            }

            const calc = applyPromoToTotal(found as any, baseTotal, ticketPrice);
            finalTotal = calc.newTotal;
            promoLabel = calc.label;
            promoDiscount = calc.discount;
        }

        // Ищем событие по названию
        const event = await prisma.event.findFirst({
            where: {
                title: eventTitle,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!event) {
            return NextResponse.json(
                { ok: false, error: `Событие "${eventTitle}" не найдено в базе` },
                { status: 400 }
            );
        }

        const returnUrl = process.env.PUBLIC_URL
            ? `${process.env.PUBLIC_URL}/thanks`
            : "https://hs-game.ru/thanks";

        const description = `HS Game • ${eventTitle} • ${name}${
            seatsCount > 1 ? ` ×${seatsCount}` : ""
        }`;

        // 1. Сохраняем заявку в базу
        const registration = await prisma.registration.create({
            data: {
                eventId: event.id,
                userId: null,
                mode,
                name,
                contact,
                seats: seatsCount,
                teamName: teamName || null,
                ticket: ticketPrice,
                faction: faction || null,
                message: message || null,
            },
        });

        // 2. Создаём оплату
        const payment = await createPayment({
            amountRub: finalTotal,
            description,
            returnUrl,
            email: email || "",
            metadata: {
                ticket_id: ticketId,
                promo_code: promo || "",
                email: email || "",
                name,
                contact: contact || "",
                eventTitle,
                eventDate: eventDate || "",
                city: city || "",
                qty: seatsCount,
                ticket,
                baseTotal,
                promoDiscount,
                promoLabel,
                teamName: teamName || "",
                faction: faction || "",
                message: message || "",
            },
        });

        const paymentUrl = payment.confirmation?.confirmation_url;
        if (!paymentUrl) {
            throw new Error("YooKassa не вернула ссылку на оплату");
        }

        if (promo) {
            const reserveResult = reservePromo(promo, payment.id);
            if (!reserveResult?.ok) {
                return NextResponse.json(
                    {
                        ok: false,
                        error:
                            reserveResult?.error || "Не удалось зарезервировать промокод",
                    },
                    { status: 400 }
                );
            }
        }

        await sendTelegram(
            [
                "📝 Новая заявка",
                `Игра: ${eventTitle}`,
                eventDate ? `Дата: ${eventDate}` : "",
                city ? `Город: ${city}` : "",
                `Имя: ${name}`,
                `Контакт: ${contact}`,
                email ? `Email: ${email}` : "",
                `Билет: ${ticketPrice} ₽`,
                `Количество: ${seatsCount}`,
                `Сумма: ${finalTotal} ₽`,
                teamName ? `Команда: ${teamName}` : "",
                faction ? `Фракция: ${faction}` : "",
                message ? `Комментарий: ${message}` : "",
                promo ? `Промокод: ${promo}${promoLabel ? ` (${promoLabel})` : ""}` : "",
                `Registration ID: ${registration.id}`,
                `Ticket ID: ${ticketId}`,
                `Payment ID: ${payment.id}`,
            ]
                .filter(Boolean)
                .join("\n")
        );

        return NextResponse.json({
            ok: true,
            paymentUrl,
            paymentId: payment.id,
            ticketId,
            registrationId: registration.id,
        });
    } catch (e: any) {
        console.error("SIGNUP ROUTE ERROR:", e);
        return NextResponse.json(
            { ok: false, error: e?.message || "Ошибка" },
            { status: 500 }
        );
    }
}