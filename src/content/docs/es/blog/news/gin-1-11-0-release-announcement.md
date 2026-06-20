---
title: "Anuncio de Gin 1.11.0: HTTP/3, Mejoras en formularios, Rendimiento y más"
linkTitle: "Anuncio de lanzamiento de Gin 1.11.0"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 ha llegado

Estamos emocionados de anunciar el lanzamiento de Gin v1.11.0, que trae un importante conjunto de nuevas características, ajustes de rendimiento y correcciones de errores al querido framework web. Este lanzamiento continúa el compromiso de Gin con la velocidad, la flexibilidad y el desarrollo moderno en Go.

### Características principales

- **Soporte experimental de HTTP/3:** Gin ahora soporta HTTP/3 experimental a través de [quic-go](https://github.com/quic-go/quic-go). Si estás ansioso por probar los últimos protocolos de transporte web, esta es tu oportunidad. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Mejor enlace de formularios:** Hemos realizado grandes mejoras en el enlace de formularios:
  - Soporte para formatos de colección de arrays en formularios ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Deserialización personalizada de slices de strings para etiquetas de formulario ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Valores predeterminados para colecciones ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Tipos de enlace mejorados:** Enlaza texto plano fácilmente con el nuevo método `BindPlain` ([#3904](https://github.com/gin-gonic/gin/pull/3904)), además de soporte para formatos unixMilli y unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Mejoras en la API de Context:** `GetXxx` ahora soporta más tipos nativos de Go ([#3633](https://github.com/gin-gonic/gin/pull/3633)), facilitando la recuperación de datos del contexto con seguridad de tipos.

- **Actualizaciones del sistema de archivos:** El nuevo `OnlyFilesFS` ahora está exportado, probado y documentado ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### Rendimiento y mejoras

- **Manejo más rápido de datos de formulario:** Optimizaciones internas para el análisis de formularios que mejoran el rendimiento ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Refactorización del núcleo, renderizado y lógica de contexto para mayor robustez y claridad ([lista completa de PRs en el changelog](../releases/release111.md)).

### Correcciones de errores

- **Fiabilidad del middleware:** Se corrigió un error poco frecuente donde el middleware podía reingresar inesperadamente ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- Mejora en la estabilidad del enlace de formularios TOML ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- Se eliminaron los panics al manejar solicitudes "method not allowed" en árboles vacíos ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- Mejoras generales en el manejo de contexto, condiciones de carrera y más.

### Actualizaciones de compilación, dependencias y CI

- Soporte para **Go 1.25** en los flujos de trabajo de CI/CD, además de nuevos linters habilitados para una mayor salud del código ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Escaneo de vulnerabilidades Trivy ahora integrado con CI ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- Múltiples actualizaciones de dependencias, incluyendo `sonic`, `setup-go`, `quic-go` y otras.

### Documentación

- Documentación ampliada, changelogs actualizados, gramática y ejemplos de código mejorados, y nueva documentación en portugués ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0 es un testimonio de nuestra comunidad activa y desarrollo continuo. Agradecemos a cada contribuidor, reportador de problemas y usuario que mantiene a Gin afilado y relevante para las aplicaciones web modernas.

¿Listo para probar Gin 1.11.0? [Actualiza en GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) y cuéntanos qué te parece.
