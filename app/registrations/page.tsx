import prisma from "@/lib/prisma";
export default async function AdminRegistrationsPage() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            registrations: { orderBy: { createdAt: "desc" } },
        },
    });

    return (
        <main className="min-h-screen bg-black text-zinc-100 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-semibold">Регистрации</h1>

                <div className="mt-8 space-y-8">
                    {events.map((ev) => (
                        <section key={ev.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
                            <div className="flex items-baseline justify-between gap-4">
                                <div>
                                    <div className="text-xl font-semibold">{ev.title}</div>
                                    <div className="text-sm text-zinc-400">
                                        {ev.city || "—"} • {ev.date ? new Date(ev.date).toLocaleString("ru-RU") : "дата уточняется"} • {ev.status}
                                    </div>
                                </div>
                                <div className="text-sm text-zinc-300">
                                    Записей: <span className="font-semibold">{ev.registrations.length}</span>
                                </div>
                            </div>

                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-zinc-400">
                                    <tr className="border-b border-zinc-800">
                                        <th className="py-2 text-left">Время</th>
                                        <th className="py-2 text-left">Имя</th>
                                        <th className="py-2 text-left">Контакт</th>
                                        <th className="py-2 text-left">Формат</th>
                                        <th className="py-2 text-left">Мест</th>
                                        <th className="py-2 text-left">Билет</th>
                                        <th className="py-2 text-left">Фракция</th>
                                        <th className="py-2 text-left">Команда</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ev.registrations.map((r) => (
                                        <tr key={r.id} className="border-b border-zinc-900/60">
                                            <td className="py-2 text-zinc-300">{new Date(r.createdAt).toLocaleString("ru-RU")}</td>
                                            <td className="py-2">{r.name}</td>
                                            <td className="py-2 text-zinc-200">{r.contact}</td>
                                            <td className="py-2">{r.mode}</td>
                                            <td className="py-2">{r.seats}</td>
                                            <td className="py-2">{r.ticket} ₽</td>
                                            <td className="py-2">{r.faction || "—"}</td>
                                            <td className="py-2">{r.teamName || "—"}</td>
                                        </tr>
                                    ))}
                                    {ev.registrations.length === 0 && (
                                        <tr>
                                            <td className="py-4 text-zinc-500" colSpan={8}>
                                                Пока нет регистраций
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ))}

                    {events.length === 0 && (
                        <div className="text-zinc-400">
                            Пока нет событий в базе. Добавим создание событий следующим шагом.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}