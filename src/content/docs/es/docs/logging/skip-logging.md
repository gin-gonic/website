---
title: "Omitir logging"
sidebar:
  order: 3
---

Puedes omitir el logging para rutas específicas o basándote en lógica personalizada usando `LoggerConfig`.

- `SkipPaths` excluye rutas específicas del logging — útil para verificaciones de salud o endpoints de métricas que generan ruido.
- `Skip` es una función que recibe el `*gin.Context` y devuelve `true` para omitir el logging — útil para lógica condicional como omitir respuestas exitosas.

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

## Pruébalo

```sh
# This request is logged (status 501 >= 500)
curl http://localhost:8080/data

# This request is NOT logged (path in SkipPaths)
curl http://localhost:8080/metrics

# This request is NOT logged (status 200 < 500)
curl http://localhost:8080/ping
# Output: pong
```

## Ver también

- [Formato de log personalizado](/es/docs/logging/custom-log-format/)
- [Escribir log](/es/docs/logging/write-log/)
