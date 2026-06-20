---
title: "Multipart/Urlencoded form"
sidebar:
  order: 4
---

Form gönderimlerinden değerleri okumak için `c.PostForm()` ve `c.DefaultPostForm()` kullanın. Bu metodlar hem `application/x-www-form-urlencoded` hem de `multipart/form-data` içerik türleriyle çalışır -- tarayıcıların form verisi göndermesinin iki standart yolu.

- `c.PostForm("field")` değeri döndürür veya alan eksikse boş bir dize döndürür.
- `c.DefaultPostForm("field", "fallback")` değeri döndürür veya alan eksikse belirtilen varsayılan değeri döndürür.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/form_post", func(c *gin.Context) {
    message := c.PostForm("message")
    nick := c.DefaultPostForm("nick", "anonymous")

    c.JSON(200, gin.H{
      "status":  "posted",
      "message": message,
      "nick":    nick,
    })
  })
  router.Run(":8080")
}
```

## Test et

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Missing nick -- falls back to default "anonymous"
curl -X POST http://localhost:8080/form_post \
  -d "message=hello"
# Output: {"message":"hello","nick":"anonymous","status":"posted"}
```

## Ayrıca bakınız

- [Dosya yükleme](/tr/docs/routing/upload-file/)
- [Sorgu ve post formu](/tr/docs/routing/query-and-post-form/)
