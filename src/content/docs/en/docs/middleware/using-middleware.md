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

**Execution order:** Middleware functions execute in the order they are registered. Calling `c.Next()` executes the remaining handlers, then resumes the current middleware after `c.Next()` returns. This lets you run code both before and after downstream handlers; when middleware wrap their downstream handlers this way, their post-processing runs in reverse order (LIFO).

If a middleware returns without calling `c.Next()`, subsequent middleware and the handler still execute unless the context has been aborted. To skip pending handlers, call `c.Abort()` or an `AbortWithStatus*` method. Aborting does not stop the current middleware function, so use `return` if you also want to stop executing its remaining code.

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
