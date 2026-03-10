import nodemailer from "nodemailer";

function getTelegramConfig() {
    const token =
        process.env.TG_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "";
    const chatId =
        process.env.TG_CHAT_ID || process.env.TELEGRAM_CHAT_ID || "";

    return { token, chatId };
}

export async function sendTelegram(text: string) {
    const { token, chatId } = getTelegramConfig();
    if (!token || !chatId) return;

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                disable_web_page_preview: true,
            }),
        });
    } catch {
        // webhook / signup не должны падать из-за Telegram
    }
}

export async function sendTicketEmail(params: {
    to: string;
    subject: string;
    html: string;
}) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = (process.env.SMTP_SECURE || "true") === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.MAIL_FROM || user;

    if (!host || !user || !pass || !from) {
        throw new Error("SMTP env vars are not configured");
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });

    await transporter.sendMail({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
    });
}