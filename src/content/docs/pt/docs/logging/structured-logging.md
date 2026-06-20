---
title: "Logging Estruturado"
sidebar:
  order: 7
---

Logging estruturado produz saída de log legível por máquina (tipicamente JSON) em vez de texto simples. Isso torna os logs mais fáceis de pesquisar, filtrar e analisar em sistemas de agregação de logs como ELK Stack, Datadog ou Grafana Loki.

## Por que logging estruturado?

O logger padrão do Gin produz texto legível por humanos, o que é ótimo para desenvolvimento mas difícil de analisar em escala. Logging estruturado oferece:

- **Campos consultáveis** -- filtre logs por código de status, latência ou ID de usuário
- **Formato consistente** -- cada entrada de log tem a mesma estrutura
- **Correlação** -- rastreie uma requisição entre serviços usando IDs de requisição

## Usando slog (Go 1.21+)

A biblioteca padrão do Go inclui `log/slog` para logging estruturado. Veja como usá-lo com Gin:

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

Isso produz entradas de log como:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## ID de Requisição / ID de Correlação

Adicionar um ID de requisição único a cada entrada de log ajuda a rastrear requisições entre serviços:

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

[zerolog](https://github.com/rs/zerolog) é um popular logger JSON sem alocações:

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

## Melhores práticas

- **Use formato JSON em produção** -- formato legível por humanos para desenvolvimento, JSON para agregação de logs em produção
- **Inclua IDs de requisição** -- propague headers `X-Request-ID` entre fronteiras de serviços para rastreamento distribuído
- **Registre em níveis apropriados** -- use `Info` para requisições normais, `Warn` para 4xx, `Error` para 5xx
- **Evite registrar dados sensíveis** -- exclua senhas, tokens e PII da saída de log
- **Defina `GIN_MODE=release`** -- isso desabilita o logging de debug padrão do Gin em produção

## Veja também

- [Como escrever arquivo de log](/pt/docs/logging/write-log/)
- [Evitar logging de query strings](/pt/docs/logging/avoid-logging-query-strings/)
- [Formato de log customizado](/pt/docs/logging/custom-log-format/)
