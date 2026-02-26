import Image from "next/image";

const photos = Array.from({ length: 12 }, (_, i) => `/gallery/${(i % 6) + 1}.jpg`);

export const metadata = {
    title: "Галерея — Ход Судьбы",
};

export default function GalleryPage() {
    return (
        <main className="bg-black text-white min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-20">
                <h1 className="text-3xl md:text-4xl font-semibold mb-16">
                    Галерея мероприятий
                </h1>

                <div className="grid gap-6 md:grid-cols-3">
                    {photos.map((src, i) => (
                        <div
                            key={i}
                            className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-900"
                        >
                            <Image
                                src={src}
                                alt="Мероприятие"
                                fill
                                className="object-cover hover:scale-105 transition duration-700"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}