---
title: Method Not Allowed FAQ
---

Desteklenmeyen bir HTTP yöntemiyle bir rotaya eriştiğimde Gin 404 hatası döndürür. 405 Method Not Allowed döndürmesini nasıl sağlayabilirim?

Gin router'ınızda `r.HandleMethodNotAllowed = true` seçeneğini yapılandırın. Bu, bir rota mevcut olduğunda ancak istenen HTTP yöntemini desteklemediğinde Gin'in 405 Method Not Allowed yanıtı döndürmesini sağlayacaktır:

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

  r.Run() // 0.0.0.0:8080'de dinle ve sun
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
