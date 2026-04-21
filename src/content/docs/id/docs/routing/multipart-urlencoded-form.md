---
title: "Form Multipart/Urlencoded"
sidebar:
  order: 4
---

Gunakan `c.PostForm()` dan `c.DefaultPostForm()` untuk membaca nilai dari pengiriman form. Metode ini bekerja dengan tipe konten `application/x-www-form-urlencoded` dan `multipart/form-data` -- dua cara standar browser mengirim data form.

- `c.PostForm("field")` mengembalikan nilai atau string kosong jika field tidak ada.
- `c.DefaultPostForm("field", "fallback")` mengembalikan nilai atau default yang ditentukan jika field tidak ada.

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

## Uji coba

```sh
# Form URL-encoded
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Form multipart
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Nick tidak ada -- menggunakan nilai bawaan "anonymous"
curl -X POST http://localhost:8080/form_post \
  -d "message=hello"
# Output: {"message":"hello","nick":"anonymous","status":"posted"}
```

## Lihat juga

- [Unggah file](/id/docs/routing/upload-file/)
- [Query dan post form](/id/docs/routing/query-and-post-form/)
