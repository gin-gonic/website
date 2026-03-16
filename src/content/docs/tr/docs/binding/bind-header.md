---
title: "Başlık bağlama"
sidebar:
  order: 9
---

`ShouldBindHeader`, `header` struct etiketlerini kullanarak HTTP istek başlıklarını doğrudan bir struct'a bağlar. Bu, gelen isteklerden API hız limitleri, kimlik doğrulama token'ları veya özel alan başlıkları gibi meta verileri çıkarmak için kullanışlıdır.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## Test et

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
Başlık adları HTTP spesifikasyonuna göre büyük/küçük harf duyarsızdır. `header` struct etiket değeri büyük/küçük harf duyarsız olarak eşleştirilir, bu nedenle `header:"Rate"` etiketi `Rate`, `rate` veya `RATE` olarak gönderilen başlıklarla eşleşir.
:::

:::tip
Zorunlu başlıkları eksik olan istekleri reddetmek için `header` etiketlerini `binding:"required"` ile birleştirebilirsiniz:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## Ayrıca bakınız

- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
- [Sorgu dizesi veya post verisi bağlama](/tr/docs/binding/bind-query-or-post/)
