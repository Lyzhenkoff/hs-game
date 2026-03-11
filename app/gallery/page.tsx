import Image from "next/image";

const photos = [
    "/gallery/photo1.jpg",
    "/gallery/photo2.jpg",
    "/gallery/photo3.jpg",
    "/gallery/photo4.jpg",
    "/gallery/photo5.jpg",
    "/gallery/photo7.jpg",
    "/gallery/photo8.jpg",
    "/gallery/photo9.JPG",
    "/gallery/photo10.JPG",
    "/gallery/photo11.JPG",
    "/gallery/photo12.JPG",
    "/gallery/photo13.JPG",
    "/gallery/photo14.jpg",
    "/gallery/photo15.jpg",
    "/gallery/photo16.JPG",
    "/gallery/photo17.JPG",
    "/gallery/photo18.JPG",
    "/gallery/photo19.JPG",
    "/gallery/photo20.JPG",
    "/gallery/photo21.jpg",
    "/gallery/photo22.JPG",
    "/gallery/photo23.JPG",
    "/gallery/photo24.JPG",
    "/gallery/photo25.JPG",
    "/gallery/photo27.JPG",
    "/gallery/photo28.jpg",
    "/gallery/photo29.jpg",
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