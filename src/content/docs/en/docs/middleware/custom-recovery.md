---
title: "Custom Recovery behavior"
sidebar:
  order: 4
---

Gin's built-in `gin.Recovery()` middleware catches any panic that happens while handling a request, writes a `500` response, and keeps the server running. When you need to control what happens on recovery -- for example to report the panic to the user, save it to a database, or send it to an error-tracking service -- use `gin.CustomRecovery()` instead.

`gin.CustomRecovery()` takes a handler with the signature `func(c *gin.Context, recovered any)`. The `recovered` value is whatever was passed to `panic()`. Inside the handler you decide how to respond, then call `c.AbortWithStatus()` (or another abort method) so the remaining handlers are skipped.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  r := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // panic with a string -- the custom middleware could save this to a database or report it to the user
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

## Try it

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## See also

- [Custom Middleware](/en/docs/middleware/custom-middleware/)
- [Blank Gin without middleware by default](/en/docs/middleware/without-middleware/)
- [Error handling middleware](/en/docs/middleware/error-handling-middleware/)
