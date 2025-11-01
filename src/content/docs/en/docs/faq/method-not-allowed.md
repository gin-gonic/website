---
title: Method Not Allowed FAQ
---

Gin returns error 404 when I access a route with an unsupported HTTP method. How can I make it return 405 Method Not Allowed instead?

Configure the following option in your Gin router `r.HandleMethodNotAllowed = true`. This will make Gin return a 405 Method Not Allowed response when a route exists but does not support the requested HTTP method.:

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

  r.Run() // listen and serve on 0.0.0.0:8080
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
