---
title: Method Not Allowed FAQ
---

サポートされていない HTTP メソッドでルートにアクセスすると、Gin は 404 エラーを返します。405 Method Not Allowed を返すようにするにはどうすればよいですか？

Gin ルーターで `r.HandleMethodNotAllowed = true` オプションを設定します。これにより、ルートは存在するが、リクエストされた HTTP メソッドをサポートしていない場合に、Gin は 405 Method Not Allowed レスポンスを返します：

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

  r.Run() // 0.0.0.0:8080 でリッスンして提供
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
