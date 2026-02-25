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
      <main className="min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] text-zinc-50" id="top">
          <Monogram />
          {/* <div className="flex items-center justify-between">*/}
          {/*      <div>...</div>*/}
          {/*    <AuthButtons />*/}
          {/*</div>*/}
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
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



          <footer className="mt-24 border-t border-white/10 bg-black text-white">
              <div className="mx-auto max-w-6xl px-5 py-12">

                  {/* Основной блок */}
                  <div className="flex flex-col gap-6 md:flex-row md:justify-between">

                      <div>
                          <div className="text-lg font-semibold">Ход Судьбы</div>
                          <div className="mt-2 text-sm text-white/60">
                              Иммерсивные игровые события
                          </div>
                      </div>

                      <div className="text-sm text-white/60 space-y-2">
                          <div>
                              <a href="/offer" className="hover:text-white">
                                  Публичная оферта
                              </a>
                          </div>
                          <div>
                              <a href="/privacy" className="hover:text-white">
                                  Политика конфиденциальности
                              </a>
                          </div>
                      </div>

                  </div>

                  {/* Юридический блок */}
                  <div className="mt-10 text-xs text-white/40 leading-relaxed">
                      <div>
                          Индивидуальный предприниматель Лыженков Кирилл Александрович
                      </div>
                      <div>
                          ОГРНИП: 326784700073921 · ИНН: 781101882985
                      </div>
                      <div>
                          Email:{" "}
                          <a
                              href="mailto:kir.lyzhenkoff@gmail.com"
                              className="hover:text-white"
                          >
                              kir.lyzhenkoff@gmail.com
                          </a>
                      </div>
                      <div className="mt-2">
                          © {new Date().getFullYear()} Ход Судьбы. Все права защищены.
                      </div>
                  </div>

              </div>
          </footer>
      </main>
  );
}
