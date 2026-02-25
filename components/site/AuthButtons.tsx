"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
    const { data } = useSession();

    if (!data) {
        return (
            <div className="flex items-center gap-2">
                <Link href="/signin">
                    <Button variant="secondary" className="rounded-full">Войти</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link href="/dashboard">
                <Button variant="secondary" className="rounded-full">Кабинет</Button>
            </Link>
            <Button
                className="rounded-full"
                variant="ghost"
                onClick={() => signOut({ callbackUrl: "/" })}
            >
                Выйти
            </Button>
        </div>
    );
}