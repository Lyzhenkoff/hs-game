import Divider from "@/components/site/Divider";
import AnimatedSection from "@/components/site/AnimatedSection";

type Faction = {
    id: string;
    title: string;
    motto: string;
    vibe: string;
    bullets: string[];
    accent: "amber" | "emerald" | "zinc";
};

const factions: Faction[] = [
    {
        id: "crown",
        title: "Корона",
        motto: "Порядок важнее правды.",
        vibe: "Статус • традиции • контроль",
        bullets: ["Держит церемонию любой ценой", "Ищет удобную официальную версию", "Собирает союзников тихо"],
        accent: "amber",
    },
    {
        id: "industry",
        title: "Промышленники",
        motto: "Ресурсы решают всё.",
        vibe: "Деньги • влияние • сделки",
        bullets: ["Торгует поддержкой и компроматом", "Продавливает реформы через кризисы", "Ставит прибыль выше морали"],
        accent: "zinc",
    },
    {
        id: "intelligentsia",
        title: "Интеллигенция",
        motto: "Без кризиса нет перемен.",
        vibe: "Идеи • реформы • стратегия",
        bullets: ["Думает на 3 хода вперёд", "Играет смыслами и общественным мнением", "Обожает сложные планы"],
        accent: "emerald",
    },
    {
        id: "guard",
        title: "Стража и Следственная палата",
        motto: "Факты. Порядок. Вердикт.",
        vibe: "Расследование • давление • закон",
        bullets: ["Собирает улики и версии", "Может действовать жёстко", "Играет между правдой и стабильностью"],
        accent: "zinc",
    },
    {
        id: "crafts",
        title: "Ремесленники",
        motto: "Город держится на руках.",
        vibe: "Гильдии • мастерство • община",
        bullets: ["Умеют объединяться", "Давят числом и репутацией", "Могут “перекрыть кислород” городу"],
        accent: "amber",
    },
    {
        id: "artists",
        title: "Артисты",
        motto: "Сцена — оружие.",
        vibe: "Шум • харизма • провокация",
        bullets: ["Управляют толпой и слухами", "Разгоняют эмоции", "Могут перевернуть зал одним выступлением"],
        accent: "emerald",
    },
];

function accentClasses(accent: Faction["accent"]) {
    if (accent === "amber") {
        return {
            ring: "hover:border-amber-300/40",
            glow: "bg-[radial-gradient(700px_circle_at_20%_15%,rgba(234,179,8,0.18),transparent_55%)]",
            dot: "bg-amber-300/70",
        };
    }
    if (accent === "emerald") {
        return {
            ring: "hover:border-emerald-300/35",
            glow: "bg-[radial-gradient(700px_circle_at_20%_15%,rgba(34,197,94,0.18),transparent_55%)]",
            dot: "bg-emerald-300/70",
        };
    }
    return {
        ring: "hover:border-zinc-300/25",
        glow: "bg-[radial-gradient(700px_circle_at_20%_15%,rgba(244,244,245,0.10),transparent_55%)]",
        dot: "bg-zinc-300/60",
    };
}

export default function FactionsSection() {
    return (
        <AnimatedSection id="factions" className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <div className="text-sm tracking-wide text-zinc-200/70">Мир игры</div>
                        <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-zinc-50">
                            Фракции
                        </h2>
                        <p className="mt-4 max-w-2xl text-zinc-200/80 leading-relaxed">
                            В “Ходе Судьбы” вы играете командами, но каждая команда — часть фракции со своими целями.
                            Союзы меняются, версии фабрикуются, город дышит кризисом.
                        </p>
                    </div>

                    <a
                        href="#lead"
                        className="hidden md:inline-flex rounded-xl border border-zinc-800/80 bg-black/30 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-black/40 transition"
                    >
                        Запросить игру →
                    </a>
                </div>

                <Divider className="my-8" />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {factions.map((f) => {
                        const a = accentClasses(f.accent);
                        return (
                            <div
                                key={f.id}
                                className={[
                                    "group relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-5 md:p-6",
                                    "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_70px_rgba(0,0,0,0.65)]",
                                    "transition hover:bg-zinc-900/35",
                                    a.ring,
                                ].join(" ")}
                            >
                                {/* glow */}
                                <div className={["pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500", a.glow].join(" ")} />

                                <div className="relative flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={["h-2 w-2 rounded-full", a.dot].join(" ")} />
                                            <div className="text-xs text-zinc-200/70">{f.vibe}</div>
                                        </div>

                                        <div className="mt-3 text-lg font-semibold text-zinc-50">{f.title}</div>
                                        <div className="mt-2 text-sm text-zinc-200/80 italic">“{f.motto}”</div>
                                    </div>

                                    <div className="h-10 w-10 rounded-full border border-zinc-800/70 bg-black/30 opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <span className="text-sm text-zinc-50">HS</span>
                                    </div>
                                </div>

                                <ul className="relative mt-5 space-y-2 text-sm text-zinc-200/80">
                                    {f.bullets.map((b) => (
                                        <li key={b} className="flex gap-2">
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500/60" />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="relative mt-6 text-xs text-zinc-200/60">
                                    На игре вы будете писать приказы, вести переговоры и менять баланс сил.
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 md:hidden">
                    <a
                        href="#lead"
                        className="inline-flex rounded-xl border border-zinc-800/80 bg-black/30 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-black/40 transition"
                    >
                        Запросить игру →
                    </a>
                </div>
            </div>
        </AnimatedSection>
    );
}
