---
title: "上下文与取消"
sidebar:
  order: 11
---

每个 Gin 处理函数都接收一个 `*gin.Context`，它封装了 Go 标准的 `context.Context` 以及请求和响应辅助方法。正确理解和使用底层上下文对于构建能够正确处理超时、取消和资源清理的生产应用至关重要。

## 访问请求上下文

当前请求的标准 `context.Context` 可通过 `c.Request.Context()` 获取。这是你应该传递给任何下游调用（数据库查询、HTTP 请求或其他 I/O 操作）的上下文。

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

## 请求超时

你可以使用中间件为单个请求应用超时。当超时到期时，上下文会被取消，任何遵循上下文取消的下游调用将立即返回。

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

## 将上下文传递给数据库查询

Go 中的数据库驱动接受 `context.Context` 作为第一个参数。始终传递请求上下文，这样当客户端断开连接或请求超时时，查询会自动取消。

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

## 将上下文传递给外部 HTTP 调用

当你的处理函数调用外部服务时，传递请求上下文，以便外部调用与传入请求一起取消。

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

## 处理客户端断开连接

当客户端关闭连接时（例如导航离开或取消请求），请求上下文会被取消。你可以在长时间运行的处理函数中检测到这一点，以提前停止工作并释放资源。

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

## 最佳实践

- **始终传播请求上下文。** 将 `c.Request.Context()` 传递给每个接受 `context.Context` 的函数——数据库调用、HTTP 客户端、gRPC 调用和任何 I/O 操作。这确保取消和超时在整个调用链中传播。

- **不要将 `*gin.Context` 存储在结构体中或跨 goroutine 边界传递。** `gin.Context` 与 HTTP 请求/响应生命周期绑定，不适合并发使用。应在启动 goroutine 之前提取你需要的值（请求上下文、参数、头）。

- **在中间件级别设置超时。** 超时中间件为你提供一个单一位置来强制执行所有路由的截止时间，而不是在每个处理函数中重复超时逻辑。

- **谨慎使用 `context.WithValue`。** 在 Gin 处理函数中优先使用 `c.Set()` 和 `c.Get()`。仅在值需要通过标准库接口跨包边界时使用 `context.WithValue`。

## 常见陷阱

### 在 goroutine 中使用 `gin.Context`

`gin.Context` 出于性能考虑会在请求之间复用。如果你需要从 goroutine 中访问它，**必须**调用 `c.Copy()` 创建一个只读副本。在 goroutine 中使用原始的 `gin.Context` 会导致数据竞争和不可预测的行为。

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

### 忽略上下文取消

如果你的处理函数不检查 `ctx.Done()`，即使客户端已断开连接，它也会继续运行，浪费 CPU 和内存。始终使用上下文感知的 API（`QueryRowContext`、`NewRequestWithContext`、`select` 监听 `ctx.Done()`），以便在上下文取消后立即停止工作。

### 在上下文取消后写入响应

一旦上下文被取消，避免写入 `c.Writer`。连接可能已经关闭，写入会静默失败或 panic。如果你的处理函数执行长时间运行的工作，请在写入之前检查 `ctx.Err()`。

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
