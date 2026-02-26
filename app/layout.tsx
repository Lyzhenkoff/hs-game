// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata: Metadata = {
    title: "Ход Судьбы",
    description: "Ход Судьбы — иммерсивная стратегическая игра с фракциями, интригами и борьбой за влияние. Открытые игры и частные мероприятия.",
        metadataBase: new URL("https://hs-game.ru"),
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body>
        <Providers>{children}</Providers>
        export default function RootLayout({ children }: { children: React.ReactNode }) {
            return (
            <html lang="ru">
            <body>
        {children}
        <SpeedInsights />
        </body>
        </html>
    );
}
        </body>
        </html>
    );
}