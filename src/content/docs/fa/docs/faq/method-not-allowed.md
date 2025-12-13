---
title: سوالات متداول Method Not Allowed
---

Gin هنگام دسترسی به یک مسیر با متد HTTP پشتیبانی نشده خطای 404 برمی‌گرداند. چگونه می‌توانم آن را وادار کنم که به جای آن 405 Method Not Allowed برگرداند؟

گزینه زیر را در روتر Gin خود پیکربندی کنید `r.HandleMethodNotAllowed = true`. این باعث می‌شود Gin هنگامی که مسیر وجود دارد اما متد HTTP درخواستی را پشتیبانی نمی‌کند، پاسخ 405 Method Not Allowed برگرداند:

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

  r.Run() // گوش دادن و سرویس‌دهی روی 0.0.0.0:8080
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
