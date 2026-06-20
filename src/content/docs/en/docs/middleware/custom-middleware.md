---
title: "Custom Middleware"
sidebar:
  order: 3
---

Gin middleware is a function that returns a `gin.HandlerFunc`. Middleware runs before and/or after the main handler, which makes it useful for logging, authentication, error handling, and other cross-cutting concerns.

### Middleware execution flow

A middleware function has two phases, divided by the call to `c.Next()`:

- **Before `c.Next()`** -- Code here runs before the request reaches the main handler. Use this phase for setup tasks such as recording the start time, validating tokens, or setting context values with `c.Set()`.
- **`c.Next()`** -- This calls the next handler in the chain (which may be another middleware or the final route handler). Execution pauses here until all downstream handlers have completed.
- **After `c.Next()`** -- Code here runs after the main handler has finished. Use this phase for cleanup, logging response status, or measuring latency.

If you want to stop the chain entirely (for example, when authentication fails), call `c.Abort()` instead of `c.Next()`. This prevents any remaining handlers from executing. You can combine it with a response, for example `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### Try it

```bash
curl http://localhost:8080/test
```

The server logs will show the request latency and HTTP status code for every request that passes through the `Logger` middleware.

## See also

- [Error handling middleware](/en/docs/middleware/error-handling-middleware/)
- [Using middleware](/en/docs/middleware/using-middleware/)

