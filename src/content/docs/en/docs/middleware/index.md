---
title: "Middleware"
sidebar:
  order: 6
---

Middleware in Gin provides a way to process HTTP requests before they reach route handlers. A middleware function has the same signature as a route handler -- `gin.HandlerFunc` -- and typically calls `c.Next()` to pass control to the next handler in the chain.

## How middleware works

Gin uses an **onion model** for middleware execution. Each middleware runs in two phases:

1. **Pre-handler** -- code before `c.Next()` runs before the route handler.
2. **Post-handler** -- code after `c.Next()` runs after the route handler returns.

This means middleware wraps around the handler like layers of an onion. The first middleware attached is the outermost layer.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## Attaching middleware

There are three ways to attach middleware in Gin:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

Middleware attached at a broader scope runs first. In the example above, a request to `GET /v1/users` would execute `Logger` then `Recovery` then `AuthRequired` then `listUsers`.

## In this section

- [**Using middleware**](./using-middleware/) -- Attach middleware globally, to groups, or individual routes
- [**Custom middleware**](./custom-middleware/) -- Write your own middleware functions
- [**Using BasicAuth middleware**](./using-basicauth/) -- HTTP Basic Authentication
- [**Goroutines inside middleware**](./goroutines-inside-middleware/) -- Safely run background tasks from middleware
- [**Custom HTTP configuration**](./custom-http-config/) -- Error handling and recovery in middleware
- [**Security headers**](./security-headers/) -- Set common security headers
