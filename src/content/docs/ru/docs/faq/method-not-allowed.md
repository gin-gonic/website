---
title: FAQ Method Not Allowed
---

Gin возвращает ошибку 404, когда я обращаюсь к маршруту с неподдерживаемым HTTP методом. Как сделать так, чтобы он возвращал 405 Method Not Allowed?

Настройте следующую опцию в вашем Gin роутере `r.HandleMethodNotAllowed = true`. Это заставит Gin возвращать ответ 405 Method Not Allowed, когда маршрут существует, но не поддерживает запрошенный HTTP метод:

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

  r.Run() // прослушивание и обслуживание на 0.0.0.0:8080
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
