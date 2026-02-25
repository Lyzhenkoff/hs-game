"use client";

import { useMemo, useState } from "react";

const PERSONALITY = [
    "расчётливый","импульсивный","стратег","манипулятор","идеалист","прагматик",
    "амбициозный","осторожный","конфликтный","харизматичный","закрытый","дипломатичный",
];

const AMBITION_WANTS = [
    "усилить своё влияние","сохранить статус","разрушить систему","встроиться в систему",
    "стать незаменимым","заработать","контролировать",
];

const INTERACTION = [
    "предпочитает личные переговоры","работает через посредников","давит авторитетом",
    "торгуется","шантажирует","строит союзы","действует в одиночку",
];

export default function CharacterFormPage({ searchParams }: any) {
    // Если хочешь доступ только по ссылке с ключом — раскомментируй и добавь CHAR_FORM_KEY в env
    // const keyOk = searchParams?.key === process.env.NEXT_PUBLIC_CHAR_FORM_KEY; // (лучше проверять на сервере, но для простоты так)
    // если сделаем правильно: проверку key надо делать в middleware или серверном компоненте

    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState<null | "ok" | "err">(null);

    const [fullName, setFullName] = useState("");
    const [characterName, setCharacterName] = useState("");
    const [ageRange, setAgeRange] = useState<"18–25" | "25–35" | "35–50" | "50+">("25–35");
    const [socialLevel, setSocialLevel] = useState<"элита" | "средний слой" | "низший слой" | "вне системы">("средний слой");
    const [sphere, setSphere] = useState<"политика" | "экономика" | "культура" | "силовые структуры" | "теневая деятельность">("политика");

    const [personality, setPersonality] = useState<string[]>([]);
    const [ambitionWants, setAmbitionWants] = useState<string[]>([]);
    const [ambitionHorizon, setAmbitionHorizon] = useState<"краткосрочные" | "долгосрочные">("долгосрочные");

    const [risk, setRisk] = useState<"осторожный игрок" | "идёт ва-банк" | "рискует только если уверен" | "любит хаос">("рискует только если уверен");
    const [interaction, setInteraction] = useState<string[]>([]);

    const [maskPublic, setMaskPublic] = useState("");
    const [maskReal, setMaskReal] = useState("");
    const [temperament, setTemperament] = useState<"холодный" | "горячий" | "уравновешенный" | "нервный" | "ироничный" | "строгий">("уравновешенный");

    const canSubmit = useMemo(() => {
        if (!fullName.trim() || !characterName.trim()) return false;
        if (personality.length < 3 || personality.length > 4) return false;
        if (!maskPublic.trim() || !maskReal.trim()) return false;
        return true;
    }, [fullName, characterName, personality, maskPublic, maskReal]);

    function toggle(list: string[], value: string, max?: number) {
        const has = list.includes(value);
        if (has) return list.filter((x) => x !== value);
        if (max && list.length >= max) return list; // не добавляем больше max
        return [...list, value];
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setSent(null);

        try {
            const res = await fetch("/api/character-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    characterName,
                    ageRange,
                    socialLevel,
                    sphere,
                    personality,
                    ambitionWants,
                    ambitionHorizon,
                    risk,
                    interaction,
                    maskPublic,
                    maskReal,
                    temperament,
                }),
            });

            if (!res.ok) throw new Error("bad response");
            setSent("ok");
        } catch {
            setSent("err");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-10 text-zinc-50">
            <h1 className="text-2xl md:text-4xl font-semibold">Анкета персонажа</h1>
            <p className="mt-2 text-zinc-200/70">
                Заполни базовые параметры — мы соберём героя под твою игру.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-8">
                {/* 1. Базовая рамка */}
                <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">1. Базовая рамка</h2>

                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Твоё ФИО</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                            placeholder="Иванов Иван"
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Имя персонажа</label>
                        <input
                            value={characterName}
                            onChange={(e) => setCharacterName(e.target.value)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                            placeholder="Например: Артур Хейл"
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Возраст</label>
                        <select
                            value={ageRange}
                            onChange={(e) => setAgeRange(e.target.value as any)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                        >
                            <option>18–25</option>
                            <option>25–35</option>
                            <option>35–50</option>
                            <option>50+</option>
                        </select>
                    </div>

                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Социальный уровень</label>
                        <select
                            value={socialLevel}
                            onChange={(e) => setSocialLevel(e.target.value as any)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                        >
                            <option>элита</option>
                            <option>средний слой</option>
                            <option>низший слой</option>
                            <option>вне системы</option>
                        </select>
                    </div>

                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Предпочитаемая сфера</label>
                        <select
                            value={sphere}
                            onChange={(e) => setSphere(e.target.value as any)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                        >
                            <option>политика</option>
                            <option>экономика</option>
                            <option>культура</option>
                            <option>силовые структуры</option>
                            <option>теневая деятельность</option>
                        </select>
                    </div>
                </section>

                {/* 2. Тип личности */}
                <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">2. Тип личности (выбери 3–4)</h2>
                    <div className="flex flex-wrap gap-2">
                        {PERSONALITY.map((p) => {
                            const active = personality.includes(p);
                            return (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPersonality((prev) => toggle(prev, p, 4))}
                                    className={`rounded-full border px-3 py-1 text-sm transition ${
                                        active ? "border-zinc-200/60 bg-zinc-200/10" : "border-zinc-800 bg-black/20"
                                    }`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-sm text-zinc-200/60">Выбрано: {personality.length}</p>
                </section>

                {/* 3. Амбиция */}
                <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">3. Амбиция</h2>

                    <div className="space-y-2">
                        <div className="text-sm text-zinc-200/80">Он хочет (можно несколько)</div>
                        <div className="flex flex-wrap gap-2">
                            {AMBITION_WANTS.map((a) => {
                                const active = ambitionWants.includes(a);
                                return (
                                    <button
                                        key={a}
                                        type="button"
                                        onClick={() => setAmbitionWants((prev) => toggle(prev, a))}
                                        className={`rounded-full border px-3 py-1 text-sm transition ${
                                            active ? "border-zinc-200/60 bg-zinc-200/10" : "border-zinc-800 bg-black/20"
                                        }`}
                                    >
                                        {a}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Горизонт амбиций</label>
                        <select
                            value={ambitionHorizon}
                            onChange={(e) => setAmbitionHorizon(e.target.value as any)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                        >
                            <option>краткосрочные</option>
                            <option>долгосрочные</option>
                        </select>
                    </div>
                </section>

                {/* 4. Риск */}
                <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">4. Отношение к риску</h2>
                    <select
                        value={risk}
                        onChange={(e) => setRisk(e.target.value as any)}
                        className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none w-full"
                    >
                        <option>осторожный игрок</option>
                        <option>идёт ва-банк</option>
                        <option>рискует только если уверен</option>
                        <option>любит хаос</option>
                    </select>
                </section>

                {/* 5. Взаимодействие */}
                <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">5. Стиль взаимодействия</h2>
                    <div className="flex flex-wrap gap-2">
                        {INTERACTION.map((i) => {
                            const active = interaction.includes(i);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setInteraction((prev) => toggle(prev, i))}
                                    className={`rounded-full border px-3 py-1 text-sm transition ${
                                        active ? "border-zinc-200/60 bg-zinc-200/10" : "border-zinc-800 bg-black/20"
                                    }`}
                                >
                                    {i}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 6. Маска */}
                <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">6. Маска персонажа (по 1–2 слова)</h2>
                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Каким хочет казаться?</label>
                        <input
                            value={maskPublic}
                            onChange={(e) => setMaskPublic(e.target.value)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                            placeholder="например: благородный, спокойный"
                            required
                        />
                    </div>
                    <div className="grid gap-3">
                        <label className="text-sm text-zinc-200/80">Какой он на самом деле?</label>
                        <input
                            value={maskReal}
                            onChange={(e) => setMaskReal(e.target.value)}
                            className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none"
                            placeholder="например: жёсткий, расчётливый"
                            required
                        />
                    </div>
                </section>

                {/* 7. Темперамент */}
                <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-4">
                    <h2 className="text-lg font-semibold">7. Темперамент</h2>
                    <select
                        value={temperament}
                        onChange={(e) => setTemperament(e.target.value as any)}
                        className="rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 outline-none w-full"
                    >
                        <option>холодный</option>
                        <option>горячий</option>
                        <option>уравновешенный</option>
                        <option>нервный</option>
                        <option>ироничный</option>
                        <option>строгий</option>
                    </select>
                </section>

                <button
                    disabled={!canSubmit || loading}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-200/10 py-4 text-base font-semibold disabled:opacity-40"
                    type="submit"
                >
                    {loading ? "Отправляю…" : "Отправить"}
                </button>

                {sent === "ok" && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
                        ✅ Отправлено! Спасибо — я получил анкету.
                    </div>
                )}
                {sent === "err" && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
                        ❌ Не удалось отправить. Попробуй ещё раз через минуту.
                    </div>
                )}
            </form>
        </main>
    );
}