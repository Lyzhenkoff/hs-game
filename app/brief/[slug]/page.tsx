"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

type StepId = "info" | "story" | "model" | "depth" | "materials" | "services" | "limits" | "expectations" | "contacts";

const steps: Array<{ id: StepId; title: string; subtitle?: string }> = [
    { id: "info", title: "I. Общая информация о событии" },
    { id: "story", title: "II. Атмосфера и сюжет" },
    { id: "model", title: "III. Игровая модель" },
    { id: "depth", title: "IV. Глубина и сложность" },
    { id: "materials", title: "V. Материалы и оформление" },
    { id: "services", title: "VI. Дополнительные услуги" },
    { id: "limits", title: "VII. Ограничения" },
    { id: "expectations", title: "VIII. Ожидания" },
    { id: "contacts", title: "IX. Контактные данные" },
];

function Chip({ active, children, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-3 py-1 text-sm border transition ${
                active ? "border-white/60 bg-white/10" : "border-white/10 hover:border-white/30"
            }`}
        >
            {children}
        </button>
    );
}

export default function BriefPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;

    const [unlocked, setUnlocked] = useState(false);
    const [password, setPassword] = useState("");

    const [stepIndex, setStepIndex] = useState(0);
    const step = steps[stepIndex];

    const [skipped, setSkipped] = useState<Record<StepId, boolean>>({} as any);

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [contact, setContact] = useState({ name: "", phone: "", telegram: "", email: "" });

    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ ok?: boolean; msg?: string } | null>(null);

    const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);

    function setField(key: string, value: any) {
        setAnswers((p) => ({ ...p, [key]: value }));
    }

    function skipThisStep() {
        setSkipped((p) => ({ ...p, [step.id]: true }));
        if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    }

    function next() {
        if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    }
    function prev() {
        if (stepIndex > 0) setStepIndex(stepIndex - 1);
    }

    async function submit() {
        setSending(true);
        setStatus(null);
        try {
            const res = await fetch("/api/brief-submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    password,
                    answers: {
                        ...answers,
                        _skipped: Object.entries(skipped)
                            .filter(([, v]) => v)
                            .map(([k]) => k),
                    },
                    contact,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data?.ok) {
                setStatus({ ok: false, msg: "Не удалось отправить. Проверь пароль/ссылку или попробуй позже." });
            } else {
                setStatus({ ok: true, msg: "Отправлено. Спасибо! Мы скоро свяжемся." });
            }
        } catch {
            setStatus({ ok: false, msg: "Сеть/сервер недоступны. Попробуй ещё раз через минуту." });
        } finally {
            setSending(false);
        }
    }

    // --- UI blocks ---
    const Shell = ({ children }: any) => (
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-3xl px-5 py-10">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">Ход Судьбы</div>
                        <h1 className="mt-2 text-2xl md:text-3xl font-semibold">🜂 Бриф на создание персональной игры</h1>
                        <div className="mt-2 text-white/50 text-sm">Ссылка: /brief/{slug}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-white/50">Прогресс</div>
                        <div className="text-lg font-semibold">{progress}%</div>
                    </div>
                </div>

                <div className="mt-6 h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-white/60" style={{ width: `${progress}%` }} />
                </div>

                <div className="mt-8">{children}</div>

                <div className="mt-10 text-xs text-white/40">
                    Можно пропускать любые разделы — просто нажми «Пропустить раздел».
                </div>
            </div>
        </div>
    );

    if (!unlocked) {
        return (
            <Shell>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="text-sm text-white/60">Доступ по паролю</div>
                    <div className="mt-2 text-xl font-semibold">Введите пароль, чтобы открыть бриф</div>

                    <input
                        className="mt-6 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/30"
                        placeholder="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="mt-4 w-full rounded-xl bg-white text-black py-3 font-semibold disabled:opacity-50"
                        disabled={!password.trim()}
                        onClick={() => setUnlocked(true)}
                    >
                        Открыть
                    </button>

                    <div className="mt-4 text-xs text-white/40">
                        Пароль нужен, чтобы отправка результатов шла по твоей персональной ссылке.
                    </div>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="flex flex-wrap gap-2">
                {steps.map((s, idx) => (
                    <Chip key={s.id} active={idx === stepIndex} onClick={() => setStepIndex(idx)}>
                        {idx + 1}. {s.id}
                    </Chip>
                ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-white/60 text-sm">{stepIndex + 1} / {steps.length}</div>
                <h2 className="mt-2 text-xl md:text-2xl font-semibold">{step.title}</h2>

                {step.id === "info" && (
                    <div className="mt-6 grid gap-4">
                        <Text label="Повод мероприятия" value={answers["Повод мероприятия"] ?? ""} onChange={(v:any)=>setField("Повод мероприятия", v)} />
                        <Text label="Дата и город проведения" value={answers["Дата и город"] ?? ""} onChange={(v:any)=>setField("Дата и город", v)} />
                        <Select
                            label="Площадка"
                            value={answers["Площадка"] ?? ""}
                            onChange={(v:any)=>setField("Площадка", v)}
                            options={["ресторан","лофт","загородный дом","офис","пока не выбрали"]}
                        />
                        <Text label="Планируемое количество гостей" value={answers["Количество гостей"] ?? ""} onChange={(v:any)=>setField("Количество гостей", v)} />
                        <Text label="Возрастной диапазон участников" value={answers["Возраст"] ?? ""} onChange={(v:any)=>setField("Возраст", v)} />
                        <Select
                            label="Насколько гости знакомы между собой?"
                            value={answers["Знакомство гостей"] ?? ""}
                            onChange={(v:any)=>setField("Знакомство гостей", v)}
                            options={["все хорошо знакомы","частично знакомы","большинство не знакомы"]}
                        />
                    </div>
                )}

                {step.id === "story" && (
                    <div className="mt-6 grid gap-4">
                        <MultiSelect
                            label="Желаемый сеттинг"
                            value={answers["Сеттинг"] ?? []}
                            onChange={(v:any)=>setField("Сеттинг", v)}
                            options={[
                                "фэнтези","викторианская эпоха","детектив / расследование","мистика","историческая альтернатива",
                                "политическая стратегия","корпоративная сатира","авторский мир",
                            ]}
                        />
                        <TextArea label="Референсы (фильмы/книги/сериалы)" value={answers["Референсы"] ?? ""} onChange={(v:any)=>setField("Референсы", v)} />
                        <MultiSelect
                            label="Характер истории"
                            value={answers["Характер истории"] ?? []}
                            onChange={(v:any)=>setField("Характер истории", v)}
                            options={[
                                "больше мистики","больше приключений","больше расследования","больше политики и переговоров",
                                "больше драматургии","лёгкий формат","интеллектуальный формат",
                            ]}
                        />
                        <Select
                            label="Магия и фантастика"
                            value={answers["Фантастика"] ?? ""}
                            onChange={(v:any)=>setField("Фантастика", v)}
                            options={["без фантастики","немного мистики","полноценный магический мир"]}
                        />
                        <Select
                            label="Финал"
                            value={answers["Финал"] ?? ""}
                            onChange={(v:any)=>setField("Финал", v)}
                            options={["триумфальный","драматичный","неожиданный поворот","с моральным выбором","открытый"]}
                        />
                    </div>
                )}

                {step.id === "model" && (
                    <div className="mt-6 grid gap-4">
                        <Select
                            label="Формат механики"
                            value={answers["Формат механики"] ?? ""}
                            onChange={(v:any)=>setField("Формат механики", v)}
                            options={[
                                "Одна команда против кризисов (до 15 человек)",
                                "Команда с личными целями и скрытым предателем (до 15 человек)",
                                "Деление на фракции (15–200 человек)",
                                "Гибридный формат",
                            ]}
                        />
                        <TextArea label="Если гибрид — опиши кратко" value={answers["Гибрид описание"] ?? ""} onChange={(v:any)=>setField("Гибрид описание", v)} />
                        <MultiSelect
                            label="Дополнительные механики"
                            value={answers["Доп механики"] ?? []}
                            onChange={(v:any)=>setField("Доп механики", v)}
                            options={[
                                "индивидуальные скрытые цели","тайные роли","экономическая система","кризисы и катастрофы","загадки и шифры",
                                "физические артефакты","суд / голосование","предательство внутри команды","личные миссии","ограничение времени на решения",
                            ]}
                        />
                    </div>
                )}

                {step.id === "depth" && (
                    <div className="mt-6 grid gap-4">
                        <Select label="Уровень вовлечения" value={answers["Вовлечение"] ?? ""} onChange={(v:any)=>setField("Вовлечение", v)} options={["лёгкий вечер","умеренное погружение","максимальный иммерсив"]} />
                        <Select label="Сложность механик" value={answers["Сложность"] ?? ""} onChange={(v:any)=>setField("Сложность", v)} options={["простые правила","средняя сложность","стратегический уровень"]} />
                        <Select label="Длительность игры" value={answers["Длительность"] ?? ""} onChange={(v:any)=>setField("Длительность", v)} options={["1,5 часа","2 часа","3 часа","4+ часа"]} />
                    </div>
                )}

                {step.id === "materials" && (
                    <div className="mt-6 grid gap-4">
                        <MultiSelect
                            label="Материалы/оформление"
                            value={answers["Материалы"] ?? []}
                            onChange={(v:any)=>setField("Материалы", v)}
                            options={[
                                "индивидуальные карточки персонажей","личные досье","письма / документы","печати / состаренная бумага",
                                "карта мира","игровые деньги","персональный дизайн под событие",
                            ]}
                        />
                        <Text label="Насколько важен визуальный антураж (1–10)" value={answers["Антураж"] ?? ""} onChange={(v:any)=>setField("Антураж", v)} />
                    </div>
                )}

                {step.id === "services" && (
                    <div className="mt-6 grid gap-4">
                        <MultiSelect
                            label="Дополнительные услуги"
                            value={answers["Услуги"] ?? []}
                            onChange={(v:any)=>setField("Услуги", v)}
                            options={[
                                "персональный персонаж для именинника / руководителя",
                                "скрытая линия, известная только одному игроку",
                                "персональный ассистент (VIP-формат)",
                                "телеграм-бот под событие",
                                "брендирование под компанию",
                                "призы победителям",
                                "фото/видео сопровождение",
                            ]}
                        />
                    </div>
                )}

                {step.id === "limits" && (
                    <div className="mt-6 grid gap-4">
                        <TextArea label="Темы, которые нельзя использовать" value={answers["Запрещённые темы"] ?? ""} onChange={(v:any)=>setField("Запрещённые темы", v)} />
                        <TextArea label="Чувствительные моменты / что учесть" value={answers["Чувствительное"] ?? ""} onChange={(v:any)=>setField("Чувствительное", v)} />
                        <Select label="Нужен ли нейтральный формат без конфликтных тем?" value={answers["Нейтрально"] ?? ""} onChange={(v:any)=>setField("Нейтрально", v)} options={["да","нет","скорее да","скорее нет"]} />
                    </div>
                )}

                {step.id === "expectations" && (
                    <div className="mt-6 grid gap-4">
                        <TextArea label="Идеальный финал вечера" value={answers["Идеальный финал"] ?? ""} onChange={(v:any)=>setField("Идеальный финал", v)} />
                        <TextArea label="Показатель, что игра прошла идеально" value={answers["Показатель успеха"] ?? ""} onChange={(v:any)=>setField("Показатель успеха", v)} />
                    </div>
                )}

                {step.id === "contacts" && (
                    <div className="mt-6 grid gap-4">
                        <Text label="Имя" value={contact.name} onChange={(v:any)=>setContact((p)=>({ ...p, name: v }))} />
                        <Text label="Телефон" value={contact.phone} onChange={(v:any)=>setContact((p)=>({ ...p, phone: v }))} />
                        <Text label="Telegram" value={contact.telegram} onChange={(v:any)=>setContact((p)=>({ ...p, telegram: v }))} />
                        <Text label="Email" value={contact.email} onChange={(v:any)=>setContact((p)=>({ ...p, email: v }))} />
                    </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="rounded-xl border border-white/15 px-4 py-2 hover:border-white/30 disabled:opacity-50"
                        onClick={prev}
                        disabled={stepIndex === 0}
                    >
                        Назад
                    </button>

                    {step.id !== "contacts" ? (
                        <>
                            <button
                                type="button"
                                className="rounded-xl border border-white/15 px-4 py-2 hover:border-white/30"
                                onClick={skipThisStep}
                            >
                                Пропустить раздел
                            </button>
                            <button
                                type="button"
                                className="rounded-xl bg-white text-black px-4 py-2 font-semibold"
                                onClick={next}
                            >
                                Дальше
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="rounded-xl bg-white text-black px-4 py-2 font-semibold disabled:opacity-50"
                            onClick={submit}
                            disabled={sending}
                        >
                            {sending ? "Отправляю…" : "Отправить"}
                        </button>
                    )}
                </div>

                {status && (
                    <div className={`mt-6 rounded-xl border p-4 ${status.ok ? "border-emerald-500/30 bg-emerald-500/10" : "border-red-500/30 bg-red-500/10"}`}>
                        {status.msg}
                    </div>
                )}
            </div>
        </Shell>
    );
}

// ---- small inputs ----
function Label({ children }: any) {
    return <div className="text-sm text-white/70">{children}</div>;
}

function Text({ label, value, onChange }: any) {
    return (
        <div>
            <Label>{label}</Label>
            <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/30"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function TextArea({ label, value, onChange }: any) {
    return (
        <div>
            <Label>{label}</Label>
            <textarea
                className="mt-2 w-full min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/30"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function Select({ label, value, onChange, options }: any) {
    return (
        <div>
            <Label>{label}</Label>
            <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-white/30"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">—</option>
                {options.map((o: string) => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
        </div>
    );
}

function MultiSelect({ label, value, onChange, options }: any) {
    const set = new Set<string>(value ?? []);
    return (
        <div>
            <Label>{label}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
                {options.map((o: string) => {
                    const active = set.has(o);
                    return (
                        <button
                            key={o}
                            type="button"
                            onClick={() => {
                                const next = new Set(set);
                                if (next.has(o)) next.delete(o);
                                else next.add(o);
                                onChange(Array.from(next));
                            }}
                            className={`rounded-full px-3 py-1 text-sm border transition ${
                                active ? "border-white/60 bg-white/10" : "border-white/10 hover:border-white/30"
                            }`}
                        >
                            {o}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}