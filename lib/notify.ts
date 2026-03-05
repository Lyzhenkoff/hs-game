import nodemailer from "nodemailer";

export async function sendTelegram(text: string) {
    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    if (!token || !chatId) return;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    }).catch(() => {});
}

export async function sendTicketEmail(params: {
    to: string;
    subject: string;
    html: string;
}) {
    const host = process.env.SMTP_HOST!;
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = (process.env.SMTP_SECURE || "true") === "true";
    const user = process.env.SMTP_USER!;
    const pass = process.env.SMTP_PASS!;
    const from = process.env.MAIL_FROM || user;

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