import crypto from "node:crypto";

const SHOP_ID = process.env.YOOKASSA_SHOP_ID!;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!;

function authHeader() {
    const token = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64");
    return `Basic ${token}`;
}

export function makeIdempotenceKey() {
    return crypto.randomUUID();
}

export async function createPayment(params: {
    amountRub: number;
    description: string;
    returnUrl: string;
    metadata?: Record<string, any>;
}) {
    const idempotenceKey = makeIdempotenceKey();

    const body = {
        amount: { value: params.amountRub.toFixed(2), currency: "RUB" },
        confirmation: { type: "redirect", return_url: params.returnUrl },
        capture: true,
        description: params.description,
        metadata: params.metadata || {},
    };

    const res = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
            Authorization: authHeader(),
            "Content-Type": "application/json",
            "Idempotence-Key": idempotenceKey,
        },
        body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
        throw new Error(json?.description || json?.message || "YooKassa createPayment failed");
    }

    return json as {
        id: string;
        status: string;
        confirmation?: { confirmation_url?: string };
        amount: { value: string; currency: string };
        metadata?: Record<string, any>;
    };
}

export async function getPayment(paymentId: string) {
    const res = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
        method: "GET",
        headers: { Authorization: authHeader() },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.description || "YooKassa getPayment failed");
    return json as any;
}