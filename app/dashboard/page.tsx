import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect("/signin");

    return (
        <main className="min-h-screen bg-black text-zinc-100 px-6 py-16">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-semibold">Личный кабинет</h1>
                <div className="mt-4 rounded-3xl border border-zinc-800 bg-zinc-950/60 backdrop-blur p-6">
                    <div className="text-sm text-zinc-400">Вы вошли как:</div>
                    <div className="mt-2 text-lg">
                        {session.user?.name ?? "Без имени"} — {session.user?.email}
                    </div>
                    {/* дальше сюда добавим: “мои записи”, “мои билеты” */}
                </div>
            </div>
        </main>
    );
}