"use client";

import { useState } from "react";

type Row = { id: string; key: string; url: string };

export default function MediaForm({ initial }: { initial: Row[] }) {
    const [rows, setRows] = useState<Row[]>(initial.length ? initial : [
        { id: "new1", key: "hero_1", url: "" },
        { id: "new2", key: "hero_2", url: "" },
        { id: "new3", key: "hero_3", url: "" },
    ]);

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    return (
        <div className="mt-8 space-y-4">
            {rows.map((r, idx) => (
                <div key={r.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                    <div className="text-sm text-zinc-400">Ключ</div>
                    <input
                        className="mt-1 w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3"
                        value={r.key}
                        onChange={(e)=>{
                            const v = e.target.value;
                            setRows(prev => prev.map((x,i)=> i===idx ? { ...x, key: v } : x));
                        }}
                    />

                    <div className="mt-3 text-sm text-zinc-400">URL картинки</div>
                    <input
                        className="mt-1 w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3"
                        value={r.url}
                        onChange={(e)=>{
                            const v = e.target.value;
                            setRows(prev => prev.map((x,i)=> i===idx ? { ...x, url: v } : x));
                        }}
                    />
                </div>
            ))}

            <div className="flex gap-3">
                <button
                    className="rounded-xl border border-zinc-800 px-4 py-3 text-sm"
                    onClick={()=> setRows(prev => [...prev, { id: String(Date.now()), key: "new_key", url: "" }])}
                >
                    + Добавить
                </button>

                <button
                    className="rounded-xl bg-zinc-100 text-black px-5 py-3 text-sm font-medium"
                    disabled={saving}
                    onClick={async ()=>{
                        setSaving(true);
                        setMsg(null);
                        const res = await fetch("/api/admin/media", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ rows }),
                        });
                        setSaving(false);
                        setMsg(res.ok ? "Сохранено" : "Ошибка сохранения");
                    }}
                >
                    {saving ? "Сохраняю..." : "Сохранить"}
                </button>

                {msg && <div className="text-sm text-zinc-400 self-center">{msg}</div>}
            </div>
        </div>
    );
}