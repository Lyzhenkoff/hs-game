import Image from "next/image";

const photos = [
    "/gallery/photo1.jpg",
    "/gallery/photo2.jpg",
    "/gallery/photo3.jpg",
    "/gallery/photo4.jpg",
    "/gallery/photo5.jpg",
    "/gallery/photo6.jpg",
];
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