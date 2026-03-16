---
title: "錯誤處理中介軟體"
sidebar:
  order: 4
---

在典型的 RESTful 應用程式中，你可能會在任何路由中遇到錯誤——無效輸入、資料庫故障、未授權的存取或內部錯誤。在每個處理器中個別處理錯誤會導致重複的程式碼和不一致的回應。

集中式的錯誤處理中介軟體透過在每個請求之後執行並檢查透過 `c.Error(err)` 添加到 Gin 上下文中的任何錯誤來解決這個問題。如果發現錯誤，它會傳送一個帶有適當狀態碼的結構化 JSON 回應。

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## 測試

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
你可以擴展此模式，將特定錯誤類型對應到不同的 HTTP 狀態碼，或在回應之前將錯誤記錄到外部服務。
:::

## 另請參閱

- [自訂中介軟體](/zh-tw/docs/middleware/custom-middleware/)
- [使用中介軟體](/zh-tw/docs/middleware/using-middleware/)
