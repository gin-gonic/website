---
title: "PureJSON"
sidebar:
  order: 5
---

Normalde, Go'nun `json.Marshal` fonksiyonu güvenlik amacıyla özel HTML karakterlerini unicode kaçış dizileriyle değiştirir — örneğin, `<` `\u003c` olur. Bu, JSON'u HTML'e gömerken sorun olmaz, ancak saf bir API oluşturuyorsanız istemciler gerçek karakterleri bekleyebilir.

`c.PureJSON`, `SetEscapeHTML(false)` ile `json.Encoder` kullanır, böylece `<`, `>` ve `&` gibi HTML karakterleri kaçırılmak yerine olduğu gibi render edilir.

API tüketicileriniz ham, kaçırılmamış JSON beklediğinde `PureJSON` kullanın. Yanıt bir HTML sayfasına gömülebilecekse standart `JSON` kullanın.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Standard JSON -- escapes HTML characters
  router.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON -- serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  router.Run(":8080")
}
```

## Test et

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin ayrıca ara katman zincirini iptal ederken kaçırılmamış JSON döndürmek için `c.AbortWithStatusPureJSON` (v1.11+) sağlar — kimlik doğrulama veya doğrulama ara katmanlarında kullanışlıdır.
:::

## Ayrıca bakınız

- [AsciiJSON](/tr/docs/rendering/ascii-json/)
- [SecureJSON](/tr/docs/rendering/secure-json/)
- [Render](/tr/docs/rendering/rendering/)
