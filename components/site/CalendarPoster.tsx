"use client";

import { useState } from "react";
import Image from "next/image";
import SignupDialog from "@/components/site/SignupDialog";

type EventItem = {
    title: string;
    date?: string;
    city?: string;
    place?: string;
    tag?: string;
    image?: string; // путь из /public
};

const events: EventItem[] = [
    {
        title: "Скоро",
        date: "дата уточняется",
        city: "СПб",
        place: "Площадка уточняется",
        tag: "Открытая игра",
        image: "/hero/01.png",
    },
    // {
    //     title: "Скоро",
    //     date: "Скоро (анонс в Telegram)",
    //     city: "СПб",
    //     place: "Площадка уточняется",
    //     tag: "",
    //     image: "/hero/02.png",
    // },
    // {
    //     title: "Спецвыпуск: Ночь решений",
    //     date: "Скоро (анонс в Telegram)",
    //     city: "СПб",
    //     place: "Площадка уточняется",
    //     tag: "Спецвыпуск",
    //     image: "/hero/03.png",
    // },
];

export default function CalendarPoster() {
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<{
        title: string;
        date?: string;
        city?: string;
    } | null>(null);

    return (
        <section id="calendar" className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <div className="text-sm tracking-wide text-zinc-200/70">Календарь</div>
                        <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-zinc-50">
                            Афиша игр
                        </h2>
                        <p className="mt-4 max-w-2xl text-zinc-200/80 leading-relaxed">
                            Нажми «Записаться» — откроется окно заявки. После отправки мне в Telegram прилетит новая запись,
                            а общий список обновится.
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {events.map((e) => (
                        <div
                            key={e.title}
                            className="group relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-5 md:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_70px_rgba(0,0,0,0.65)] hover:bg-zinc-900/35 transition"
                        >
                            {/* фон-картинка */}
                            {e.image && (
                                <div className="absolute inset-0 -z-10">
                                    <Image
                                        src={e.image}
                                        alt=""
                                        fill
                                        className="object-cover opacity-45 group-hover:opacity-65 transition duration-500"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-amber-400/10" />
                                </div>
                            )}

                            <div className="flex items-start justify-between gap-3">
                                <div className="text-xs text-zinc-200/70">
                                    {e.tag && (
                                        <div className="inline-flex rounded-full border border-zinc-800/80 bg-zinc-950/60 px-2 py-1">
                                            {e.tag}
                                        </div>
                                    )}
                                    {e.city && <div className="mt-2">{e.city}</div>}
                                </div>

                                <div className="h-10 w-10 rounded-full border border-zinc-800/70 bg-[radial-gradient(circle_at_30%_25%,rgba(234,179,8,0.18),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(34,197,94,0.14),transparent_60%)] opacity-70 group-hover:opacity-100 transition" />
                            </div>

                            <div className="mt-5 text-lg font-semibold text-zinc-50 leading-snug">
                                {e.title}
                            </div>

                            {e.place && <div className="mt-3 text-sm text-zinc-200/80">{e.place}</div>}

                            <div className="mt-6 flex items-center justify-between text-sm">
                                <span className="text-zinc-200/70">{e.date}</span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedEvent({ title: e.title, date: e.date, city: e.city });
                                        setOpen(true);
                                    }}
                                    className="font-medium text-zinc-50 group-hover:underline underline-offset-4"
                                >
                                    Записаться →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <SignupDialog open={open} onOpenChange={setOpen} event={selectedEvent} />
            </div>
        </section>
    );
}
