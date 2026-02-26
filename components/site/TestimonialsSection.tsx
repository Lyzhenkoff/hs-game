"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Илья Князькин",
        role: "Ночь решений 23/02",
        avatar: "/avatars/guest1.jpg",
        text: "Это был не просто вечер, а полноценная история. Люди, которые обычно молчат, вели переговоры. Те, кто спорят — строили союзы.",
    },
    {
        name: "Полина Трескина",
        role: "Ночь решений 23/02",
        avatar: "/avatars/guest2.jpg",
        text: "Самое удивительное — как быстро мы забыли, что это игра. Начались настоящие эмоции и интриги. Финал обсуждали ещё неделю.",
    },
    {
        name: "Александр Панферов",
        role: "Ночь решений 23/02",
        avatar: "/avatars/guest3.jpg",
        text: "Редко встречается формат, где интеллектуальная глубина сочетается с азартом. Это ощущается как элитное событие.",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="border-t border-zinc-900 bg-black">
            <div className="mx-auto max-w-6xl px-6 py-20">
                <h2 className="text-2xl md:text-4xl font-semibold mb-12">
                    Отзывы гостей
                </h2>

                {/* Мобилка — горизонтальный скролл */}
                <div className="flex gap-6 overflow-x-auto pb-4 md:hidden scrollbar-hide">
                    {testimonials.map((t, index) => (
                        <Card key={index} t={t} />
                    ))}
                </div>

                {/* Десктоп — сетка */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, index) => (
                        <Card key={index} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Card({ t }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="min-w-[280px] md:min-w-0 rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 backdrop-blur-sm"
        >
            <p className="text-sm text-white/80 leading-relaxed">
                “{t.text}”
            </p>

            <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12">
                    <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="rounded-full object-cover border border-zinc-800"
                    />
                </div>

                <div className="text-xs">
                    <div className="font-medium text-white/80">{t.name}</div>
                    <div className="text-white/50">{t.role}</div>
                </div>
            </div>
        </motion.div>
    );
}