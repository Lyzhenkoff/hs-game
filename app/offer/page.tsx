export default function OfferPage() {
    return (
        <main className="min-h-screen text-zinc-50">
            <div className="mx-auto max-w-3xl px-6 py-16">

                <a
                    href="/"
                    className="text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                    ← На главную
                </a>

                <h1 className="mt-8 text-3xl md:text-5xl font-semibold">
                    Публичная оферта
                </h1>

                <div className="mt-10 space-y-8 text-sm md:text-base text-zinc-200/85 leading-relaxed">

                    <section>
                        <h2 className="text-lg font-semibold mb-3">1. Общие положения</h2>
                        <p>
                            Настоящий документ является официальным предложением Индивидуального предпринимателя
                            Лыженкова Кирилла Александровича заключить договор на оказание услуг по участию
                            в интерактивной игре «Ход Судьбы».
                        </p>
                        <p className="mt-3">
                            Акцептом оферты считается оформление заявки и/или оплата билета.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">2. Предмет договора</h2>
                        <p>
                            Исполнитель предоставляет Участнику право участия в открытой офлайн-игре
                            «Ход Судьбы» в дату и месте, указанных в анонсе мероприятия.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">3. Стоимость и оплата</h2>
                        <p>
                            Стоимость билета указывается в анонсе конкретной Игры.
                            Билет считается действительным после подтверждения оплаты.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">4. Условия возврата билетов</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Более чем за 7 дней — возврат 100% стоимости.</li>
                            <li>За 3–7 дней — возврат 50% стоимости.</li>
                            <li>Менее чем за 3 дня — возврат не производится.</li>
                        </ul>
                        <p className="mt-3">
                            Участник вправе передать билет другому лицу либо перенести участие
                            на следующую дату при наличии мест.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">5. Перенос или отмена</h2>
                        <p>
                            В случае отмены мероприятия по инициативе Исполнителя
                            осуществляется полный возврат денежных средств
                            либо предлагается участие в новую дату.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">6. Интеллектуальная собственность</h2>
                        <p>
                            Все сценарии, тексты и игровые механики являются интеллектуальной
                            собственностью Исполнителя и не подлежат копированию.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-3">7. Реквизиты</h2>
                        <p>
                            ИП Лыженков Кирилл Александрович
                            <br />
                            Telegram: https://t.me/klyzhh
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}

