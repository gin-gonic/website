---
title: "自訂 Recovery 行為"
sidebar:
  order: 4
---

Gin 內建的 `gin.Recovery()` 中介軟體會捕捉處理請求時發生的任何 panic，寫入 `500` 回應，並讓伺服器持續運行。當你需要控制 recovery 時的行為時——例如將 panic 回報給使用者、儲存到資料庫，或傳送到錯誤追蹤服務——請改用 `gin.CustomRecovery()`。

`gin.CustomRecovery()` 接收一個簽章為 `func(c *gin.Context, recovered any)` 的處理函式。`recovered` 值就是傳遞給 `panic()` 的內容。在處理函式內，你決定如何回應，然後呼叫 `c.AbortWithStatus()`（或其他 abort 方法）以略過剩餘的處理函式。

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

## 測試

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## 另請參閱

- [自訂中介軟體](/zh-tw/docs/middleware/custom-middleware/)
- [預設不含任何中介軟體的純 Gin](/zh-tw/docs/middleware/without-middleware/)
- [錯誤處理中介軟體](/zh-tw/docs/middleware/error-handling-middleware/)
