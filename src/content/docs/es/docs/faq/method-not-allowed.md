---
title: FAQ de Method Not Allowed
---

Gin devuelve error 404 cuando accedo a una ruta con un método HTTP no soportado. ¿Cómo puedo hacer que devuelva 405 Method Not Allowed?

Configura la siguiente opción en tu router de Gin `r.HandleMethodNotAllowed = true`. Esto hará que Gin devuelva una respuesta 405 Method Not Allowed cuando una ruta existe pero no soporta el método HTTP solicitado:

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

  r.Run() // escuchar y servir en 0.0.0.0:8080
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
