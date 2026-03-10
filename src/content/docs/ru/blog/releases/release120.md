---
title: "Выпущена версия Gin 1.12.0"
linkTitle: "Выпущена версия Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### Возможности

* feat(binding): добавлена поддержка encoding.UnmarshalText в привязке uri/query ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): добавлены методы GetError и GetErrorSlice для получения ошибок ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): добавлена поддержка Protocol Buffers для согласования контента ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): реализован метод Delete ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): добавлена опция использования экранированного пути ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): цветовая задержка ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): добавлен протокол bson ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### Исправления ошибок

* fix(binding): исправлена ошибка пустого значения ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): улучшена обработка пустых срезов/массивов при привязке формы ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): исправлена обработка ClientIP при наличии нескольких значений заголовка X-Forwarded-For ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): исправлено несоответствие версии ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): закрытие os.File в RunFd для предотвращения утечки ресурсов ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): исправлены маршруты с буквальным двоеточием, не работающие с engine.Handler() ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): подавление http.ErrAbortHandler в recovery ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): запись длины контента в Data.Render ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): улучшено поведение hijack для жизненного цикла ответа ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): исправлена паника в findCaseInsensitivePathRec с RedirectFixedPath ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: исправлены опечатки, улучшена ясность документации и удален мертвый код ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### Улучшения

* chore(binding): обновлена зависимость bson на mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): всегда доверять заголовкам xff из unix сокета ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): обновлен golang.org/x/crypto до v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): обновлен quic-go до v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): разрешить пропускать вывод строки запроса ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): предотвращение паники Flush() при наличии http.Flusher ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### Рефакторинг

* refactor(binding): использован maps.Copy для более чистой работы с картами ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): опущены имена возвращаемых значений ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): заменены жестко закодированные IP-адреса localhost на константы ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): использование maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): использован sync.OnceValue для упрощения функции engine ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): умное сравнение ошибок ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): перемещены утилит-функции в utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: цикл for можно модернизировать с помощью range по int ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: заменены магические числа названными константами в bodyAllowedForStatus ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: использован b.Loop() для упрощения кода и улучшения производительности ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### Обновления процесса сборки / CI

* ci(bot): увеличена частота и сгруппированы обновления зависимостей ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): рефакторированы утверждения тестов и конфигурация linter ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): улучшена типобезопасность и организация сервера в HTTP middleware ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): запланировано запуск сканирования безопасности Trivy ежедневно в полночь UTC ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: заменен рабочий процесс сканирования уязвимостей на интеграцию Trivy ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: обновлены рабочие процессы CI и стандартизированы кавычки конфигурации Trivy ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: обновлена поддержка версии Go на 1.25+ во всех CI и документации ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### Обновления документации

* docs(README): добавлен значок сканирования безопасности Trivy ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): добавлены примеры комментариев для методов ShouldBind\* ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): исправлены некоторые комментарии ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): исправлено неправильное имя функции в комментарии ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): переработана и расширена документация для большей ясности и полноты ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: объявлен выпуск Gin 1.11.0 со ссылкой на блог ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: задокументирован и завершен выпуск Gin v1.12.0 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: переработаны шаблоны вкладов GitHub и поддержки ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: переработаны рекомендации по внесению вклада с подробными инструкциями ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: обновлена документация для отражения изменений версии Go ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: обновлены инструкции документации функции для исправления неработающей ссылки ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### Производительность

* perf(path): замена регулярного выражения на пользовательские функции в redirectTrailingSlash ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): оптимизация чтения строк в функции stack ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): оптимизация синтаксического анализа пути с использованием strings.Count ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): сокращение распределений в findCaseInsensitivePath ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### Тесты

* test(benchmarks): исправлено неправильное имя функции ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): добавлены тесты для пустых/nil случаев ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): использована константа http.StatusContinue вместо магического числа 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): улучшено покрытие тестами debug.go до 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): добавлено полное покрытие тестами пакета ginS ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): разрешены гонки условий в интеграционных тестах ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): добавлены полные тесты обработки ошибок ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): добавлены полные тесты для рендеринга MsgPack ([#4537](https://github.com/gin-gonic/gin/pull/4537))
