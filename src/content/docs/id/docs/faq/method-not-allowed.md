---
title: FAQ Method Not Allowed
---

Gin mengembalikan error 404 ketika saya mengakses route dengan metode HTTP yang tidak didukung. Bagaimana cara membuatnya mengembalikan 405 Method Not Allowed?

Konfigurasi opsi berikut di router Gin Anda `r.HandleMethodNotAllowed = true`. Ini akan membuat Gin mengembalikan respons 405 Method Not Allowed ketika route ada tetapi tidak mendukung metode HTTP yang diminta:

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

  r.Run() // listen dan serve di 0.0.0.0:8080
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
