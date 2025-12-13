---
title: FAQ de Method Not Allowed
---

O Gin retorna erro 404 quando acesso uma rota com um método HTTP não suportado. Como posso fazer para retornar 405 Method Not Allowed?

Configure a seguinte opção no seu router Gin `r.HandleMethodNotAllowed = true`. Isso fará com que o Gin retorne uma resposta 405 Method Not Allowed quando uma rota existe mas não suporta o método HTTP solicitado:

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

  r.Run() // escutar e servir em 0.0.0.0:8080
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
