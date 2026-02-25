// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Пароль", type: "password" },
            },
            async authorize(credentials) {
                const email = (credentials?.email ?? "").toString().toLowerCase().trim();
                const password = (credentials?.password ?? "").toString();

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user?.passwordHash) return null;

                const ok = await compare(password, user.passwordHash);
                if (!ok) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name ?? user.email,
                    role: (user as any).role ?? "USER",
                } as any;
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            (session.user as any).id = user.id;
            (session.user as any).role = (user as any).role ?? "USER";
            return session;
        },
    },
});