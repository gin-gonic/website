---
title: "Структурированное логирование"
sidebar:
  order: 7
---

Структурированное логирование создаёт машиночитаемый вывод логов (обычно JSON) вместо обычного текста. Это упрощает поиск, фильтрацию и анализ логов в системах агрегации логов, таких как ELK Stack, Datadog или Grafana Loki.

## Зачем структурированное логирование?

Стандартный логгер Gin выводит человекочитаемый текст, который отлично подходит для разработки, но сложен для парсинга в масштабе. Структурированное логирование даёт вам:

- **Запрашиваемые поля** — фильтрация логов по коду статуса, задержке или ID пользователя
- **Согласованный формат** — каждая запись лога имеет одинаковую структуру
- **Корреляция** — трассировка запроса между сервисами с помощью ID запроса

## Использование slog (Go 1.21+)

Стандартная библиотека Go включает `log/slog` для структурированного логирования. Вот как использовать его с Gin:

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

Это создаёт записи логов вида:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## ID запроса / Корреляционный ID

Добавление уникального ID запроса к каждой записи лога помогает трассировать запросы между сервисами:

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

## Использование zerolog

[zerolog](https://github.com/rs/zerolog) — популярный JSON-логгер без аллокаций:

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

## Лучшие практики

- **Используйте JSON-формат в продакшне** — человекочитаемый формат для разработки, JSON для агрегации логов в продакшне
- **Включайте ID запросов** — передавайте заголовки `X-Request-ID` между границами сервисов для распределённой трассировки
- **Логируйте на соответствующих уровнях** — используйте `Info` для обычных запросов, `Warn` для 4xx, `Error` для 5xx
- **Избегайте логирования конфиденциальных данных** — исключайте пароли, токены и персональные данные из вывода логов
- **Установите `GIN_MODE=release`** — это отключает стандартное отладочное логирование Gin в продакшне

## Смотрите также

- [Запись логов в файл](/ru/docs/logging/write-log/)
- [Исключение строк запроса из логов](/ru/docs/logging/avoid-logging-query-strings/)
- [Пользовательский формат логов](/ru/docs/logging/custom-log-format/)
