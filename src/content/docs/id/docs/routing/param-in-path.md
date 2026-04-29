---
title: "Parameter di path"
sidebar:
  order: 2
---

Gin mendukung dua jenis parameter path yang memungkinkan untuk menangkap nilai langsung dari URL:

- **`:name`** — mencocokkan satu segmen path. Misalnya, `/user/:name` mencocokkan `/user/john` tetapi **tidak** mencocokkan `/user/` atau `/user`.
- **`*action`** — mencocokkan semua setelah prefix, termasuk garis miring. Misalnya, `/user/:name/*action` mencocokkan `/user/john/send` dan `/user/john/`. Nilai yang ditangkap menyertakan `/` di awal.

Gunakan `c.Param("name")` untuk mengambil nilai parameter path di dalam handler.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Handler ini akan cocok dengan /user/john tetapi tidak akan cocok dengan /user/ atau /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // Namun, yang ini akan cocok dengan /user/john/ dan juga /user/john/send
  // Jika tidak ada router lain yang cocok dengan /user/john, maka akan redirect ke /user/john/
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
# Parameter tunggal -- cocok dengan :name
curl http://localhost:8080/user/john
# Output: Hello john

# Parameter wildcard -- cocok dengan :name dan *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash (garis miring di akhir) ditangkap oleh wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
Nilai wildcard `*action` selalu menyertakan `/` di awal. Pada contoh di atas, `c.Param("action")` mengembalikan `/send`, bukan `send`.
:::

:::caution
Anda tidak dapat mendefinisikan `/user/:name` dan `/user/:name/*action` jika keduanya konflik pada kedalaman path yang sama. Gin akan panic saat startup jika mendeteksi rute yang ambigu.
:::

## Lihat juga

- [Parameter query string](/id/docs/routing/querystring-param/)
- [Query dan post form](/id/docs/routing/query-and-post-form/)
