import { NextResponse } from "next/server";
import { createPayment } from "@/lib/yookassa";
import { applyPromoToTotal, normCode, reservePromo, makeTicketId } from "@/lib/promoStore";
import { sendTelegram } from "@/lib/notify";

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

        if (!eventTitle || !mode || !ticket || !name) {
            return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 });
        }

        const qty = mode === "team" ? Math.max(1, parseInt(seats || "1", 10)) : 1;
        const ticketPrice = ticketPrices[ticket];
        const baseTotal = ticketPrice * qty;

        // промо пока НЕ списываем, а только считаем и потом зарезервируем после создания платежа
        let finalTotal = baseTotal;
        let promoLabel = "";
        let promoDiscount = 0;
        const promo = (promoCode ? normCode(promoCode) : "");

        // создаём “черновой” payment сначала, но чтобы промокод нельзя было украсть между — мы положим promo в metadata
        const ticketId = makeTicketId();

        // если промо есть — проверим/посчитаем через store (через reserve после paymentId)
        // для этого: сначала создаём платёж НА БАЗОВУЮ сумму? нет — лучше сразу на финальную.
        // значит нужно ДО createPayment понять финальную сумму => читаем промо файлик через reserve? reserve требует paymentId.
        // поэтому делаем так:
        // 1) если есть промо — делаем “pre-check”: просто читаем из файла через reserve с temporary paymentId? некрасиво.
        // проще: на этом MVP считаем промо на сервере так:
        // - резервацию делаем после createPayment
        // - но сумму надо считать до createPayment -> значит надо прочитать промо вручную.
        // Для простоты: используем reservePromo после createPayment, а до этого считаем через попытку reserve в 2 шага:
        // создаём paymentId заранее нельзя.
        // Поэтому: на MVP делаем простую функцию: "reservePromo" будет вызываться после createPayment, а до createPayment
        // мы НЕ даём скидку если промокод невалидный. Чтобы посчитать скидку — нужна функция чтения.
        //
        // В этом ответе чтобы не растягивать — делаем компромисс:
        // считаем скидку на сервере через тот же файл: просто импортируем readAll? (не экспортировали).
        // Я сделаю проще: если промо есть — пока создаём платёж на baseTotal,
        // затем если промо валиден — создаём новый платёж/отменяем? это плохо.
        //
        // Поэтому ниже я сделаю правильный вариант: добавлю маленькую функцию getPromoByCode прямо здесь
        // (чтение того же файла), без резерва.
        const { findPromoByCode } = await import("@/lib/serverPromoRead");
        if (promo) {
            const found = findPromoByCode(promo);
            if (!found) return NextResponse.json({ ok: false, error: "Промокод не найден" }, { status: 400 });
            if (found.status !== "new") return NextResponse.json({ ok: false, error: "Промокод уже использован/зарезервирован" }, { status: 400 });

            const calc = applyPromoToTotal(found as any, baseTotal, ticketPrice);
            finalTotal = calc.newTotal;
            promoLabel = calc.label;
            promoDiscount = calc.discount;
        }

        const returnUrl = process.env.PUBLIC_URL
            ? `${process.env.PUBLIC_URL}/thanks`
            : "https://hs-game.ru/thanks";

        const description = `HS Game • ${eventTitle} • ${name}${qty > 1 ? ` ×${qty}` : ""}`;

        const payment = await createPayment({
            amountRub: finalTotal,
            description,
            returnUrl,
            metadata: {
                ticket_id: ticketId,
                promo_code: promo || "",
                email: email || "",
                name,
                contact: contact || "",
                eventTitle,
                eventDate: eventDate || "",
                city: city || "",
                qty,
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
        if (!paymentUrl) throw new Error("YooKassa не вернула ссылку на оплату");

        // резервируем промо под payment.id
        if (promo) {
            const r = reservePromo(promo, payment.id);
            if (!r || !r.ok) {
                // если не смогли зарезервировать — лучше отменить сценарий (на MVP просто скажем ошибку)
                return NextResponse.json({ ok: false, error: r?.error || "Не удалось зарезервировать промокод" }, { status: 400 });
            }
        }

        // можно уведомить в TG о создании заявки (не об оплате)
        await sendTelegram(
            `📝 <b>Новая заявка</b>\n` +
            `Игра: <b>${eventTitle}</b>\n` +
            `${eventDate ? `Дата: ${eventDate}\n` : ""}` +
            `${city ? `Город: ${city}\n` : ""}` +
            `Имя: <b>${name}</b>\n` +
            `${contact ? `Контакт: ${contact}\n` : ""}` +
            `${email ? `Email: ${email}\n` : ""}` +
            `Билет: <b>${ticket}</b>, кол-во: <b>${qty}</b>\n` +
            `Сумма: <b>${finalTotal} ₽</b>\n` + `Фракция: <b>${faction} ₽</b>\n` +
            + `Комментарий: <b>${message} ₽</b>\n` +
            `${promo ? `Промо: <b>${promo}</b> (${promoLabel})\n` : ""}` +
            `Payment: <code>${payment.id}</code>`
        );

        return NextResponse.json({
            ok: true,
            paymentUrl,
            paymentId: payment.id,
            ticketId,
        });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || "Ошибка" }, { status: 500 });
    }
}