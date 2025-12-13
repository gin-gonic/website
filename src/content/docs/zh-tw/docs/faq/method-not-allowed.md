---
title: Method Not Allowed 常見問題
---

當我使用不支援的 HTTP 方法存取路由時，Gin 回傳 404 錯誤。如何讓它回傳 405 Method Not Allowed？

在你的 Gin 路由器中設定以下選項 `r.HandleMethodNotAllowed = true`。這會讓 Gin 在路由存在但不支援請求的 HTTP 方法時回傳 405 Method Not Allowed 回應：

```go
package main
import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.HandleMethodNotAllowed = true

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // 監聽並在 0.0.0.0:8080 上服務
}
```

```json
$ curl -X POST localhost:8000/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
Content-Type: text/plain
Date: Sat, 01 Nov 2025 14:49:36 GMT
Content-Length: 22

405 method not allowed
```
