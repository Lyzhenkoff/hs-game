"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";

type Slide = { src: string; alt: string };

export default function HeroCarousel({
                                         slides,
                                     }: {
    slides?: Slide[];
}) {
    const items = useMemo<Slide[]>(
        () =>
            slides ?? [
                { src: "/hero/01.png", alt: "Ход Судьбы — атмосфера" },
                { src: "/hero/02.png", alt: "Ход Судьбы — игра" },
                { src: "/hero/03.png", alt: "Ход Судьбы — фракции" },
                { src: "/hero/04.png", alt: "Ход Судьбы — ведущий" },
            ],
        [slides]
    );

    const autoplay = useMemo(
        () =>
            Autoplay({
                delay: 4500,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
            }),
        []
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            dragFree: false,
        },
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
        <div className="mt-10">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-950/30 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_40px_140px_rgba(0,0,0,0.75)]">
                {/* viewport */}
                <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex">
                        {items.map((s, i) => (
                            <div
                                key={s.src}
                                className="relative min-w-0 flex-[0_0_88%] md:flex-[0_0_62%] lg:flex-[0_0_52%] p-3 md:p-4"
                            >
                                <div className="relative h-[220px] md:h-[280px] lg:h-[320px] overflow-hidden rounded-2xl">
                                    <Image
                                        src={s.src}
                                        alt={s.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 88vw, (max-width: 1024px) 62vw, 52vw"
                                        priority={i === 0}
                                    />
                                    {/* затемнение + “туман” для стиля */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
                                    <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_15%,rgba(34,197,94,0.14),transparent_55%),radial-gradient(700px_circle_at_85%_20%,rgba(234,179,8,0.10),transparent_55%)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* точки */}
                <div className="flex items-center justify-between gap-4 px-5 pb-5">
                    <div className="flex gap-2">
                        {snaps.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Перейти к слайду ${i + 1}`}
                                onClick={() => emblaApi?.scrollTo(i)}
                                className={[
                                    "h-2.5 rounded-full transition",
                                    i === selected
                                        ? "w-8 bg-zinc-50"
                                        : "w-2.5 bg-zinc-500/50 hover:bg-zinc-400/70",
                                ].join(" ")}
                            />
                        ))}
                    </div>

                    <div className="text-xs text-zinc-200/60">
                        Листай → (свайп/трекпад)
                    </div>
                </div>
            </div>
        </div>
    );
}
