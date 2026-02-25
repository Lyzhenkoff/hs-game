import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        bot: Boolean(process.env.TELEGRAM_BOT_TOKEN),
        chat: Boolean(process.env.TELEGRAM_CHAT_ID),
    });
}
