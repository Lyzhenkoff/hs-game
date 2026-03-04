"use client";

import { useMemo, useState, useEffect } from "react";
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
type Ticket = "1200" | "1500" | "2000" | "premium";

const ticketMeta: Record<
    Ticket,
    { title: string; price: number; desc: string; includes: string[]; badge?: string }
> = {
    "1200": {
        title: "Классический",
        price: 1200,
        desc: "Базовое участие: всё, что нужно, чтобы полноценно сыграть и кайфануть от сюжета.",
        includes: ["Участие в игре", "Базовый набор материалов", "Роль/введение от ведущего"],
        badge: "База",
    },
    "1500": {
        title: "С доп. реквизитом",
        price: 1500,
        desc: "Классический + дополнительный реквизит и игровые атрибуты для более глубокого погружения.",
        includes: ["Всё из классического", "Доп. реквизит/атрибуты", "Больше «ощущения мира»"],
        badge: "Погружение",
    },
    "2000": {
        title: "Выбор фракции",
        price: 2000,
        desc: "Доп. реквизит + возможность выбрать фракцию (если в ней есть места).",
        includes: ["Всё из пакета 1500", "Выбор фракции", "Приоритет по рассадке внутри фракции (если применимо)"],
        badge: "Выбор",
    },
    premium: {
        title: "Премиум",
        price: 3000,
        desc: "Максимальный комплект: всё, что можно + дополнительное сопровождение и материалы.",
        includes: [
            "Всё из пакета 2000",
            "Доп. сопровождение",
            "Расширенные материалы/артефакты (по возможности)",
            "Максимальный комфорт участия",
        ],
        badge: "VIP",
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

/**
 * ==========================
 * ПРОМОКОДЫ (в коде)
 * ==========================
 * Требования:
 * - 6 промокодов для ДР: содержат "DR" и дают 1 бесплатный билет
 * - 8 промокодов: содержат "MEM" и дают 1 бесплатный билет
 * - 1 промокод: содержит "MEM" и даёт 15%
 * - 3 промокода: содержат "MEM" и дают 10%
 *
 * Важно: "одноразовый" тут реализован через localStorage (на устройстве).
 */

type PromoKind = "FREE_ONE_TICKET" | "PERCENT";
type PromoConfig =
    | { code: string; kind: "FREE_ONE_TICKET" }
    | { code: string; kind: "PERCENT"; percent: 10 | 15 };

const PROMOS: PromoConfig[] = [
    // 6 ДР (1 билет бесплатно)
    { code: "DR-HS-01", kind: "FREE_ONE_TICKET" },
    { code: "DR-HS-02", kind: "FREE_ONE_TICKET" },
    { code: "DR-HS-03", kind: "FREE_ONE_TICKET" },
    { code: "DR-HS-04", kind: "FREE_ONE_TICKET" },
    { code: "DR-HS-05", kind: "FREE_ONE_TICKET" },
    { code: "DR-HS-06", kind: "FREE_ONE_TICKET" },

    // 8 MEM (1 билет бесплатно)
    { code: "MEM-FREE-01", kind: "FREE_ONE_TICKET" },
    { code: "MEM-FREE-02", kind: "FREE_ONE_TICKET" },
    { code: "MEM-FREE-03", kind: "FREE_ONE_TICKET" },
    { code: "MEM-FREE-04", kind: "FREE_ONE_TICKET" },
    { code: "MEM-FREE-05", kind: "FREE_ONE_TICKET" },
    { code: "MEM-FREE-06", kind: "FREE_ONE_TICKET" },
    { code: "MEM-FREE-07", kind: "FREE_ONE_TICKET" },
    { code: "MEM-FREE-08", kind: "FREE_ONE_TICKET" },

    // 1 MEM 15%
    { code: "MEM-15", kind: "PERCENT", percent: 15 },

    // 3 MEM 10%
    { code: "MEM-10-01", kind: "PERCENT", percent: 10 },
    { code: "MEM-10-02", kind: "PERCENT", percent: 10 },
    { code: "MEM-10-03", kind: "PERCENT", percent: 10 },
];

function normCode(s: string) {
    return s.trim().toUpperCase();
}

function promoStorageKey(code: string) {
    return `hs_promo_used_${normCode(code)}`;
}

function isPromoUsedOnThisDevice(code: string) {
    try {
        return localStorage.getItem(promoStorageKey(code)) === "1";
    } catch {
        return false;
    }
}

function markPromoUsedOnThisDevice(code: string) {
    try {
        localStorage.setItem(promoStorageKey(code), "1");
    } catch {
        // ignore
    }
}

function calcPromoDiscount(opts: {
    promo: PromoConfig;
    ticketPrice: number;
    total: number;
    mode: Mode;
    seatsNum: number;
}) {
    const { promo, ticketPrice, total, mode, seatsNum } = opts;

    // Сколько билетов "в сумме": в team = seats, в solo = 1
    const qty = mode === "team" ? seatsNum : 1;

    if (promo.kind === "FREE_ONE_TICKET") {
        // 1 бесплатный билет => скидка = цена одного билета
        // но не больше total
        const discount = Math.min(ticketPrice, total);
        return {
            label: "1 билет бесплатно",
            discount,
            newTotal: Math.max(0, total - discount),
        };
    }

    if (promo.kind === "PERCENT") {
        const percent = promo.percent;
        const discount = Math.floor((total * percent) / 100);
        return {
            label: `Скидка ${percent}%`,
            discount,
            newTotal: Math.max(0, total - discount),
        };
    }

    return { label: "Промокод", discount: 0, newTotal: total };
}

type PromoState =
    | { status: "idle" }
    | { status: "ok"; code: string; label: string; discount: number; newTotal: number }
    | { status: "bad"; message: string };

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

    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeConsent, setAgreeConsent] = useState(false);
    const [agreeOffer, setAgreeOffer] = useState(false);

    const [mode, setMode] = useState<Mode | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);

    const [name, setName] = useState("");
    const [contact, setContact] = useState(""); // phone or telegram
    const [email, setEmail] = useState(""); // для билета
    const [seats, setSeats] = useState("1");
    const [teamName, setTeamName] = useState("");
    const [faction, setFaction] = useState("");
    const [message, setMessage] = useState("");

    const [promoInput, setPromoInput] = useState("");
    const [promo, setPromo] = useState<PromoState>({ status: "idle" });

    const [payNow, setPayNow] = useState(true);
    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
    const [errorText, setErrorText] = useState("");

    const seatsNum = useMemo(() => {
        const n = Number.parseInt(seats || "1", 10);
        return Number.isFinite(n) && n > 0 ? n : 1;
    }, [seats]);

    const total = useMemo(() => {
        if (!ticket || !mode) return 0;
        const base = ticketMeta[ticket].price;
        return base * (mode === "team" ? seatsNum : 1);
    }, [ticket, mode, seatsNum]);

    // Выбор фракции доступен только на 2000+ (2000 и premium)
    const allowsFaction = ticket === "2000" || ticket === "premium";

    // Пересчитываем “к оплате” с учётом промо
    const payableTotal = useMemo(() => {
        if (promo.status === "ok") return promo.newTotal;
        return total;
    }, [promo, total]);

    // Если поменяли билет/режим/кол-во — сбрасываем промо, чтобы не было странных пересчётов
    useEffect(() => {
        setPromo({ status: "idle" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticket, mode, seatsNum]);

    function resetAll() {
        setStep(1);
        setMode(null);
        setTicket(null);

        setName("");
        setContact("");
        setEmail("");
        setSeats("1");
        setTeamName("");
        setFaction("");
        setMessage("");

        setPromoInput("");
        setPromo({ status: "idle" });

        setPayNow(true);
        setStatus("idle");
        setErrorText("");

        setAgreePrivacy(false);
        setAgreeConsent(false);
        setAgreeOffer(false);
    }

    function close() {
        onOpenChange(false);
        setTimeout(resetAll, 150);
    }

    function applyPromoLocal() {
        if (!ticket || !mode) {
            setPromo({ status: "bad", message: "Сначала выберите формат и билет" });
            return;
        }

        const code = normCode(promoInput);
        if (!code) {
            setPromo({ status: "bad", message: "Введите промокод" });
            return;
        }

        const found = PROMOS.find((p) => normCode(p.code) === code);
        if (!found) {
            setPromo({ status: "bad", message: "Промокод не найден" });
            return;
        }

        // проверяем “одноразовость” на этом устройстве
        if (isPromoUsedOnThisDevice(code)) {
            setPromo({ status: "bad", message: "Этот промокод уже был использован на этом устройстве" });
            return;
        }

        const ticketPrice = ticketMeta[ticket].price;
        const calc = calcPromoDiscount({
            promo: found,
            ticketPrice,
            total,
            mode,
            seatsNum,
        });

        setPromo({
            status: "ok",
            code,
            label: calc.label,
            discount: calc.discount,
            newTotal: calc.newTotal,
        });
    }

    function clearPromo() {
        setPromoInput("");
        setPromo({ status: "idle" });
    }

    async function submit() {
        if (!event || !mode || !ticket) return;

        setStatus("sending");
        setErrorText("");

        try {
            const payload = {
                eventTitle: event.title,
                eventDate: event.date || "",
                city: event.city || "",
                mode,
                ticket,
                ticketTitle: ticketMeta[ticket].title,
                ticketPrice: ticketMeta[ticket].price,

                // ВАЖНО: отправляем сумму "к оплате" (с учётом промо)
                total: payableTotal,

                // исходная сумма + промо-детали (чтобы в тг было видно)
                originalTotal: total,
                promoCode: promo.status === "ok" ? promo.code : "",
                promoLabel: promo.status === "ok" ? promo.label : "",
                promoDiscount: promo.status === "ok" ? promo.discount : 0,

                seats: mode === "team" ? String(seatsNum) : "1",
                teamName: mode === "team" ? teamName : "",
                faction: allowsFaction ? faction : "",

                name,
                contact,
                email,
                message,

                payNow,
                source: "site",
            };

            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({} as any));
            if (!res.ok || !json?.ok) throw new Error(json?.error || "Не удалось отправить");

            // Если бэкенд вернул ссылку на оплату — открываем
            // и ТУТ “жжём” промокод на этом устройстве (как ты просил — после действия пользователя)
            if (json?.paymentUrl && typeof json.paymentUrl === "string") {
                window.open(json.paymentUrl, "_blank", "noopener,noreferrer");

                // считаем, что пользователь пошёл платить => блокируем повтор
                if (promo.status === "ok") markPromoUsedOnThisDevice(promo.code);
            } else {
                // Если оплаты “сразу” нет, но ты хочешь сжигать промо при отправке заявки — включи это:
                // if (promo.status === "ok") markPromoUsedOnThisDevice(promo.code);
            }

            setStatus("ok");
        } catch (e: any) {
            setStatus("error");
            setErrorText(e?.message || "Ошибка сети");
        }
    }

    const topLine = event
        ? `${event.title}${event.date ? ` • ${event.date}` : ""}${event.city ? ` • ${event.city}` : ""}`
        : "";

    const canSubmit =
        !!event &&
        !!mode &&
        !!ticket &&
        !!name.trim() &&
        (!!contact.trim() || !!email.trim()) &&
        (mode !== "team" || seatsNum > 0) &&
        (!allowsFaction || !!faction) &&
        agreePrivacy &&
        agreeConsent &&
        agreeOffer;

    return (
        <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
            <DialogContent className="bg-zinc-950/95 border border-zinc-800 text-zinc-100 sm:max-w-[720px] max-h-[90vh] overflow-y-auto overscroll-contain">
                {/* Фон */}
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
                            {step === 3 && "Контакты и подтверждение"}
                        </div>
                        {topLine && <div className="mt-2 text-sm text-zinc-200/70">{topLine}</div>}
                    </div>

                    <Button variant="ghost" className="text-zinc-200/70 hover:text-zinc-50" onClick={close}>
                        Закрыть
                    </Button>
                </div>

                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />

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
                                    Вы приходите <span className="text-zinc-50">своей компанией</span>. Укажи количество участников и (по желанию) название команды.
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
                                <div className="text-lg font-semibold">Прийти одному</div>
                                <div className="mt-2 text-sm text-zinc-200/75 leading-relaxed">
                                    Это классная возможность <span className="text-zinc-50">познакомиться с новыми людьми</span>: мы аккуратно посадим вас к другим игрокам,
                                    чтобы было комфортно, интересно и легко найти «своих».
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
                                Формат: <span className="text-zinc-50 font-medium">{mode === "team" ? "Команда" : "Один игрок"}</span>
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
                                                const nextAllowsFaction = k === "2000" || k === "premium";
                                                if (!nextAllowsFaction) setFaction("");
                                            }}
                                            className={[
                                                "group text-left rounded-2xl border p-4 transition shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                                                active ? "border-amber-300/45 bg-amber-300/5" : "border-zinc-800/70 bg-zinc-950/40 hover:bg-zinc-900/35",
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

                                    {promo.status === "ok" ? (
                                        <>
                                            <div>
                                                <span className="text-zinc-200/60">Сумма: </span>
                                                <span className="text-zinc-50 font-medium line-through opacity-70">{total} ₽</span>
                                            </div>
                                            <div>
                                                <span className="text-zinc-200/60">Промокод: </span>
                                                <span className="text-zinc-50 font-medium">{promo.code}</span>{" "}
                                                <span className="text-zinc-200/70">({promo.label})</span>
                                            </div>
                                            <div>
                                                <span className="text-zinc-200/60">К оплате: </span>
                                                <span className="text-zinc-50 font-semibold">{payableTotal} ₽</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <span className="text-zinc-200/60">Итого: </span>
                                            <span className="text-zinc-50 font-medium">{total} ₽</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <div className="text-sm text-zinc-200/80">Имя</div>
                                    <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя и фамилия" />
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

                            <div>
                                <div className="text-sm text-zinc-200/80">Email для билета (рекомендуем)</div>
                                <Input className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
                                <div className="mt-2 text-xs text-zinc-200/60">На этот email можно автоматически отправлять билет и информацию по игре.</div>
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
                                            inputMode="numeric"
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
                                    <div className="text-sm text-zinc-200/80">Выбор фракции</div>
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
                                        Выбор фракции доступен для билетов «Выбор фракции» и «Премиум». Если мест не останется — согласуем замену.
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="text-sm text-zinc-200/80">Комментарий (опционально)</div>
                                <Textarea
                                    className="mt-2 min-h-[110px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Пожелания по столу/рассадке/времени или важные детали…"
                                />
                            </div>

                            {/* Payment + Promo */}
                            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4">
                                <div className="text-sm font-medium text-zinc-50">Оплата и билет</div>
                                <div className="mt-2 text-sm text-zinc-200/75 leading-relaxed">
                                    Можно оплатить сразу — и после оплаты автоматически получить билет (на email/в Telegram). Либо отправить заявку, и мы пришлём ссылку на оплату вручную.
                                </div>

                                <div className="mt-4 flex items-start gap-3">
                                    <input
                                        id="payNow"
                                        type="checkbox"
                                        checked={payNow}
                                        onChange={(e) => setPayNow(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950"
                                    />
                                    <label htmlFor="payNow" className="text-sm text-zinc-200/80 leading-relaxed">
                                        Хочу получить ссылку на оплату сразу после отправки заявки
                                        <div className="text-xs text-zinc-200/60 mt-1">(Если на бэкенде настроено создание paymentUrl — откроется автоматически.)</div>
                                    </label>
                                </div>

                                <div className="mt-3 text-sm text-zinc-200/80">
                                    <span className="text-zinc-200/60">Сумма: </span>
                                    <span className="text-zinc-50 font-medium">
                    {ticket
                        ? `${ticketMeta[ticket].price} ₽ × ${mode === "team" ? seatsNum : 1} = ${total} ₽`
                        : "-"}
                  </span>
                                </div>

                                {/* ПРОМОКОД */}
                                <div className="mt-4 rounded-xl border border-zinc-800/70 bg-zinc-950/30 p-3">
                                    <div className="text-sm text-zinc-200/80">Промокод</div>

                                    <div className="mt-2 flex gap-2">
                                        <Input
                                            value={promoInput}
                                            onChange={(e) => setPromoInput(e.target.value)}
                                            placeholder="Введите промокод"
                                            className="flex-1"
                                        />
                                        {promo.status !== "ok" ? (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={applyPromoLocal}
                                                disabled={!promoInput.trim() || !ticket || !mode}
                                                className="rounded-xl"
                                            >
                                                Применить
                                            </Button>
                                        ) : (
                                            <Button type="button" variant="ghost" onClick={clearPromo} className="rounded-xl">
                                                Сбросить
                                            </Button>
                                        )}
                                    </div>

                                    {promo.status === "ok" && (
                                        <div className="mt-2 text-sm text-emerald-300/90">
                                            Применён: <span className="font-semibold">{promo.code}</span> — {promo.label}. К оплате:{" "}
                                            <span className="font-semibold text-zinc-50">{payableTotal} ₽</span>
                                        </div>
                                    )}
                                    {promo.status === "bad" && <div className="mt-2 text-sm text-red-300/90">{promo.message}</div>}

                                    <div className="mt-2 text-xs text-zinc-200/55 leading-relaxed">
                                        Промокод не списывается при вводе. Он блокируется для повторного использования на этом устройстве после отправки заявки
                                        (если откроется ссылка на оплату).
                                    </div>
                                </div>
                            </div>

                            {/* Consents */}
                            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4">
                                <div className="text-sm font-medium text-zinc-50">Согласия</div>

                                <div className="mt-3 space-y-3 text-sm text-zinc-200/80">
                                    <label className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={agreePrivacy}
                                            onChange={(e) => setAgreePrivacy(e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950"
                                        />
                                        <span className="leading-relaxed">
                      Я ознакомился с{" "}
                                            <a className="underline hover:text-zinc-50" href="/privacy" target="_blank" rel="noreferrer">
                        Политикой конфиденциальности
                      </a>
                      .
                    </span>
                                    </label>

                                    <label className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={agreeConsent}
                                            onChange={(e) => setAgreeConsent(e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950"
                                        />
                                        <span className="leading-relaxed">
                      Я даю{" "}
                                            <a className="underline hover:text-zinc-50" href="/consent" target="_blank" rel="noreferrer">
                        согласие на обработку персональных данных
                      </a>
                      .
                    </span>
                                    </label>

                                    <label className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={agreeOffer}
                                            onChange={(e) => setAgreeOffer(e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950"
                                        />
                                        <span className="leading-relaxed">
                      Я ознакомился с{" "}
                                            <a className="underline hover:text-zinc-50" href="/offer" target="_blank" rel="noreferrer">
                        Публичной офертой
                      </a>
                      .
                    </span>
                                    </label>
                                </div>

                                <div className="mt-3 text-xs text-zinc-200/60">Без этих согласий мы не сможем принять заявку и подтвердить участие.</div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <Button variant="ghost" className="text-zinc-200/70 hover:text-zinc-50" onClick={() => setStep(2)}>
                                    ← Назад
                                </Button>

                                <Button className="rounded-xl" onClick={submit} disabled={status === "sending" || !canSubmit}>
                                    {status === "sending" ? "Отправляю…" : "Отправить заявку"}
                                </Button>
                            </div>

                            {status === "ok" && (
                                <div className="text-sm text-emerald-300/90">
                                    Заявка отправлена ✅ Мы свяжемся с вами для подтверждения.{" "}
                                    {payNow ? "Если открылась ссылка на оплату — после оплаты пришлём билет." : "Ссылку на оплату пришлём в Telegram."}
                                </div>
                            )}
                            {status === "error" && <div className="text-sm text-red-300/90">Не отправилось: {errorText}</div>}

                            <div className="text-xs text-zinc-200/55 leading-relaxed">
                                Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных для связи и оформления участия.
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}