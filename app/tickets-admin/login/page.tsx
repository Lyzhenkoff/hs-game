"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketsAdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [errorText, setErrorText] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setErrorText("");

        try {
            const res = await fetch("/api/tickets-admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Не удалось войти");
            }

            router.push("/tickets-admin");
            router.refresh();
        } catch (e: any) {
            setStatus("error");
            setErrorText(e?.message || "Ошибка");
        }
    }

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
                <div className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                    Закрытый раздел
                </div>

                <h1 className="mt-3 text-2xl font-semibold">
                    Вход в раздел билетов
                </h1>

                <p className="mt-3 text-sm text-zinc-400">
                    Введите пароль, чтобы открыть список купленных билетов.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 outline-none focus:border-zinc-600"
                            placeholder="Введите пароль"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading" || !password.trim()}
                        className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:opacity-60"
                    >
                        {status === "loading" ? "Входим..." : "Войти"}
                    </button>

                    {status === "error" && (
                        <div className="text-sm text-red-300">{errorText}</div>
                    )}
                </form>
            </div>
        </main>
    );
}