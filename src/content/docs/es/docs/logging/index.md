---
title: "Logging"
sidebar:
  order: 7
---

Gin incluye un middleware de logger incorporado que registra detalles sobre cada solicitud HTTP, incluyendo el código de estado, método HTTP, ruta y latencia.

Cuando creas un enrutador con `gin.Default()`, el middleware de logger se adjunta automáticamente junto con el middleware de recuperación:

```go
// Logger and Recovery middleware are already attached
router := gin.Default()
```

Si necesitas control total sobre qué middleware usar, crea un enrutador con `gin.New()` y agrega el logger manualmente:

```go
// No middleware attached
router := gin.New()

// Attach the logger middleware
router.Use(gin.Logger())
```

El logger predeterminado escribe en `os.Stdout` y produce una salida como esta para cada solicitud:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     512.345µs |       127.0.0.1 | GET      "/ping"
```

Cada entrada incluye una marca de tiempo, código de estado HTTP, latencia de la solicitud, IP del cliente, método HTTP y la ruta solicitada.

## En esta sección

- [**Escribir logs en un archivo**](./write-log/) -- Redirigir la salida de logs a un archivo, a la consola o a ambos al mismo tiempo.
- [**Formato de log personalizado**](./custom-log-format/) -- Definir tu propio formato de log usando `LoggerWithFormatter`.
- [**Omitir logging**](./skip-logging/) -- Omitir el logging para rutas o condiciones específicas.
- [**Controlar el color de la salida de logs**](./controlling-log-output-coloring/) -- Habilitar o deshabilitar la salida de logs con color.
- [**Evitar registrar cadenas de consulta**](./avoid-logging-query-strings/) -- Eliminar parámetros de consulta de la salida de logs por seguridad y privacidad.
- [**Definir formato para el log de rutas**](./define-format-for-the-log-of-routes/) -- Personalizar cómo se imprimen las rutas registradas al iniciar.
