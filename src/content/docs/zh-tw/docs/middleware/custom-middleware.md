---
title: "自訂中介軟體"
sidebar:
  order: 3
---

Gin 中介軟體是一個回傳 `gin.HandlerFunc` 的函式。中介軟體在主要處理函式之前和/或之後執行，適用於日誌記錄、身份驗證、錯誤處理和其他橫切關注點。

### 中介軟體執行流程

中介軟體函式有兩個階段，由 `c.Next()` 的呼叫分隔：

- **`c.Next()` 之前** -- 此處的程式碼在請求到達主要處理函式之前執行。用於設定任務，如記錄開始時間、驗證令牌或使用 `c.Set()` 設定上下文值。
- **`c.Next()`** -- 呼叫鏈中的下一個處理函式（可能是另一個中介軟體或最終的路由處理函式）。執行在此暫停，直到所有下游處理函式完成。
- **`c.Next()` 之後** -- 此處的程式碼在主要處理函式完成後執行。用於清理、記錄回應狀態或測量延遲時間。

如果你想完全停止鏈（例如，當身份驗證失敗時），請呼叫 `c.Abort()` 而不是 `c.Next()`。這會防止任何剩餘的處理函式執行。你可以將其與回應結合使用，例如 `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`。

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

### 測試

```bash
curl http://localhost:8080/test
```

伺服器日誌將顯示通過 `Logger` 中介軟體的每個請求的延遲時間和 HTTP 狀態碼。

## 另請參閱

- [錯誤處理中介軟體](/zh-tw/docs/middleware/error-handling-middleware/)
- [使用中介軟體](/zh-tw/docs/middleware/using-middleware/)
