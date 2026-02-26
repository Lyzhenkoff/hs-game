"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const photos = [
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/06.jpeg",
];

export default function GallerySection() {
    const [active, setActive] = useState<string | null>(null);

    return (
        <section className="relative border-t border-zinc-900 bg-black overflow-hidden">

            {/* FOG BACKGROUND */}
            <div className="fog-layer">
                <div className="fog" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-6 py-20">            <div className="mx-auto max-w-6xl px-6 py-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-semibold">
                            Атмосфера мероприятий
                        </h2>
                        <p className="text-white/50 text-sm md:text-base mt-3 max-w-xl">
                            Настоящие эмоции, напряжённые переговоры и финалы,
                            которые меняют ход истории.
                        </p>
                    </div>

                    <Link
                        href="/gallery"
                        className="hidden md:inline-block text-sm text-white/70 hover:text-white transition"
                    >
                        Смотреть все фото →
                    </Link>
                </div>

                {/* Мобилка */}
                <div className="flex gap-4 overflow-x-auto pb-4 md:hidden scrollbar-hide">
                    {photos.map((src, i) => (
                        <PhotoCard key={i} src={src} onClick={() => setActive(src)} />
                    ))}
                </div>

                {/* Десктоп */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {photos.map((src, i) => (
                        <PhotoCard key={i} src={src} onClick={() => setActive(src)} />
                    ))}
                </div>

                {/* Кнопка на мобилке */}
                <div className="mt-10 md:hidden text-center">
                    <Link
                        href="/gallery"
                        className="text-sm text-white/70 hover:text-white transition"
                    >
                        Смотреть все фото →
                    </Link>
                </div>
            </div>

            {/* FULLSCREEN */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActive(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative max-w-5xl w-full aspect-[4/5]"
                        >
                            <Image
                                src={active}
                                alt="Мероприятие"
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function PhotoCard({
                       src,
                       onClick,
                   }: {
    src: string;
    onClick: () => void;
}) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            className="relative min-w-[260px] md:min-w-0 aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 cursor-pointer"
        >
            <Image
                src={src}
                alt="Мероприятие"
                fill
                className="object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
    );
}