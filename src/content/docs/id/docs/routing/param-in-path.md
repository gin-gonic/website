---
title: "Parameter di path"
sidebar:
  order: 2
---

Gin mendukung dua jenis parameter path yang memungkinkan Anda menangkap nilai langsung dari URL:

- **`:name`** — mencocokkan satu segmen path. Misalnya, `/user/:name` mencocokkan `/user/john` tetapi **tidak** mencocokkan `/user/` atau `/user`.
- **`*action`** — mencocokkan semua setelah prefix, termasuk garis miring. Misalnya, `/user/:name/*action` mencocokkan `/user/john/send` dan `/user/john/`. Nilai yang ditangkap menyertakan `/` di awal.

Gunakan `c.Param("name")` untuk mengambil nilai parameter path di dalam handler Anda.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## Uji coba

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
Nilai wildcard `*action` selalu menyertakan `/` di awal. Pada contoh di atas, `c.Param("action")` mengembalikan `/send`, bukan `send`.
:::

:::caution
Anda tidak dapat mendefinisikan `/user/:name` dan `/user/:name/*action` jika keduanya berkonflik pada kedalaman path yang sama. Gin akan panic saat startup jika mendeteksi rute yang ambigu.
:::

## Lihat juga

- [Parameter query string](/id/docs/routing/querystring-param/)
- [Query dan post form](/id/docs/routing/query-and-post-form/)
