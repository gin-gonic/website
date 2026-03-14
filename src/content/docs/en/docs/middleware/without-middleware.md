---
title: "Without middleware by default"
sidebar:
  order: 1
---

Gin offers two ways to create a router engine, and the difference comes down to which middleware is attached by default.

### `gin.Default()` -- with Logger and Recovery

`gin.Default()` creates a router with two middleware already attached:

- **Logger** -- Writes request logs to stdout (method, path, status code, latency).
- **Recovery** -- Recovers from any panics in handlers and returns a 500 response, preventing your server from crashing.

This is the most common choice for getting started quickly.

### `gin.New()` -- a blank engine

`gin.New()` creates a completely bare router with **no middleware** attached. This is useful when you want full control over which middleware runs, for example:

- You want to use a structured logger (such as `slog` or `zerolog`) instead of the default text logger.
- You want to customize panic recovery behavior.
- You are building a microservice where you need a minimal or specialized middleware stack.

### Example

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a blank engine with no middleware.
  r := gin.New()

  // Attach only the middleware you need.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

In the example above, the Recovery middleware is included to prevent crashes, but the default Logger middleware is omitted. You could replace it with your own logging middleware or leave it out entirely.
