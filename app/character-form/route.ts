import { NextResponse } from "next/server";

type Payload = {
    fullName: string;
    characterName: string;
    ageRange: "18–25" | "25–35" | "35–50" | "50+";
    socialLevel: "элита" | "средний слой" | "низший слой" | "вне системы";
    sphere: "политика" | "экономика" | "культура" | "силовые структуры" | "теневая деятельность";
    personality: string[]; // 3–4
    ambitionWants: string[];
    ambitionHorizon: "краткосрочные" | "долгосрочные";
    risk: "осторожный игрок" | "идёт ва-банк" | "рискует только если уверен" | "любит хаос";
    interaction: string[];
    maskPublic: string;
    maskReal: string;
    temperament: "холодный" | "горячий" | "уравновешенный" | "нервный" | "ироничный" | "строгий";
    // антиспам поле (если захотим): honey?: string;
};

export async function POST(req: Request) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return NextResponse.json({ error: "Missing TELEGRAM env vars" }, { status: 500 });
    }

    let data: Payload;
    try {
        data = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Мини-валидация
    if (!data.fullName?.trim() || !data.characterName?.trim()) {
        return NextResponse.json({ error: "fullName and characterName are required" }, { status: 400 });
    }

    const text =
        `🧩 Новая анкета персонажа

👤 Заказчик: ${data.fullName}
🎭 Имя персонажа: ${data.characterName}
🎂 Возраст: ${data.ageRange}
🏛 Соц. уровень: ${data.socialLevel}
🧭 Сфера: ${data.sphere}

🧠 Тип личности: ${data.personality.join(", ")}

🚀 Амбиция хочет: ${data.ambitionWants.join(", ")}
⏳ Горизонт: ${data.ambitionHorizon}

🎲 Риск: ${data.risk}
🤝 Взаимодействие: ${data.interaction.join(", ")}

🎭 Маска (кажется): ${data.maskPublic}
🕵️ Реальность: ${data.maskReal}

🌡 Темперамент: ${data.temperament}
`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: "Telegram send failed", details: errText }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}