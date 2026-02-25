"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useMemo, useState, useCallback } from "react";

type Slide = { src: string; alt: string };

export default function HeroCarouselBackground() {
    const slides = useMemo<Slide[]>(
        () => [
            { src: "/hero/01.png", alt: "Ход Судьбы — атмосфера" },
            { src: "/hero/02.png", alt: "Ход Судьбы — игра" },
            { src: "/hero/03.png", alt: "Ход Судьбы — фракции" },
            { src: "/hero/04.png", alt: "Ход Судьбы — ведущий" },
        ],
        []
    );

    const autoplay = useMemo(
        () =>
            Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
            }),
        []
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "center" },
        [autoplay]
    );

    const [selected, setSelected] = useState(0);
    const [snaps, setSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelected(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setSnaps(emblaApi.scrollSnapList());
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-black/30 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_40px_140px_rgba(0,0,0,0.75)]">
            {/* Карусель фоном */}
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                    {slides.map((s, i) => (
                        <div key={s.src} className="relative flex-[0_0_100%]">
                            <div className="relative h-[520px] md:h-[640px]">
                                <Image
                                    src={s.src}
                                    alt={s.alt}
                                    fill
                                    className="object-cover"
                                    priority={i === 0}
                                    sizes="100vw"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Затемнение для читаемости текста */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />

            {/* Атмосферные подсветки */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(850px_circle_at_85%_20%,rgba(234,179,8,0.12),transparent_55%)]" />

            {/* Лёгкая виньетка */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_20%,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

            {/* Контент поверх */}
            <div className="absolute inset-0 flex items-end md:items-center">
                <div className="w-full px-6 py-10 md:px-10 md:py-0">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-black/40 px-4 py-2 text-sm text-zinc-200 backdrop-blur">
                            офлайн-ивент • интриги • приказы • 40–200 гостей
                        </div>

                        <h1 className="mt-6 text-4xl md:text-7xl font-semibold tracking-tight text-zinc-50">
                            Ход Судьбы
                        </h1>

                        <p className="mt-6 max-w-2xl text-base md:text-lg text-zinc-200/85 leading-relaxed">
                            Массовая офлайн D&D-игра в викторианском Лондоне. Не квиз и не про “правильные ответы”
                            — про решения, влияние и последствия в реальном времени.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#lead"
                                className="rounded-xl bg-zinc-50 px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]"
                            >
                                Запросить дату
                            </a>
                            <a
                                href="#how"
                                className="rounded-xl border border-zinc-800/80 bg-black/30 px-5 py-3 text-sm font-medium text-zinc-50 hover:bg-black/40 transition backdrop-blur"
                            >
                                Как это работает
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Точки навигации (внизу) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {snaps.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Слайд ${i + 1}`}
                        onClick={() => emblaApi?.scrollTo(i)}
                        className={[
                            "h-2 rounded-full transition backdrop-blur",
                            i === selected
                                ? "w-8 bg-zinc-50/90"
                                : "w-2 bg-zinc-400/40 hover:bg-zinc-200/60",
                        ].join(" ")}
                    />
                ))}
            </div>
        </div>
    );
}
