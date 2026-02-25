"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
                <h1 className="text-2xl font-semibold">Вход</h1>

                <div className="mt-6 space-y-3">
                    <input className="w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3"
                           placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    <input className="w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3"
                           placeholder="Пароль" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    <button
                        className="w-full rounded-xl bg-zinc-100 text-black py-3 font-medium"
                        onClick={async ()=>{
                            setErr(null);
                            const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/account" });
                            if ((res as any)?.error) setErr("Не удалось войти");
                        }}
                    >
                        Войти
                    </button>

                    {err && <div className="text-red-300 text-sm">{err}</div>}
                    <div className="text-sm text-zinc-400">
                        Тестовые логины: admin (admin12345), smm (smm12345)
                    </div>
                </div>
            </div>
        </main>
    );
}