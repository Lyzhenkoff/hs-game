"use client";

import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Александр",
        role: "Корпоратив 25 человек",
        text: "Это был не просто вечер, а полноценная история. Люди, которые обычно молчат, вели переговоры. Те, кто спорят — строили союзы. Это сильный формат.",
    },
    {
        name: "Мария",
        role: "День рождения",
        text: "Самое удивительное — как быстро мы забыли, что это игра. Начались настоящие эмоции, интриги и стратегии. Финал обсуждали ещё неделю.",
    },
    {
        name: "Илья",
        role: "Закрытое клубное событие",
        text: "Редко встречается формат, где интеллектуальная глубина сочетается с азартом. Это ощущается как элитное событие, а не развлечение.",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="border-t border-zinc-900 bg-black">
            <div className="mx-auto max-w-6xl px-6 py-20">
                <h2 className="text-2xl md:text-4xl font-semibold mb-12">
                    Отзывы гостей
                </h2>

                <div className="grid gap-6 md:grid-cols-3">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-sm"
                        >
                            <p className="text-sm text-white/80 leading-relaxed">
                                “{t.text}”
                            </p>

                            <div className="mt-6 text-xs text-white/50">
                                <div className="font-medium text-white/70">{t.name}</div>
                                <div>{t.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}