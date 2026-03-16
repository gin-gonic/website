---
title: "Пропуск логирования"
sidebar:
  order: 3
---

Вы можете пропустить логирование для определённых путей или на основе пользовательской логики с помощью `LoggerConfig`.

- `SkipPaths` исключает определённые маршруты из логирования — полезно для проверок состояния или эндпоинтов метрик, которые создают шум.
- `Skip` — это функция, которая получает `*gin.Context` и возвращает `true` для пропуска логирования — полезно для условной логики, например пропуска успешных ответов.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.New()

  // skip logging for desired paths by setting SkipPaths in LoggerConfig
  loggerConfig := gin.LoggerConfig{SkipPaths: []string{"/metrics"}}

  // skip logging based on your logic by setting Skip func in LoggerConfig
  loggerConfig.Skip = func(c *gin.Context) bool {
    // as an example skip non server side errors
    return c.Writer.Status() < http.StatusInternalServerError
  }

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  // skipped -- path is in SkipPaths
  router.GET("/metrics", func(c *gin.Context) {
    c.Status(http.StatusNotImplemented)
  })

  // skipped -- status < 500
  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  // not skipped -- status is 501 (>= 500)
  router.GET("/data", func(c *gin.Context) {
    c.Status(http.StatusNotImplemented)
  })

  router.Run(":8080")
}
```

## Тестирование

```sh
# This request is logged (status 501 >= 500)
curl http://localhost:8080/data

# This request is NOT logged (path in SkipPaths)
curl http://localhost:8080/metrics

# This request is NOT logged (status 200 < 500)
curl http://localhost:8080/ping
# Output: pong
```

## Смотрите также

- [Пользовательский формат логов](/ru/docs/logging/custom-log-format/)
- [Запись логов](/ru/docs/logging/write-log/)
