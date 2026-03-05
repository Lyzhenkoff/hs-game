import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type Promo =
    | { code: string; type: "FREE_ONE"; status: "new" | "reserved" | "used"; reservedPaymentId?: string; usedAt?: string }
    | { code: string; type: "PERCENT"; percent: 10 | 15; status: "new" | "reserved" | "used"; reservedPaymentId?: string; usedAt?: string };

const DATA_DIR = path.join(process.cwd(), "data");
const PROMO_FILE = path.join(DATA_DIR, "promos.json");

function ensureFile() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(PROMO_FILE)) {
        const seed: Promo[] = [
            // 6 ДР free
            { code: "DR-HS-01", type: "FREE_ONE", status: "new" },
            { code: "DR-HS-02", type: "FREE_ONE", status: "new" },
            { code: "DR-HS-03", type: "FREE_ONE", status: "new" },
            { code: "DR-HS-04", type: "FREE_ONE", status: "new" },
            { code: "DR-HS-05", type: "FREE_ONE", status: "new" },
            { code: "DR-HS-06", type: "FREE_ONE", status: "new" },

            // 8 MEM free
            { code: "MEM-FREE-01", type: "FREE_ONE", status: "new" },
            { code: "MEM-FREE-02", type: "FREE_ONE", status: "new" },
            { code: "MEM-FREE-03", type: "FREE_ONE", status: "new" },
            { code: "MEM-FREE-04", type: "FREE_ONE", status: "new" },
            { code: "MEM-FREE-05", type: "FREE_ONE", status: "new" },
            { code: "MEM-FREE-06", type: "FREE_ONE", status: "new" },
            { code: "MEM-FREE-07", type: "FREE_ONE", status: "new" },
            { code: "MEM-FREE-08", type: "FREE_ONE", status: "new" },

            // 1 MEM 15%
            { code: "MEM-15", type: "PERCENT", percent: 15, status: "new" },

            // 3 MEM 10%
            { code: "MEM-10-01", type: "PERCENT", percent: 10, status: "new" },
            { code: "MEM-10-02", type: "PERCENT", percent: 10, status: "new" },
            { code: "MEM-10-03", type: "PERCENT", percent: 10, status: "new" },
        ];
        fs.writeFileSync(PROMO_FILE, JSON.stringify(seed, null, 2), "utf8");
    }
}

function readAll(): Promo[] {
    ensureFile();
    return JSON.parse(fs.readFileSync(PROMO_FILE, "utf8")) as Promo[];
}

function writeAll(list: Promo[]) {
    fs.writeFileSync(PROMO_FILE, JSON.stringify(list, null, 2), "utf8");
}

export function normCode(s: string) {
    return (s || "").trim().toUpperCase();
}

/** Посчитать новую сумму */
export function applyPromoToTotal(promo: Promo, total: number, ticketPrice: number) {
    if (promo.type === "FREE_ONE") {
        const discount = Math.min(ticketPrice, total);
        return { discount, newTotal: Math.max(0, total - discount), label: "1 билет бесплатно" };
    }
    const discount = Math.floor((total * promo.percent) / 100);
    return { discount, newTotal: Math.max(0, total - discount), label: `Скидка ${promo.percent}%` };
}

/** Забронировать промокод под paymentId */
export function reservePromo(codeRaw: string, paymentId: string) {
    const code = normCode(codeRaw);
    if (!code) return null;

    const all = readAll();
    const idx = all.findIndex(p => normCode(p.code) === code);
    if (idx === -1) return { ok: false as const, error: "Промокод не найден" };

    const p = all[idx];

    if (p.status === "used") return { ok: false as const, error: "Промокод уже использован" };

    // если уже reserved другим платежом — не даём
    if (p.status === "reserved" && p.reservedPaymentId && p.reservedPaymentId !== paymentId) {
        return { ok: false as const, error: "Промокод уже зарезервирован" };
    }

    all[idx] = { ...p, status: "reserved", reservedPaymentId: paymentId };
    writeAll(all);
    return { ok: true as const, promo: all[idx] };
}

export function markPromoUsedByPayment(paymentId: string) {
    const all = readAll();
    const idx = all.findIndex(p => p.status === "reserved" && p.reservedPaymentId === paymentId);
    if (idx === -1) return { ok: false as const, error: "Промокод для платежа не найден" };

    const p = all[idx];
    all[idx] = { ...p, status: "used", usedAt: new Date().toISOString() } as Promo;
    writeAll(all);
    return { ok: true as const, promo: all[idx] };
}

export function releasePromoByPayment(paymentId: string) {
    const all = readAll();
    const idx = all.findIndex(p => p.status === "reserved" && p.reservedPaymentId === paymentId);
    if (idx === -1) return { ok: false as const };

    const p = all[idx];
    // возвращаем в new
    all[idx] = { ...p, status: "new", reservedPaymentId: undefined } as Promo;
    writeAll(all);
    return { ok: true as const };
}

/** генератор “номера билета” */
export function makeTicketId() {
    return crypto.randomBytes(6).toString("hex").toUpperCase();
}