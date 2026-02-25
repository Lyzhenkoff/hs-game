import prisma from "../lib/prisma";
import { hash } from "bcryptjs";

async function main() {
    const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase().trim();
    if (!adminEmail) {
        console.log("BOOTSTRAP_ADMIN_EMAIL not set");
        return;
    }

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: "ADMIN" },
        create: {
            email: adminEmail,
            name: "Админ",
            role: "ADMIN",
            passwordHash: await hash("admin12345", 10),
        },
    });

    // пример SMM
    const smmEmail = "smm@hs.local";
    await prisma.user.upsert({
        where: { email: smmEmail },
        update: { role: "SMM" },
        create: {
            email: smmEmail,
            name: "SMM",
            role: "SMM",
            passwordHash: await hash("smm12345", 10),
        },
    });

    console.log("Admin:", admin.email, "pass=admin12345");
    console.log("SMM: smm@hs.local pass=smm12345");
}

main().finally(() => process.exit(0));