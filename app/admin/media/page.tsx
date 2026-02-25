import { prisma } from "@/lib/prisma";
import MediaForm from "./ui";

export default async function AdminMediaPage() {
    const images = await prisma.siteImage.findMany({ orderBy: { key: "asc" } });
    return (
        <main className="min-h-screen bg-black text-zinc-100 px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-semibold">Картинки сайта</h1>
                <p className="mt-2 text-zinc-400 text-sm">
                    Здесь можно менять ссылки на изображения (баннеры/афиши). Доступно для SMM и Admin.
                </p>

                <MediaForm initial={images} />
            </div>
        </main>
    );
}