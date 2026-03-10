---
title: "Se lanzó Gin 1.12.0"
linkTitle: "Se lanzó Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### Características

* feat(binding): agregar soporte para encoding.UnmarshalText en binding uri/query ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): agregar métodos GetError y GetErrorSlice para la recuperación de errores ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): agregar soporte de Protocol Buffers a la negociación de contenido ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): implementar método Delete ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): agregar opción para usar ruta escapada ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): latencia de color ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): agregar protocolo bson ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### Correcciones de errores

* fix(binding): error de valor vacío ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): mejorar el manejo de cortes/matrices vacías en binding de formulario ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): corregir el manejo de ClientIP para valores de encabezado X-Forwarded-For múltiples ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): desajuste de versión ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): cerrar os.File en RunFd para prevenir fugas de recursos ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): corregir rutas de dos puntos literales que no funcionan con engine.Handler() ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): suprimir http.ErrAbortHandler en recover ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): escribir longitud de contenido en Data.Render ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): refinar el comportamiento de secuestro para el ciclo de vida de la respuesta ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): corregir pánico en findCaseInsensitivePathRec con RedirectFixedPath ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: Corregir errores tipográficos, mejorar la claridad de la documentación y eliminar código muerto ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### Mejoras

* chore(binding): actualizar dependencia bson a mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): siempre confiar en encabezados xff del socket unix ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): actualizar golang.org/x/crypto a v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): actualizar quic-go a v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): permitir omitir la salida de cadena de consulta ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): prevenir pánico de Flush() cuando `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### Refactorización

* refactor(binding): usar maps.Copy para un manejo de mapas más limpio ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): omitir nombres de valores devueltos ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): reemplazar direcciones IP locales codificadas con constantes ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): usando maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): usar sync.OnceValue para simplificar la función engine ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): comparación inteligente de errores ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): mover funciones util a utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: el bucle for se puede modernizar usando range sobre int ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: reemplazar números mágicos con constantes nombradas en bodyAllowedForStatus ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: usar b.Loop() para simplificar el código y mejorar el rendimiento ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### Actualizaciones de procesos de compilación / CI

* ci(bot): aumentar la frecuencia y agrupar actualizaciones de dependencias ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): refactorizar afirmaciones de prueba y configuración de linter ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): mejorar la seguridad de tipos y la organización de servidores en middleware HTTP ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): programar escaneos de seguridad de Trivy para ejecutarse diariamente a medianoche UTC ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: reemplazar flujo de trabajo de análisis de vulnerabilidades con integración de Trivy ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: actualizar flujos de trabajo de CI y estandarizar comillas de configuración de Trivy ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: actualizar soporte de versión Go a 1.25+ en CI y documentación ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### Actualizaciones de documentación

* docs(README): agregar una insignia de análisis de seguridad de Trivy ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): agregar comentarios de ejemplo para métodos ShouldBind\* ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): corregir algunos comentarios ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): corregir nombre de función incorrecto en comentario ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): revitalizar y expandir documentación para mayor claridad e integridad ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: anunciar el lanzamiento de Gin 1.11.0 con enlace de blog ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: documentar y finalizar el lanzamiento de Gin v1.12.0 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: revitalizar plantillas de contribución y soporte de GitHub ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: revitalizar pautas de contribución con instrucciones completas ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: actualizar documentación para reflejar cambios de versión de Go ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: actualizar instrucciones de documentación de características para enlace de documentación roto ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### Rendimiento

* perf(path): reemplazar regex con funciones personalizadas en redirectTrailingSlash ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): optimizar la lectura de líneas en la función stack ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): optimizar el análisis de ruta usando strings.Count ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): reducir asignaciones en findCaseInsensitivePath ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### Pruebas

* test(benchmarks): corregir nombre de función incorrecto ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): agregar pruebas para casos vacío/nil ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): usar constante http.StatusContinue en lugar del número mágico 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): mejorar la cobertura de prueba de debug.go al 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): agregar cobertura de prueba completa para el paquete ginS ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): resolver condiciones de carrera en pruebas de integración ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): agregar pruebas integrales de manejo de errores ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): agregar pruebas integrales para renderizado de MsgPack ([#4537](https://github.com/gin-gonic/gin/pull/4537))
