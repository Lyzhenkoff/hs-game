"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/05.jpeg",
    "/gallery/06.jpeg",
];

export default function GallerySection() {
    return (
        <section className="border-t border-zinc-900 bg-black">
            <div className="mx-auto max-w-6xl px-6 py-20">
                <h2 className="text-2xl md:text-4xl font-semibold mb-4">
                    Атмосфера мероприятий
                </h2>

                <p className="text-white/50 text-sm md:text-base mb-12 max-w-xl">
                    Настоящие эмоции, переговоры, напряжённые финалы и решения,
                    которые меняют ход истории.
                </p>

                {/* Мобилка — горизонтальный скролл */}
                <div className="flex gap-4 overflow-x-auto pb-4 md:hidden scrollbar-hide">
                    {photos.map((src, i) => (
                        <PhotoCard key={i} src={src} />
                    ))}
                </div>

                {/* Десктоп — сетка */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {photos.map((src, i) => (
                        <PhotoCard key={i} src={src} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PhotoCard({ src }: { src: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative min-w-[260px] md:min-w-0 aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950"
        >
            <Image
                src={src}
                alt="Мероприятие Ход Судьбы"
                fill
                className="object-cover hover:scale-105 transition duration-700"
            />

            {/* затемнение для премиальности */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
    );
}