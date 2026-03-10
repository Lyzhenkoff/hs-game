"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignupDialog from "@/components/site/SignupDialog";

const upcomingEvent = {
    title: "Последняя песнь Порто-Неро",
    date: "29 марта • 18:00",
    city: "Бар «Зов Сирен», Садовая, 25",
};

export default function HeroBanner() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <section className="relative overflow-hidden bg-black text-white">
                <div className="absolute inset-0 bg-[url('public/gallery/poster.png')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
                    <div className="max-w-3xl">
                        <div className="text-sm uppercase tracking-[0.25em] text-zinc-300">
                            Ближайшая игра
                        </div>

                        <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight">
                            {upcomingEvent.title}
                        </h1>

                        <p className="mt-6 text-lg text-zinc-200 leading-relaxed">
                            В ночном море у берегов Порто-Неро снова слышат странное пение.
                            Корабли исчезают у рифов, в городе растёт напряжение, а каждая
                            фракция готовится сделать свой ход.
                        </p>

                        <div className="mt-6 text-base text-zinc-300 space-y-1">
                            <div>{upcomingEvent.date}</div>
                            <div>{upcomingEvent.city}</div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button className="rounded-xl px-6 py-3" onClick={() => setOpen(true)}>
                                Записаться на игру
                            </Button>

                            <a
                                href="#about-game"
                                className="inline-flex items-center rounded-xl border border-zinc-700 px-6 py-3 text-sm text-white hover:bg-zinc-900 transition"
                            >
                                Подробнее
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <SignupDialog
                open={open}
                onOpenChange={setOpen}
                event={{
                    title: "Последняя песнь Порто-Неро",
                    date: "29 марта • 18:00",
                    city: "Бар «Зов Сирен», Садовая, 25",
                }}
            />
        </>
    );
}