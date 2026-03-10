---
title: "Anunciamos Gin 1.12.0: Compatibilidad BSON, Mejoras de Context, Rendimiento y Más"
linkTitle: "Anuncio de lanzamiento de Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 Ha Llegado

Nos complace anunciar el lanzamiento de Gin v1.12.0, lleno de nuevas funciones, mejoras significativas de rendimiento y una sólida ronda de correcciones de errores. Este lanzamiento profundiza el soporte de Gin para protocolos modernos, refina la experiencia del desarrollador y continúa la tradición del proyecto de mantenerse rápido y ligero.

### 🌟 Características Clave

- **Compatibilidad con Protocolo BSON:** La capa de renderizado ahora admite codificación BSON, abriendo la puerta a un intercambio de datos binarios más eficiente ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **Nuevos Métodos de Context:** Dos nuevos auxiliares hacen que el manejo de errores sea más limpio e idiomático:
  - `GetError` y `GetErrorSlice` para la recuperación de errores de tipo seguro desde el contexto ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - Método `Delete` para eliminar claves del contexto ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **Enlace Flexible:** El enlace de URI y consulta ahora respeta `encoding.UnmarshalText`, dándole más control sobre la deserialización de tipos personalizados ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **Opción de Ruta Escapada:** Una nueva opción de motor te permite optar por usar la ruta de solicitud escapada (cruda) para el enrutamiento ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **Búferes de Protocolo en Negociación de Contenido:** `context` ahora admite Búferes de Protocolo como tipo de contenido negociable, facilitando la integración de respuestas de estilo gRPC ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **Latencia Colorizada en Logger:** El logger predeterminado ahora representa la latencia con color, facilitando la identificación de solicitudes lentas de un vistazo ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### 🚀 Rendimiento y Mejoras

- **Optimizaciones del Árbol de Enrutamiento:** Múltiples mejoras al árbol radix reducen asignaciones y aceleran el análisis de rutas:
  - Menos asignaciones en `findCaseInsensitivePath` ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - Análisis de rutas usando `strings.Count` para eficiencia ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - Expresiones regulares reemplazadas con funciones personalizadas en `redirectTrailingSlash` ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **Optimización de Recuperación:** La lectura de seguimiento de pila ahora es más eficiente ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **Mejoras del Logger:** La salida de cadena de consulta ahora se puede omitir mediante configuración ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Confianza de Socket Unix:** Los encabezados `X-Forwarded-For` ahora siempre son de confianza cuando las solicitudes llegan a través de un socket Unix ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Seguridad de Flush:** `Flush()` ya no genera pánico cuando el `http.ResponseWriter` subyacente no implementa `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **Refactorizaciones de Calidad de Código:** Manejo de mapas más limpio con `maps.Copy` y `maps.Clone`, constantes nombradas reemplazando números mágicos, bucles range-over-int modernizados y más ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### 🐛 Correcciones de Errores

- **Pánico del Enrutador Corregido:** Se resolvió un pánico en `findCaseInsensitivePathRec` cuando `RedirectFixedPath` está habilitado ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Content-Length en Renderizado de Datos:** `Data.Render` ahora escriba correctamente el encabezado `Content-Length` ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **ClientIP con Múltiples Encabezados:** `ClientIP` ahora maneja correctamente solicitudes con múltiples valores de encabezado `X-Forwarded-For` ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **Casos Límite de Enlace:** Se corrigieron errores de valor vacío en enlace ([#2169](https://github.com/gin-gonic/gin/pull/2169)) y se mejoró el manejo de matrices/slices vacíos en enlace de formulario ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **Rutas con Dos Puntos Literales:** Las rutas con dos puntos literales ahora funcionan correctamente con `engine.Handler()` ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **Fuga de Descriptor de Archivo:** `RunFd` ahora cierra correctamente el identificador `os.File` para prevenir fugas de recursos ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Comportamiento de Hijack:** Se refinó el comportamiento de hijack para modelar correctamente el ciclo de vida de la respuesta ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **Recuperación:** `http.ErrAbortHandler` ahora se suprime en el middleware de recuperación como se pretendía ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **Versión Debug No Coincidente:** Se corrigió una cadena de versión incorrecta reportada en modo de depuración ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### 🔧 Actualizaciones de Compilación, Dependencia e IC

- **Mínimo de Go 1.25:** La versión mínima de Go compatible ahora es **1.25**, con flujos de trabajo de CI actualizados en consecuencia ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **Actualización de Dependencia BSON:** La dependencia de enlace BSON ha sido actualizada a `mongo-driver` v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0 refleja la dedicación de nuestra comunidad: colaboradores, revisores y usuarios por igual. ¡Gracias por hacer que Gin sea mejor con cada lanzamiento!

¿Listo para probar Gin 1.12.0? ¡[Actualiza en GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.12.0) y cuéntanos qué piensas!
