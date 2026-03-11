import AnimatedSection from "@/components/site/AnimatedSection";
import CalendarPoster from "../components/site/CalendarPoster";
import Monogram from "../components/site/Monogram";
import Divider from "../components/site/Divider";
import HeroCarouselBackground from "../components/site/HeroCarouselBackground";
import RequestGameForm from "../components/site/RequestGameForm";
import FactionsSection from "@/components/site/FactionsSection";
import AuthButtons from "@/components/site/AuthButtons";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import GallerySection from "@/components/site/GallerySection";
import { FaTelegram, FaVk } from "react-icons/fa";


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
              {/*<FactionsSection />*/}
              <section id="about-game" className="bg-black text-white">
                  <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
                      <div className="max-w-3xl">
                          <div className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                              Что это за игра
                          </div>

                          <h2 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight">
                              Ход Судьбы — это сюжетная командная игра,
                              где игроки меняют ход истории
                          </h2>

                          <p className="mt-6 text-lg text-zinc-300 leading-relaxed">
                              «Ход Судьбы» — это не квиз и не игра про правильные ответы.
                              Здесь команды становятся фракциями, принимают решения,
                              заключают союзы, спорят, договариваются и влияют на развитие сюжета.
                          </p>

                          <p className="mt-4 text-zinc-400 leading-relaxed">
                              У каждой фракции есть свои интересы, цели и ресурсы.
                              Каждый ход меняет баланс сил, а финал зависит от того,
                              какие решения примут сами игроки.
                          </p>
                      </div>

                      <div className="mt-14 grid gap-6 md:grid-cols-3">
                          <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6">
                              <div className="text-lg font-semibold">Формат</div>
                              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                                  Игроки собираются в команды, получают роли фракций
                                  и участвуют в общей истории, которая развивается в реальном времени.
                              </p>
                          </div>

                          <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6">
                              <div className="text-lg font-semibold">Как проходит игра</div>
                              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                                  Команды обсуждают стратегию, отдают приказы, ведут переговоры,
                                  вступают в союзы и сталкиваются с последствиями своих решений.
                              </p>
                          </div>

                          <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6">
                              <div className="text-lg font-semibold">Чем это отличается</div>
                              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                                  Здесь нет выбывания и нет единственно правильного пути.
                                  Каждая игра складывается по-разному — в зависимости от игроков.
                              </p>
                          </div>
                      </div>

                      <div className="mt-12 rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6 md:p-8">
                          <div className="max-w-3xl">
                              <div className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                                  Что делают игроки
                              </div>

                              <h3 className="mt-4 text-2xl md:text-3xl font-semibold">
                                  Переговоры, интриги, союзы и решения, которые реально влияют на сюжет
                              </h3>

                              <ul className="mt-6 grid gap-3 text-zinc-300 md:grid-cols-2">
                                  <li className="rounded-xl border border-zinc-800/70 bg-black/20 px-4 py-3">
                                      Заключают союзы и договариваются с другими фракциями
                                  </li>
                                  <li className="rounded-xl border border-zinc-800/70 bg-black/20 px-4 py-3">
                                      Борются за влияние и ресурсы
                                  </li>
                                  <li className="rounded-xl border border-zinc-800/70 bg-black/20 px-4 py-3">
                                      Принимают стратегические решения
                                  </li>
                                  <li className="rounded-xl border border-zinc-800/70 bg-black/20 px-4 py-3">
                                      Влияют на развитие общей истории
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </section>
              <TestimonialsSection />

              <GallerySection />
          </AnimatedSection>
          <RequestGameForm />
          <footer className="mt-24 border-t border-white/10 bg-black text-white">
              <div className="mx-auto max-w-6xl px-5 py-12">

                  {/* Верхняя часть */}
                  <div className="flex flex-col gap-10 md:flex-row md:justify-between">

                      {/* Бренд */}
                      <div>
                          <div className="text-lg font-semibold">Ход Судьбы</div>
                          <div className="mt-2 text-sm text-white/60">
                              Иммерсивные игровые события
                          </div>

                          {/* Соцсети */}
                          <div className="mt-4 flex items-center gap-4 text-white/70">

                              <a
                                  href="https://vk.com/hodsydby"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 hover:text-white transition"
                              >
                                  <FaVk size={18} />
                                  VK
                              </a>

                              <a
                                  href="https://t.me/xod_sudby"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 hover:text-white transition"
                              >
                                  <FaTelegram size={18} />
                                  Telegram
                              </a>

                          </div>
                      </div>

                      {/* Документы */}
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

                          <div>
                              <a href="/consent" className="hover:text-white">
                                  Согласие на обработку персональных данных
                              </a>
                          </div>
                      </div>

                  </div>

                  {/* Нижняя часть */}
                  <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40 leading-relaxed space-y-1">

                      <div>
                          Индивидуальный предприниматель Лыженков Кирилл Александрович
                      </div>

                      <div>
                          ОГРНИП: 326784700073921 · ИНН: 781101882985
                      </div>

                      <div>
                          Email:{" "}
                          <a
                              href="mailto:info@hs-game.ru"
                              className="hover:text-white"
                          >
                              info@hs-game.ru
                          </a>
                      </div>

                      <div className="pt-2">
                          © {new Date().getFullYear()} Ход Судьбы. Все права защищены.
                      </div>

                  </div>

              </div>
          </footer>
      </main>
  );
}
