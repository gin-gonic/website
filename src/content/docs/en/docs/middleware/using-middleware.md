---
title: "Using middleware"
sidebar:
  order: 2
---

Middleware in Gin are functions that run before (and optionally after) your route handler. They are used for cross-cutting concerns such as logging, authentication, error recovery, and request modification.

Gin supports three levels of middleware attachment:

- **Global middleware** — Applied to every route in the router. Registered with `router.Use()`. Good for concerns like logging and panic recovery that apply universally.
- **Group middleware** — Applied to all routes within a route group. Registered with `group.Use()`. Useful for applying authentication or authorization to a subset of routes (e.g., all `/admin/*` routes).
- **Per-route middleware** — Applied to a single route only. Passed as additional arguments to `router.GET()`, `router.POST()`, etc. Useful for route-specific logic such as custom rate limiting or input validation.

**Execution order:** Middleware functions execute in the order they are registered. When a middleware calls `c.Next()`, it passes control to the next middleware (or the final handler), and then resumes execution after `c.Next()` returns. This creates a stack-like (LIFO) pattern — the first middleware registered is the first to start but the last to finish. If a middleware does not call `c.Next()`, subsequent middleware and the handler are skipped (useful for short-circuiting with `c.Abort()`).

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` is a convenience function that creates a router with `Logger` and `Recovery` middleware already attached. If you want a bare router with no middleware, use `gin.New()` as shown above and add only the middleware you need.
:::
