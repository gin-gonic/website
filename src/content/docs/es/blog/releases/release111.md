---
title: "Gin 1.11.0 ha sido lanzado"
linkTitle: "Gin 1.11.0 ha sido lanzado"
lastUpdated: 2024-09-20
---

## Gin v1.11.0

### Características

* feat(gin): Soporte experimental para HTTP/3 utilizando quic-go/quic-go ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): agregado formato de colección de arreglos en enlace de formularios ([#3986](https://github.com/gin-gonic/gin/pull/3986)), añadido slice de cadenas personalizado para deserialización de etiqueta form ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): añadido BindPlain ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): Exportar, probar y documentar OnlyFilesFS ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): soporte para unixMilli y unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): soporte de valores por defecto para colecciones en enlace de formularios ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): GetXxx ahora admite más tipos nativos de Go ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### Mejoras

* perf(context): optimizar el rendimiento de getMapFromFormData ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): reemplazar string(/) con "/" en node.insertChild ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): eliminar el parámetro headers de writeHeader ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): simplificar funciones "GetType()" ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): simplificar el método Error de SliceValidationError ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): evitar el uso doble de filepath.Dir en SaveUploadedFile ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): refactorizar manejo del contexto y mejorar robustez de pruebas ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): utilizar strings.Cut para reemplazar strings.Index ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): añadir un parámetro de permiso opcional a SaveUploadedFile ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): verificar que URL no sea nulo en initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): lógica de juicio YAML en Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: reemplazar 'min' personalizado por versión oficial ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: eliminar uso redundante de filepath.Dir ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### Corrección de errores

* fix: prevenir reentrada de middleware en HandleContext ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): prevenir decodificación duplicada y agregar validación en decodeToml ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): evitar pánico al manejar método no permitido en árbol vacío ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): advertencia de carrera de datos para modo gin ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): verificar que URL no sea nulo en initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): lógica de juicio YAML en Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): comprobar si el manejador es nulo ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): corregir enlace roto con la documentación en inglés ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): mantener la información de pánico consistente cuando falla la construcción de tipo comodín ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### Actualizaciones del proceso de construcción / CI

* ci: integrar escaneo de vulnerabilidades Trivy al flujo de CI ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: soporte para Go 1.25 en CI/CD ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): actualizar github.com/bytedance/sonic de v1.13.2 a v1.14.0 ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: agregar versión Go 1.24 a GitHub Actions ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: actualizar versión mínima de Go para Gin a 1.21 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): habilitar nuevos linters (testifylint, usestdlibvars, perfsprint, etc.) ([#4010](https://github.com/gin-gonic/gin/pull/4010), [#4091](https://github.com/gin-gonic/gin/pull/4091), [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): actualizar flujos de trabajo y mejorar consistencia en solicitudes de prueba ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### Actualizaciones de dependencias

* chore(deps): actualizar google.golang.org/protobuf de 1.36.6 a 1.36.9 ([#4346](https://github.com/gin-gonic/gin/pull/4346), [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): actualizar github.com/stretchr/testify de 1.10.0 a 1.11.1 ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): actualizar actions/setup-go de 5 a 6 ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): actualizar github.com/quic-go/quic-go de 0.53.0 a 0.54.0 ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): actualizar golang.org/x/net de 0.33.0 a 0.38.0 ([#4178](https://github.com/gin-gonic/gin/pull/4178), [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): actualizar github.com/go-playground/validator/v10 de 10.20.0 a 10.22.1 ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### Actualizaciones de documentación

* docs(changelog): actualizar notas de la versión para Gin v1.10.1 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: correcciones de errores gramaticales en inglés y frases incómodas en doc/doc.md ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: actualizar documentación y notas de la versión para Gin v1.10.0 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: corregir error tipográfico en Gin Quick Start ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: corregir problemas en comentarios y enlaces ([#4205](https://github.com/gin-gonic/gin/pull/4205), [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: corregir ejemplo de código de grupo de rutas ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): añadir documentación en portugués ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): corregir algunos nombres de funciones en comentarios ([#4079](https://github.com/gin-gonic/gin/pull/4079))
