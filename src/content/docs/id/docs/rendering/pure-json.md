---
title: "PureJSON"
sidebar:
  order: 5
---

Normalnya, `json.Marshal` Go mengganti karakter HTML khusus dengan escape sequence unicode untuk keamanan — misalnya, `<` menjadi `\u003c`. Ini tidak masalah ketika menyematkan JSON di HTML, tetapi jika Anda membangun API murni, klien mungkin mengharapkan karakter literal.

`c.PureJSON` menggunakan `json.Encoder` dengan `SetEscapeHTML(false)`, sehingga karakter HTML seperti `<`, `>`, dan `&` ditampilkan secara literal alih-alih di-escape.

Gunakan `PureJSON` ketika konsumen API Anda mengharapkan JSON mentah tanpa escape. Gunakan `JSON` standar ketika respons mungkin disematkan di halaman HTML.

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

## Uji coba

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin juga menyediakan `c.AbortWithStatusPureJSON` (v1.11+) untuk mengembalikan JSON tanpa escape sambil membatalkan rantai middleware — berguna di middleware autentikasi atau validasi.
:::

## Lihat juga

- [AsciiJSON](/id/docs/rendering/ascii-json/)
- [SecureJSON](/id/docs/rendering/secure-json/)
- [Rendering](/id/docs/rendering/rendering/)
