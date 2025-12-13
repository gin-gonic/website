---
title: Method Not Allowed FAQ
---

지원되지 않는 HTTP 메서드로 라우트에 접근하면 Gin이 404 오류를 반환합니다. 405 Method Not Allowed를 반환하도록 하려면 어떻게 해야 하나요?

Gin 라우터에서 `r.HandleMethodNotAllowed = true` 옵션을 설정하세요. 이렇게 하면 라우트는 존재하지만 요청된 HTTP 메서드를 지원하지 않을 때 Gin이 405 Method Not Allowed 응답을 반환합니다:

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

  r.Run() // 0.0.0.0:8080에서 리슨 및 서비스
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
