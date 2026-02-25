"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const schema = z.object({
    name: z.string().min(2, "Как к тебе обращаться?"),
    contact: z.string().min(3, "Телефон или Telegram"),
    format: z.string().min(1, "Укажи формат"),
    guests: z.string().min(1, "Сколько гостей?"),
    city: z.string().optional(),
    date: z.string().optional(),
    message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RequestGameForm() {
    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
    const [errorText, setErrorText] = useState("");

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            contact: "",
            format: "День рождения / корпоратив / открытая игра",
            guests: "",
            city: "",
            date: "",
            message: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setStatus("sending");
        setErrorText("");

        try {
            const res = await fetch("/api/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                setStatus("error");
                setErrorText(json?.error || "Не удалось отправить. Попробуй ещё раз.");
                return;
            }

            setStatus("ok");
            form.reset();
        } catch (e: any) {
            setStatus("error");
            setErrorText(e?.message || "Ошибка сети");
        }
    }

    return (
        <section id="lead" className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 md:grid-cols-2 items-start">
                    <div>
                        <div className="text-sm tracking-wide text-zinc-200/70">Заявка</div>
                        <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-zinc-50">
                            Запросить игру
                        </h2>
                        <p className="mt-4 text-zinc-200/80 leading-relaxed">
                            Оставь контакты и пару деталей — я отвечу с вариантами формата и стоимости.
                        </p>

                        <div className="mt-6 rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-5">
                            <div className="text-sm text-zinc-200/80">
                                Быстрый путь — написать в Telegram:
                            </div>
                            <a
                                href="https://t.me/klyzhh"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex text-sm font-medium text-zinc-50 underline underline-offset-4 hover:text-zinc-200"
                            >
                                @klyzhh →
                            </a>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/45 p-5 md:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_70px_rgba(0,0,0,0.65)]">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm text-zinc-200/80">Имя</label>
                                    <Input className="mt-2" placeholder="Кирилл" {...form.register("name")} />
                                    {form.formState.errors.name && (
                                        <p className="mt-1 text-xs text-red-300">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-200/80">Контакт</label>
                                    <Input className="mt-2" placeholder="@username или +7..." {...form.register("contact")} />
                                    {form.formState.errors.contact && (
                                        <p className="mt-1 text-xs text-red-300">{form.formState.errors.contact.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm text-zinc-200/80">Формат</label>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        {[
                                            "День рождения",
                                            "Корпоратив",
                                            "Открытая игра",
                                            "Свой формат",
                                        ].map((option) => {
                                            const selected = form.watch("format") === option;

                                            return (
                                                <button
                                                    type="button"
                                                    key={option}
                                                    onClick={() => form.setValue("format", option)}
                                                    className={[
                                                        "relative overflow-hidden rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300",
                                                        selected
                                                            ? "border-zinc-50 bg-zinc-50 text-black shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.6)]"
                                                            : "border-zinc-800/70 bg-zinc-950/50 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900/60",
                                                    ].join(" ")}
                                                >
                                                    {/* мягкое сияние при выборе */}
                                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_20%_20%,rgba(234,179,8,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {form.formState.errors.format && (
                                        <p className="mt-1 text-xs text-red-300">
                                            {form.formState.errors.format.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-200/80">Гостей</label>
                                    <Input className="mt-2" placeholder="например, 40 или 150" {...form.register("guests")} />
                                    {form.formState.errors.guests && (
                                        <p className="mt-1 text-xs text-red-300">{form.formState.errors.guests.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm text-zinc-200/80">Город (опционально)</label>
                                    <Input className="mt-2" placeholder="Санкт-Петербург" {...form.register("city")} />
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-200/80">Дата (опционально)</label>
                                    <Input className="mt-2" placeholder="12 марта" {...form.register("date")} />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-zinc-200/80">Комментарий</label>
                                <Textarea className="mt-2 min-h-[110px]" placeholder="Пожелания по сюжету, площадке, времени…" {...form.register("message")} />
                            </div>

                            <Button type="submit" disabled={status === "sending"} className="w-full rounded-xl">
                                {status === "sending" ? "Отправляю…" : "Отправить заявку"}
                            </Button>

                            {status === "ok" && (
                                <div className="text-sm text-emerald-300/90">Заявка отправлена. Скоро отвечу 👌</div>
                            )}

                            {status === "error" && (
                                <div className="text-sm text-red-300/90">Не отправилось: {errorText}</div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
