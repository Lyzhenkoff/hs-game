export default function Monogram() {
    return (
        <a
            href="#top"
            aria-label="Ход Судьбы"
            className="fixed left-6 bottom-6 z-50 group"
        >
            <div className="relative h-12 w-12 rounded-full border border-zinc-800/80 bg-zinc-950/55 backdrop-blur-md shadow-[0_18px_70px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(234,179,8,0.18),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(34,197,94,0.16),transparent_60%)] opacity-0 group-hover:opacity-100 transition" />
                <div className="relative flex h-full w-full items-center justify-center font-semibold tracking-tight text-zinc-50">
                    <span className="text-[13px]">ХС</span>
                </div>
            </div>
        </a>
    );
}
