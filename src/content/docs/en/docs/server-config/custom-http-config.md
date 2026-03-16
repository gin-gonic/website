---
title: "Custom HTTP configuration"
sidebar:
  order: 1
---

By default, `router.Run()` starts a basic HTTP server. For production use, you may need to customize timeouts, header limits, or TLS settings. You can do this by creating your own `http.Server` and passing the Gin router as the `Handler`.

## Basic usage

Pass the Gin router directly to `http.ListenAndServe`:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## With custom server settings

Create an `http.Server` struct to configure read/write timeouts and other options:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## Test it

```sh
curl http://localhost:8080/ping
# Output: pong
```

## See also

- [Graceful restart or stop](/en/docs/server-config/graceful-restart-or-stop/)
- [Run multiple service](/en/docs/server-config/run-multiple-service/)
