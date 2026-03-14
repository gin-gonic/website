---
title: "Context and Cancellation"
sidebar:
  order: 11
---

Every Gin handler receives a `*gin.Context`, which wraps Go's standard `context.Context` along with request and response helpers. Understanding how to use the underlying context correctly is essential for building production applications that handle timeouts, cancellation, and resource cleanup properly.

## Accessing the request context

The standard `context.Context` for the current request is available through `c.Request.Context()`. This is the context you should pass to any downstream call -- database queries, HTTP requests, or other I/O operations.

```go
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/data", func(c *gin.Context) {
		ctx := c.Request.Context()

		// Pass ctx to any downstream function that accepts context.Context.
		log.Println("request context deadline:", ctx.Done())

		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.Run(":8080")
}
```

## Request timeouts

You can apply a timeout to individual requests using a middleware. When the timeout expires, the context is cancelled and any downstream call that respects context cancellation will return immediately.

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// TimeoutMiddleware wraps each request with a context deadline.
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		// Replace the request with one that carries the new context.
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(TimeoutMiddleware(5 * time.Second))

	r.GET("/api/slow", func(c *gin.Context) {
		ctx := c.Request.Context()

		// Simulate work that respects the context deadline.
		select {
		case <-time.After(10 * time.Second):
			c.JSON(http.StatusOK, gin.H{"result": "done"})
		case <-ctx.Done():
			c.JSON(http.StatusGatewayTimeout, gin.H{
				"error": "request timed out",
			})
		}
	})

	r.Run(":8080")
}
```

## Passing context to database queries

Database drivers in Go accept a `context.Context` as the first argument. Always pass the request context so that queries are automatically cancelled if the client disconnects or the request times out.

```go
package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgres://localhost/mydb?sslmode=disable")
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.GET("/api/users/:id", func(c *gin.Context) {
		ctx := c.Request.Context()
		id := c.Param("id")

		var name string
		err := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", id).Scan(&name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"id": id, "name": name})
	})

	r.Run(":8080")
}
```

## Passing context to outbound HTTP calls

When your handler calls external services, pass the request context so that outbound calls are cancelled together with the incoming request.

```go
package main

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/proxy", func(c *gin.Context) {
		ctx := c.Request.Context()

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://httpbin.org/delay/3", nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)
		c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
	})

	r.Run(":8080")
}
```

## Handling client disconnection

When a client closes the connection (e.g., navigates away or cancels a request), the request context is cancelled. You can detect this in long-running handlers to stop work early and free resources.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/stream", func(c *gin.Context) {
		ctx := c.Request.Context()

		for i := 0; ; i++ {
			select {
			case <-ctx.Done():
				log.Println("client disconnected, stopping work")
				return
			case <-time.After(1 * time.Second):
				c.SSEvent("message", gin.H{"count": i})
				c.Writer.Flush()
			}
		}
	})

	r.Run(":8080")
}
```

## Best practices

- **Always propagate the request context.** Pass `c.Request.Context()` to every function that accepts a `context.Context` -- database calls, HTTP clients, gRPC calls, and any I/O operation. This ensures cancellation and timeouts propagate through the entire call chain.

- **Do not store `*gin.Context` in structs or pass it across goroutine boundaries.** `gin.Context` is tied to the HTTP request/response lifecycle and is not safe for concurrent use. Instead, extract the values you need (request context, parameters, headers) before spawning goroutines.

- **Set timeouts at the middleware level.** A timeout middleware gives you a single place to enforce deadlines across all routes, rather than duplicating timeout logic in every handler.

- **Use `context.WithValue` sparingly.** Prefer `c.Set()` and `c.Get()` within Gin handlers. Reserve `context.WithValue` for values that need to cross package boundaries through standard library interfaces.

## Common pitfalls

### Using `gin.Context` in goroutines

`gin.Context` is reused across requests for performance. If you need to access it from a goroutine, you **must** call `c.Copy()` to create a read-only copy. Using the original `gin.Context` in a goroutine leads to data races and unpredictable behaviour.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/async", func(c *gin.Context) {
		// WRONG: using c directly in a goroutine.
		// go func() {
		//     log.Println(c.Request.URL.Path) // data race!
		// }()

		// CORRECT: copy the context first.
		cCopy := c.Copy()
		go func() {
			time.Sleep(2 * time.Second)
			log.Printf("async work done for %s\n", cCopy.Request.URL.Path)
		}()

		c.JSON(http.StatusOK, gin.H{"status": "processing"})
	})

	r.Run(":8080")
}
```

### Ignoring context cancellation

If your handler does not check `ctx.Done()`, it will keep running even after the client has disconnected, wasting CPU and memory. Always use context-aware APIs (`QueryRowContext`, `NewRequestWithContext`, `select` on `ctx.Done()`) so work stops as soon as the context is cancelled.

### Writing the response after context cancellation

Once a context is cancelled, avoid writing to `c.Writer`. The connection may already be closed, and writes will fail silently or panic. Check `ctx.Err()` before writing if your handler performs long-running work.

```go
func handler(c *gin.Context) {
	ctx := c.Request.Context()

	result, err := doExpensiveWork(ctx)
	if err != nil {
		if ctx.Err() != nil {
			// Client is gone; do not write a response.
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}
```
