"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EventInfo = {
    title: string;
    date?: string;
    city?: string;
};

type Mode = "team" | "solo";
type Ticket = "1000" | "1500" | "2000" | "3000";

const ticketMeta: Record<
    Ticket,
    { title: string; price: number; desc: string; includes: string[]; badge?: string }
> = {
    "1000": {
        title: "Базовый",
        price: 1000,
        desc: "Стандартное участие и материалы для игры.",
        includes: ["Участие в игре", "Базовый набор материалов"],
        badge: "Основа",
    },
    "1500": {
        title: "С реквизитом",
        price: 1500,
        desc: "Всё из базового + реквизит/атрибуты для погружения.",
        includes: ["Участие в игре", "Базовый набор материалов", "Реквизит/атрибуты"],
        badge: "Вау-погружение",
    },
    "2000": {
        title: "Выбор фракции",
        price: 2000,
        desc: "Всё из базового + реквизит + выбор фракции (при наличии мест).",
        includes: ["Участие в игре", "Базовый набор материалов", "Реквизит/атрибуты", "Выбор фракции"],
        badge: "Контроль сюжета",
    },
    "3000": {
        title: "Максимум",
        price: 3000,
        desc: "Всё из базового + реквизит + выбор фракции + личное сопровождение и доп. материалы.",
        includes: [
            "Участие в игре",
            "Базовый набор материалов",
            "Реквизит/атрибуты",
            "Выбор фракции",
            "Личное сопровождение",
            "Доп. материалы",
        ],
        badge: "Премиум",
    },
};

const factions = [
    "Корона",
    "Промышленники",
    "Интеллигенция",
    "Стража и следственная палата",
    "Ремесленники",
    "Артисты",
];

export default function SignupDialog({
                                         open,
                                         onOpenChange,
                                         event,
                                     }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    event: EventInfo | null;
}) {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const [mode, setMode] = useState<Mode | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [seats, setSeats] = useState("1");
    const [teamName, setTeamName] = useState("");
    const [faction, setFaction] = useState("");
    const [message, setMessage] = useState("");

    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
    const [errorText, setErrorText] = useState("");

    const price = useMemo(() => (ticket ? ticketMeta[ticket].price : 0), [ticket]);
    const total = useMemo(() => {
        const n = Math.max(1, Number.parseInt(seats || "1", 10) || 1);
        return price * n;
    }, [price, seats]);

    // Выбор фракции доступен только на 2000+ (2000 и 3000)
    const allowsFaction = ticket === "2000" || ticket === "3000";

    function resetAll() {
        setStep(1);
        setMode(null);
        setTicket(null);
        setName("");
        setContact("");
        setSeats("1");
        setTeamName("");
        setFaction("");
        setMessage("");
        setStatus("idle");
        setErrorText("");
    }

    function close() {
        onOpenChange(false);
        setTimeout(resetAll, 150);
    }

    async function submit() {
        if (!event || !mode || !ticket) return;

        setStatus("sending");
        setErrorText("");

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventTitle: event.title,
                    eventDate: event.date || "",
                    city: event.city || "",
                    mode,
                    ticket,
                    teamName: mode === "team" ? teamName : "",
                    faction: allowsFaction ? faction : "",
                    name,
                    contact,
                    seats: mode === "team" ? seats : "1",
                    message,
                    source: "site",
                }),
            });

            const json = await res.json();
            if (!res.ok || !json.ok) throw new Error(json?.error || "Не удалось отправить");

            setStatus("ok");
        } catch (e: any) {
            setStatus("error");
            setErrorText(e?.message || "Ошибка сети");
        }
    }

    const topLine = event
        ? `${event.title}${event.date ? ` • ${event.date}` : ""}${event.city ? ` • ${event.city}` : ""}`
        : "";

    return (
        <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
            <DialogContent className="bg-zinc-950/95 border border-zinc-800 text-zinc-100 sm:max-w-[680px] max-h-[90vh] overflow-y-auto overscroll-contain">                {/* Вау-фон */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-emerald-500/18 blur-3xl" />
                    <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-amber-400/16 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_50%)]" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-xs tracking-wide text-zinc-200/60">Шаг {step} / 3</div>
                        <div className="mt-2 text-xl font-semibold">
                            {step === 1 && "Формат регистрации"}
                            {step === 2 && "Выбор билета"}
                            {step === 3 && "Данные и оплата"}
                        </div>
                        {topLine && <div className="mt-2 text-sm text-zinc-200/70">{topLine}</div>}
                    </div>

                    <Button variant="ghost" className="text-zinc-200/70 hover:text-zinc-50" onClick={close}>
                        Закрыть
                    </Button>
                </div>

                {/* Тонкая “золотая” линия */}
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />

                {/* Steps */}
                <div className="mt-6">
                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("team");
                                    setStep(2);
                                }}
                                className="group text-left rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-5 hover:bg-zinc-900/35 transition shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                            >
                                <div className="text-lg font-semibold">Зарегистрировать команду</div>
                                <div className="mt-2 text-sm text-zinc-200/75 leading-relaxed">
                                    Вы играете <span className="text-zinc-50">своей командой</span>. Укажи количество участников и (по желанию)
                                    название.
                                </div>
                                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-50">
                                    Выбрать <span className="opacity-70 group-hover:translate-x-0.5 transition">→</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setMode("solo");
                                    setStep(2);
                                }}
                                className="group text-left rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-5 hover:bg-zinc-900/35 transition shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                            >
                                <div className="text-lg font-semibold">Зарегистрироваться одному</div>
                                <div className="mt-2 text-sm text-zinc-200/75 leading-relaxed">
                                    Для одиночных игроков — посадим к другим одиночкам за общий стол.
                                </div>
                                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-50">
                                    Выбрать <span className="opacity-70 group-hover:translate-x-0.5 transition">→</span>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-3">
                            <div className="text-sm text-zinc-200/70">
                                Формат:{" "}
                                <span className="text-zinc-50 font-medium">{mode === "team" ? "Команда" : "Один игрок"}</span>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                {(Object.keys(ticketMeta) as Ticket[]).map((k) => {
                                    const t = ticketMeta[k];
                                    const active = ticket === k;

                                    return (
                                        <button
                                            key={k}
                                            type="button"
                                            onClick={() => {
                                                setTicket(k);
                                                // если билет перестал позволять фракцию — сбросим выбор
                                                const nextAllowsFaction = k === "2000" || k === "3000";
                                                if (!nextAllowsFaction) setFaction("");
                                            }}
                                            className={[
                                                "group text-left rounded-2xl border p-4 transition shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                                                active
                                                    ? "border-amber-300/45 bg-amber-300/5"
                                                    : "border-zinc-800/70 bg-zinc-950/40 hover:bg-zinc-900/35",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-base font-semibold">{t.title}</div>
                                                        {t.badge ? (
                                                            <span className="text-xs rounded-full border border-zinc-800/80 bg-zinc-950/60 px-2 py-0.5 text-zinc-200/80">
                                {t.badge}
                              </span>
                                                        ) : null}
                                                    </div>

                                                    <div className="mt-1 text-sm text-zinc-200/75">{t.desc}</div>

                                                    <ul className="mt-3 space-y-1 text-xs text-zinc-200/70">
                                                        {t.includes.map((x) => (
                                                            <li key={x} className="flex items-center gap-2">
                                                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300/50" />
                                                                <span>{x}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-lg font-semibold">{t.price} ₽</div>
                                                    <div className="text-xs text-zinc-200/60">за человека</div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <span />
                                                <span className="text-sm font-medium text-zinc-50">{active ? "Выбрано" : "Выбрать →"}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3">
                                <Button variant="ghost" className="text-zinc-200/70 hover:text-zinc-50" onClick={() => setStep(1)}>
                                    ← Назад
                                </Button>

                                <Button className="rounded-xl" onClick={() => setStep(3)} disabled={!ticket}>
                                    Продолжить
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="space-y-5">
                            {/* Summary */}
                            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4">
                                <div className="text-sm text-zinc-200/70">Вы выбрали</div>
                                <div className="mt-2 grid gap-2 text-sm">
                                    <div>
                                        <span className="text-zinc-200/60">Формат: </span>
                                        <span className="text-zinc-50 font-medium">{mode === "team" ? "Команда" : "Один игрок"}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-200/60">Билет: </span>
                                        <span className="text-zinc-50 font-medium">
                      {ticket ? `${ticketMeta[ticket].title} — ${ticketMeta[ticket].price} ₽/чел` : "-"}
                    </span>
                                    </div>
                                    {mode === "team" && ticket && (
                                        <div>
                                            <span className="text-zinc-200/60">Итого (примерно): </span>
                                            <span className="text-zinc-50 font-medium">{total} ₽</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <div className="text-sm text-zinc-200/80">Имя</div>
                                    <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
                                </div>
                                <div>
                                    <div className="text-sm text-zinc-200/80">Контакт</div>
                                    <Input
                                        className="mt-2"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder="@telegram или телефон"
                                    />
                                </div>
                            </div>

                            {mode === "team" && (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <div className="text-sm text-zinc-200/80">Количество участников</div>
                                        <Input
                                            className="mt-2"
                                            value={seats}
                                            onChange={(e) => setSeats(e.target.value)}
                                            placeholder="Например: 8"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-sm text-zinc-200/80">Название команды (опционально)</div>
                                        <Input
                                            className="mt-2"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            placeholder="Например: Стальные Лисы"
                                        />
                                    </div>
                                </div>
                            )}

                            {allowsFaction && (
                                <div>
                                    <div className="text-sm text-zinc-200/80">Фракция</div>
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        {factions.map((f) => (
                                            <button
                                                key={f}
                                                type="button"
                                                onClick={() => setFaction(f)}
                                                className={[
                                                    "rounded-xl border px-3 py-2 text-left text-sm transition",
                                                    faction === f
                                                        ? "border-amber-300/45 bg-amber-300/5 text-zinc-50"
                                                        : "border-zinc-800/70 bg-zinc-950/40 hover:bg-zinc-900/35 text-zinc-200/80",
                                                ].join(" ")}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-zinc-200/60">
                                        Выбор фракции доступен для билетов 2000 и 3000. Если фракция заполнена — согласуем замену.
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="text-sm text-zinc-200/80">Комментарий (опционально)</div>
                                <Textarea
                                    className="mt-2 min-h-[110px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Пожелания по столу/времени/формату..."
                                />
                            </div>

                            {/* Payment placeholder */}
                            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4">
                                <div className="text-sm font-medium text-zinc-50">Оплата</div>
                                <div className="mt-2 text-sm text-zinc-200/75 leading-relaxed">
                                    После заявки мы подтвердим места и пришлём ссылку на оплату в Telegram.
                                </div>
                                {mode === "team" && ticket && (
                                    <div className="mt-3 text-sm text-zinc-200/80">
                                        <span className="text-zinc-200/60">Предварительный расчёт: </span>
                                        <span className="text-zinc-50 font-medium">
                      {ticketMeta[ticket].price} ₽ × {Math.max(1, Number.parseInt(seats || "1", 10) || 1)} = {total} ₽
                    </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <Button variant="ghost" className="text-zinc-200/70 hover:text-zinc-50" onClick={() => setStep(2)}>
                                    ← Назад
                                </Button>

                                <Button
                                    className="rounded-xl"
                                    onClick={submit}
                                    disabled={
                                        status === "sending" ||
                                        !event ||
                                        !mode ||
                                        !ticket ||
                                        !name.trim() ||
                                        !contact.trim() ||
                                        (mode === "team" && !(Number.parseInt(seats || "0", 10) > 0)) ||
                                        (allowsFaction && !faction)
                                    }
                                >
                                    {status === "sending" ? "Отправляю…" : "Отправить заявку"}
                                </Button>
                            </div>

                            {status === "ok" && (
                                <div className="text-sm text-emerald-300/90">
                                    Заявка отправлена ✅ Мы напишем вам в Telegram для подтверждения и оплаты.
                                </div>
                            )}
                            {status === "error" && <div className="text-sm text-red-300/90">Не отправилось: {errorText}</div>}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}