---
title: "구조화된 로깅"
sidebar:
  order: 7
---

구조화된 로깅은 일반 텍스트 대신 머신이 읽을 수 있는 로그 출력(일반적으로 JSON)을 생성합니다. 이를 통해 ELK Stack, Datadog 또는 Grafana Loki와 같은 로그 집계 시스템에서 로그를 더 쉽게 검색, 필터링, 분석할 수 있습니다.

## 구조화된 로깅을 사용하는 이유

Gin의 기본 로거는 사람이 읽을 수 있는 텍스트를 출력하여 개발에는 좋지만 대규모에서 파싱하기 어렵습니다. 구조화된 로깅은 다음을 제공합니다:

- **쿼리 가능한 필드** -- 상태 코드, 지연 시간 또는 사용자 ID로 로그 필터링
- **일관된 형식** -- 모든 로그 항목이 동일한 형태를 가짐
- **상관 관계** -- 요청 ID를 사용하여 서비스 간 요청 추적

## slog 사용하기 (Go 1.21+)

Go의 표준 라이브러리에는 구조화된 로깅을 위한 `log/slog`가 포함되어 있습니다. Gin에서 사용하는 방법은 다음과 같습니다:

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

다음과 같은 로그 항목을 생성합니다:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## 요청 ID / 상관 관계 ID

모든 로그 항목에 고유한 요청 ID를 추가하면 서비스 간 요청을 추적하는 데 도움이 됩니다:

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

## zerolog 사용하기

[zerolog](https://github.com/rs/zerolog)는 인기 있는 제로 할당 JSON 로거입니다:

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

  // 개발용 가독성 좋은 로깅
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

## 모범 사례

- **프로덕션에서 JSON 형식 사용** -- 개발에는 사람이 읽을 수 있는 형식, 프로덕션 로그 집계에는 JSON
- **요청 ID 포함** -- 분산 트레이싱을 위해 서비스 경계를 넘어 `X-Request-ID` 헤더를 전파
- **적절한 수준에서 로깅** -- 정상 요청에는 `Info`, 4xx에는 `Warn`, 5xx에는 `Error` 사용
- **민감한 데이터 로깅 방지** -- 로그 출력에서 비밀번호, 토큰, PII를 제외
- **`GIN_MODE=release` 설정** -- 프로덕션에서 Gin의 기본 디버그 로깅을 비활성화

## 참고

- [로그 파일 작성 방법](/ko-kr/docs/logging/write-log/)
- [쿼리 문자열 로깅 방지](/ko-kr/docs/logging/avoid-logging-query-strings/)
- [커스텀 로그 형식](/ko-kr/docs/logging/custom-log-format/)
