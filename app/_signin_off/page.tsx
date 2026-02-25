"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/60 backdrop-blur p-6">
                <h1 className="text-2xl font-semibold">Вход</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    Для админки и личного кабинета.
                </p>

                <div className="mt-6 space-y-3">
                    <div>
                        <div className="text-xs text-zinc-400 mb-1">Email</div>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
                    </div>
                    <div>
                        <div className="text-xs text-zinc-400 mb-1">Пароль</div>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
                    </div>

                    <Button
                        className="w-full rounded-2xl"
                        onClick={() =>
                            signIn("credentials", {
                                email,
                                password,
                                callbackUrl: "/dashboard",
                            })
                        }
                    >
                        Войти
                    </Button>

                    <div className="text-xs text-zinc-500">
                        Регистрацию игроков можно сделать позже. Сейчас вход нужен прежде всего для админа.
                    </div>
                </div>
            </div>
        </main>
    );
}