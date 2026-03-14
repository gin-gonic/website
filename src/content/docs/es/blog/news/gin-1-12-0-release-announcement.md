---
title: "Anuncio de Gin 1.12.0: Soporte BSON, Mejoras de Context, Rendimiento y más"
linkTitle: "Anuncio de lanzamiento de Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 ha llegado

Estamos encantados de anunciar el lanzamiento de Gin v1.12.0, repleto de nuevas características, mejoras significativas de rendimiento y una sólida ronda de correcciones de errores. Este lanzamiento profundiza el soporte de Gin para protocolos modernos, refina la experiencia del desarrollador y continúa la tradición del proyecto de mantenerse rápido y ligero.

### Características principales

- **Soporte del protocolo BSON:** La capa de renderizado ahora soporta la codificación BSON, abriendo la puerta a un intercambio de datos binarios más eficiente ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **Nuevos métodos de Context:** Dos nuevos helpers hacen que el manejo de errores sea más limpio e idiomático:
  - `GetError` y `GetErrorSlice` para la recuperación de errores con seguridad de tipos desde el contexto ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - Método `Delete` para eliminar claves del contexto ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **Enlace flexible:** El enlace de URI y query ahora respeta `encoding.UnmarshalText`, dándote más control sobre la deserialización de tipos personalizados ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **Opción de ruta escapada:** Una nueva opción del engine te permite optar por usar la ruta de solicitud escapada (sin procesar) para el enrutamiento ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **Protocol Buffers en la negociación de contenido:** `context` ahora soporta Protocol Buffers como tipo de contenido negociable, facilitando la integración de respuestas estilo gRPC ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **Latencia coloreada en el Logger:** El logger predeterminado ahora muestra la latencia con color, facilitando detectar solicitudes lentas de un vistazo ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### Rendimiento y mejoras

- **Optimizaciones del árbol del router:** Múltiples mejoras en el árbol radix reducen las asignaciones y aceleran el análisis de rutas:
  - Menos asignaciones en `findCaseInsensitivePath` ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - Análisis de rutas usando `strings.Count` para mayor eficiencia ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - Regex reemplazado con funciones personalizadas en `redirectTrailingSlash` ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **Optimización de recuperación:** La lectura de stack traces es ahora más eficiente ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **Mejoras del Logger:** La salida de query strings ahora puede omitirse mediante configuración ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Confianza en Unix Socket:** Los headers `X-Forwarded-For` ahora siempre son confiables cuando las solicitudes llegan a través de un socket Unix ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Seguridad de Flush:** `Flush()` ya no produce panic cuando el `http.ResponseWriter` subyacente no implementa `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **Refactorizaciones de calidad de código:** Manejo más limpio de mapas con `maps.Copy` y `maps.Clone`, constantes con nombre reemplazando números mágicos, bucles modernizados range-over-int y más ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### Correcciones de errores

- **Panic del router corregido:** Se resolvió un panic en `findCaseInsensitivePathRec` cuando `RedirectFixedPath` está habilitado ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Content-Length en renderizado de datos:** `Data.Render` ahora escribe correctamente el header `Content-Length` ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **ClientIP con múltiples headers:** `ClientIP` ahora maneja correctamente solicitudes con múltiples valores de header `X-Forwarded-For` ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **Casos límite de enlace:** Se corrigieron errores de valores vacíos en el enlace ([#2169](https://github.com/gin-gonic/gin/pull/2169)) y se mejoró el manejo de slices/arrays vacíos en el enlace de formularios ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **Rutas con dos puntos literales:** Las rutas con dos puntos literales ahora funcionan correctamente con `engine.Handler()` ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **Fuga de descriptores de archivo:** `RunFd` ahora cierra correctamente el handle `os.File` para prevenir fugas de recursos ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Comportamiento de Hijack:** Se refinó el comportamiento de hijack para modelar correctamente el ciclo de vida de la respuesta ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **Recuperación:** `http.ErrAbortHandler` ahora se suprime en el middleware de recuperación como estaba previsto ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **Discrepancia de versión en debug:** Se corrigió una cadena de versión incorrecta reportada en modo debug ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### Actualizaciones de compilación, dependencias y CI

- **Mínimo Go 1.25:** La versión mínima de Go soportada es ahora **1.25**, con los flujos de trabajo de CI actualizados correspondientemente ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **Actualización de dependencia BSON:** La dependencia de enlace BSON ha sido actualizada a `mongo-driver` v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0 refleja la dedicación de nuestra comunidad: contribuidores, revisores y usuarios por igual. Gracias por hacer Gin mejor con cada lanzamiento.

¿Listo para probar Gin 1.12.0? [Actualiza en GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.12.0) y cuéntanos qué te parece.
