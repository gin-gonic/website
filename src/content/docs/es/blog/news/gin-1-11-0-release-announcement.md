---
title: "¡Gin 1.11.0 ha llegado! HTTP/3, mejoras de formularios, rendimiento y más"
linkTitle: "Anuncio de Gin 1.11.0"
lastUpdated: 2025-09-21
---

## ¡Ya está disponible Gin v1.11.0

¡Nos complace anunciar el lanzamiento de Gin v1.11.0, que trae una serie de nuevas funcionalidades, mejoras de rendimiento y correcciones de errores al popular framework web! Esta versión mantiene el compromiso de Gin con la velocidad, la flexibilidad y el desarrollo moderno en Go.

### 🌟 Características principales

- **Soporte experimental para HTTP/3:** Gin ahora ofrece soporte experimental para HTTP/3 a través de [quic-go](https://github.com/quic-go/quic-go). Si quieres probar los protocolos web más modernos, esta es tu oportunidad. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Mejoras en el binding de formulario:** Grandes mejoras en el binding de formularios:
  - Soporte para formatos de colecciones tipo array en formularios ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Unmarshal personalizado de slices de string en etiquetas de formulario ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Valores por defecto para colecciones ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Mejor compatibilidad de tipos en binding:** Nuevo método `BindPlain` para texto plano ([#3904](https://github.com/gin-gonic/gin/pull/3904)), además de soporte para formatos unixMilli y unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Mejoras en la API de Context:** `GetXxx` ahora soporta más tipos nativos de Go ([#3633](https://github.com/gin-gonic/gin/pull/3633)), facilitando recuperar datos de contexto de manera segura por tipo.

- **Actualizaciones en el sistema de archivos:** El nuevo `OnlyFilesFS` ahora está exportado, probado y documentado ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### 🚀 Rendimiento y mejoras

- **Procesamiento de formularios más rápido:** Optimizaciones internas para el parsing de formularios mejoran el rendimiento ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Refactorizaciones en el core, render y lógica de contexto para mayor robustez y claridad ([lista completa de PRs en changelog](../releases/release111.md)).

### 🐛 Correcciones de errores

- **Middleware más confiable:** Se solucionó un bug raro donde el middleware podía reentrar inesperadamente ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- Mejor estabilidad en binding de formularios TOML ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- Ya no hay pánicos al manejar solicitudes "method not allowed" en árboles vacíos ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- Mejoras generales en el manejo de contexto, condiciones de carrera y más.

### 🔧 Actualizaciones de build, dependencias y CI

- Compatibilidad con **Go 1.25** en los flujos de trabajo CI/CD, además de nuevos linters habilitados para mayor calidad de código ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Escaneo de vulnerabilidades con Trivy integrado en el CI ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- Varias actualizaciones de dependencias, incluyendo `sonic`, `setup-go`, `quic-go` y más.

### 📖 Documentación

- Documentación expandida, changelogs actualizados, mejores ejemplos y gramática, y nuevos docs en portugués ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0 es prueba del compromiso de nuestra comunidad y desarrollo continuo. ¡Gracias a todos los contribuyentes, reportadores de errores y usuarios que mantienen a Gin relevante y moderno para las aplicaciones web!

¿Listo para probar Gin 1.11.0? [¡Actualiza desde GitHub!](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) ¡Esperamos tus comentarios!
