---
title: "上下文與取消"
sidebar:
  order: 11
---

每個 Gin 處理函式都會收到一個 `*gin.Context`，它包裝了 Go 的標準 `context.Context` 以及請求和回應輔助方法。了解如何正確使用底層上下文對於建構能正確處理逾時、取消和資源清理的正式環境應用程式至關重要。

## 存取請求上下文

當前請求的標準 `context.Context` 可透過 `c.Request.Context()` 取得。這是你應該傳遞給任何下游呼叫的上下文——資料庫查詢、HTTP 請求或其他 I/O 操作。

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

## 請求逾時

你可以使用中介軟體對個別請求套用逾時。當逾時到期時，上下文被取消，任何尊重上下文取消的下游呼叫都會立即返回。

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

## 將上下文傳遞給資料庫查詢

Go 中的資料庫驅動程式接受 `context.Context` 作為第一個參數。務必傳遞請求上下文，這樣當客戶端斷線或請求逾時時，查詢會自動取消。

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

## 將上下文傳遞給對外 HTTP 呼叫

當你的處理函式呼叫外部服務時，傳遞請求上下文以便對外呼叫與傳入請求一起被取消。

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

## 處理客戶端斷線

當客戶端關閉連線（例如導航離開或取消請求）時，請求上下文會被取消。你可以在長時間執行的處理函式中偵測此情況，以提前停止工作並釋放資源。

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

## 最佳實務

- **務必傳播請求上下文。** 將 `c.Request.Context()` 傳遞給每個接受 `context.Context` 的函式——資料庫呼叫、HTTP 客戶端、gRPC 呼叫和任何 I/O 操作。這確保取消和逾時在整個呼叫鏈中傳播。

- **不要將 `*gin.Context` 儲存在結構體中或跨 goroutine 邊界傳遞。** `gin.Context` 與 HTTP 請求/回應生命週期綁定，不適合並發使用。在啟動 goroutine 之前，先提取你需要的值（請求上下文、參數、標頭）。

- **在中介軟體層級設定逾時。** 逾時中介軟體讓你有一個統一的地方來對所有路由強制執行截止時間，而不是在每個處理函式中重複逾時邏輯。

- **謹慎使用 `context.WithValue`。** 在 Gin 處理函式中優先使用 `c.Set()` 和 `c.Get()`。將 `context.WithValue` 保留給需要透過標準函式庫介面跨套件邊界傳遞的值。

## 常見陷阱

### 在 goroutine 中使用 `gin.Context`

`gin.Context` 會跨請求重複使用以提高效能。如果你需要從 goroutine 存取它，你**必須**呼叫 `c.Copy()` 建立一個唯讀副本。在 goroutine 中使用原始的 `gin.Context` 會導致資料競態和不可預測的行為。

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

如果你的處理函式不檢查 `ctx.Done()`，即使客戶端已斷線，它仍會繼續執行，浪費 CPU 和記憶體。務必使用上下文感知的 API（`QueryRowContext`、`NewRequestWithContext`、在 `ctx.Done()` 上 `select`），這樣當上下文被取消時工作會立即停止。

### 在上下文取消後寫入回應

一旦上下文被取消，避免寫入 `c.Writer`。連線可能已經關閉，寫入將無聲失敗或引發 panic。如果你的處理函式執行長時間工作，在寫入前先檢查 `ctx.Err()`。

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
