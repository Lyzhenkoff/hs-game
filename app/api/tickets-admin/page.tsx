import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function logout() {
    "use server";

    const cookieStore = await cookies();
    cookieStore.set("tickets_admin_auth", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });

    redirect("/tickets-admin/login");
}

export default async function TicketsAdminPage() {
    const cookieStore = await cookies();
    const isAuthed = cookieStore.get("tickets_admin_auth")?.value === "1";

    if (!isAuthed) {
        redirect("/tickets-admin/login");
    }

    const registrations = await prisma.registration.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen bg-black text-white px-6 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                            Закрытый раздел
                        </div>
                        <h1 className="mt-2 text-3xl font-semibold">Купленные билеты</h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Всего заявок: {registrations.length}
                        </p>
                    </div>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-900"
                        >
                            Выйти
                        </button>
                    </form>
                </div>

                <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/50">
                    <table className="w-full min-w-[1400px] text-sm">
                        <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-300">
                        <tr>
                            <th className="px-4 py-3 text-left">Дата</th>
                            <th className="px-4 py-3 text-left">Игра</th>
                            <th className="px-4 py-3 text-left">Имя</th>
                            <th className="px-4 py-3 text-left">Контакт</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Команда</th>
                            <th className="px-4 py-3 text-left">Фракция</th>
                            <th className="px-4 py-3 text-left">Билет</th>
                            <th className="px-4 py-3 text-left">Кол-во</th>
                            <th className="px-4 py-3 text-left">Сумма</th>
                            <th className="px-4 py-3 text-left">Статус</th>
                            <th className="px-4 py-3 text-left">Ticket ID</th>
                            <th className="px-4 py-3 text-left">Payment ID</th>
                        </tr>
                        </thead>

                        <tbody>
                        {registrations.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-zinc-900 align-top"
                            >
                                <td className="px-4 py-3 text-zinc-300">
                                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                                </td>

                                <td className="px-4 py-3">
                                    <div className="font-medium">{item.eventTitle}</div>
                                    <div className="text-xs text-zinc-500">
                                        {item.eventDate || "—"}
                                        {item.city ? ` • ${item.city}` : ""}
                                    </div>
                                </td>

                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3 text-zinc-300">
                                    {item.contact || "—"}
                                </td>
                                <td className="px-4 py-3 text-zinc-300">
                                    {item.email || "—"}
                                </td>
                                <td className="px-4 py-3 text-zinc-300">
                                    {item.teamName || "—"}
                                </td>
                                <td className="px-4 py-3 text-zinc-300">
                                    {item.faction || "—"}
                                </td>
                                <td className="px-4 py-3">{item.ticket}</td>
                                <td className="px-4 py-3">{item.qty}</td>
                                <td className="px-4 py-3">{item.payableTotal} ₽</td>
                                <td className="px-4 py-3">
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs">
                      {item.status}
                    </span>
                                </td>
                                <td className="px-4 py-3 text-zinc-400">
                                    {item.ticketId || "—"}
                                </td>
                                <td className="px-4 py-3 text-zinc-400">
                                    {item.paymentId || "—"}
                                </td>
                            </tr>
                        ))}

                        {registrations.length === 0 && (
                            <tr>
                                <td
                                    colSpan={13}
                                    className="px-4 py-10 text-center text-zinc-500"
                                >
                                    Пока нет заявок
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}