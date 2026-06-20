---
title: "Query dan post form"
sidebar:
  order: 5
---

Saat menangani permintaan `POST`, Anda sering perlu membaca nilai dari query string URL dan body permintaan. Gin memisahkan kedua sumber ini, sehingga Anda dapat mengakses masing-masing secara independen:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` — membaca dari query string URL.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` — membaca dari body permintaan `application/x-www-form-urlencoded` atau `multipart/form-data`.

Ini umum digunakan dalam REST API dengan rute mengidentifikasi sumber daya (melalui parameter query seperti `id`) sementara body membawa payload (seperti `name` dan `message`).

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## Uji coba

```sh
# Parameter query di URL, data form di body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Parameter page tidak ada -- menggunakan nilai bawaan "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` hanya membaca dari query string URL, dan `c.PostForm` hanya membaca dari body permintaan. Keduanya tidak akan tumpang tindih. Jika Anda ingin Gin memeriksa kedua sumber secara otomatis, gunakan `c.ShouldBind` dengan struct sebagai gantinya.
:::

## Lihat juga

- [Parameter query string](/id/docs/routing/querystring-param/)
- [Map sebagai parameter querystring atau postform](/id/docs/routing/map-as-querystring-or-postform/)
- [Form Multipart/Urlencoded](/id/docs/routing/multipart-urlencoded-form/)
