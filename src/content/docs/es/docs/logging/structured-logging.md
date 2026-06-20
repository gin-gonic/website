---
title: "Logging estructurado"
sidebar:
  order: 7
---

El logging estructurado produce una salida de logs legible por máquinas (típicamente JSON) en lugar de texto plano. Esto hace que los logs sean más fáciles de buscar, filtrar y analizar en sistemas de agregación de logs como ELK Stack, Datadog o Grafana Loki.

## Por qué logging estructurado

El logger predeterminado de Gin produce texto legible por humanos, que es excelente para desarrollo pero difícil de analizar a escala. El logging estructurado te da:

- **Campos consultables** -- filtrar logs por código de estado, latencia o ID de usuario
- **Formato consistente** -- cada entrada de log tiene la misma forma
- **Correlación** -- rastrear una solicitud a través de servicios usando IDs de solicitud

## Usando slog (Go 1.21+)

La biblioteca estándar de Go incluye `log/slog` para logging estructurado. Así es como usarlo con Gin:

```go
package main

import (
  "log/slog"
  "os"
  "time"

  "github.com/gin-gonic/gin"
)

func SlogMiddleware(logger *slog.Logger) gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path
    query := c.Request.URL.RawQuery

    c.Next()

    logger.Info("request",
      slog.String("method", c.Request.Method),
      slog.String("path", path),
      slog.String("query", query),
      slog.Int("status", c.Writer.Status()),
      slog.Duration("latency", time.Since(start)),
      slog.String("client_ip", c.ClientIP()),
      slog.Int("body_size", c.Writer.Size()),
    )

    if len(c.Errors) > 0 {
      for _, err := range c.Errors {
        logger.Error("request error", slog.String("error", err.Error()))
      }
    }
  }
}

func main() {
  logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

  r := gin.New()
  r.Use(SlogMiddleware(logger))
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

Esto produce entradas de log como:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## ID de solicitud / ID de correlación

Agregar un ID de solicitud único a cada entrada de log ayuda a rastrear solicitudes a través de servicios:

```go
package main

import (
  "log/slog"
  "os"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/google/uuid"
)

func RequestIDMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    requestID := c.GetHeader("X-Request-ID")
    if requestID == "" {
      requestID = uuid.New().String()
    }
    c.Set("request_id", requestID)
    c.Header("X-Request-ID", requestID)
    c.Next()
  }
}

func SlogMiddleware(logger *slog.Logger) gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    c.Next()

    requestID, _ := c.Get("request_id")
    logger.Info("request",
      slog.String("request_id", requestID.(string)),
      slog.String("method", c.Request.Method),
      slog.String("path", c.Request.URL.Path),
      slog.Int("status", c.Writer.Status()),
      slog.Duration("latency", time.Since(start)),
    )
  }
}

func main() {
  logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

  r := gin.New()
  r.Use(RequestIDMiddleware())
  r.Use(SlogMiddleware(logger))
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

## Usando zerolog

[zerolog](https://github.com/rs/zerolog) es un popular logger JSON sin asignaciones de memoria:

```go
package main

import (
  "os"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/rs/zerolog"
  "github.com/rs/zerolog/log"
)

func ZerologMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    c.Next()

    log.Info().
      Str("method", c.Request.Method).
      Str("path", c.Request.URL.Path).
      Int("status", c.Writer.Status()).
      Dur("latency", time.Since(start)).
      Str("client_ip", c.ClientIP()).
      Msg("request")
  }
}

func main() {
  zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

  // Pretty logging for development
  if gin.Mode() == gin.DebugMode {
    log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
  }

  r := gin.New()
  r.Use(ZerologMiddleware())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

## Mejores prácticas

- **Usa formato JSON en producción** -- formato legible por humanos para desarrollo, JSON para agregación de logs en producción
- **Incluye IDs de solicitud** -- propaga los encabezados `X-Request-ID` a través de los límites de servicios para rastreo distribuido
- **Registra en los niveles apropiados** -- usa `Info` para solicitudes normales, `Warn` para 4xx, `Error` para 5xx
- **Evita registrar datos sensibles** -- excluye contraseñas, tokens y PII de la salida de logs
- **Configura `GIN_MODE=release`** -- esto deshabilita el logging de depuración predeterminado de Gin en producción

## Ver también

- [Cómo escribir un archivo de log](/es/docs/logging/write-log/)
- [Evitar registrar cadenas de consulta](/es/docs/logging/avoid-logging-query-strings/)
- [Formato de log personalizado](/es/docs/logging/custom-log-format/)
