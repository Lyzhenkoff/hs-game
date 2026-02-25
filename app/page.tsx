import AnimatedSection from "@/components/site/AnimatedSection";
import CalendarPoster from "../components/site/CalendarPoster";
import Monogram from "../components/site/Monogram";
import Divider from "../components/site/Divider";
import HeroCarouselBackground from "../components/site/HeroCarouselBackground";
import RequestGameForm from "../components/site/RequestGameForm";
import FactionsSection from "@/components/site/FactionsSection";
import AuthButtons from "@/components/site/AuthButtons";


export default function Home() {
  return (
      <main className="min-h-screen text-zinc-50" id="top">
          <Monogram />
          {/* <div className="flex items-center justify-between">*/}
          {/*      <div>...</div>*/}
          {/*    <AuthButtons />*/}
          {/*</div>*/}
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <HeroCarouselBackground />
        </div>

        <AnimatedSection id="how" className="border-t border-zinc-900">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl md:text-4xl font-semibold">Как проходит</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                ["Фракции", "Каждая команда — часть фракции со скрытыми целями."],
                ["Раунды", "В каждом раунде вы отдаёте приказы и ведёте переговоры."],
                ["Последствия", "Ведущий объявляет исход и запускает кризисы."],
                ["Финал", "Считаем влияние и выполненные цели. Судьба города решена."],
              ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
                    <div className="text-lg font-semibold">{t}</div>
                    <p className="mt-2 text-sm text-zinc-200/80">{d}</p>
                  </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
          <AnimatedSection id="calendar">
          <CalendarPoster />
              <FactionsSection />

          </AnimatedSection>
          <RequestGameForm />



        <footer className="border-t border-zinc-900">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-200/70 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Ход Судьбы</div>
            <div className="flex flex-wrap gap-4">
              <a className="hover:text-zinc-50 transition" href="https://t.me/" target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a className="hover:text-zinc-50 transition" href="/offer">
                Публичная оферта
              </a>
            </div>
          </div>
        </footer>
      </main>
  );
}
