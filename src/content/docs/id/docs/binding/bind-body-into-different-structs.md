---
title: "Coba bind body ke struct berbeda"
sidebar:
  order: 13
---

Metode binding standar seperti `c.ShouldBind` mengonsumsi `c.Request.Body`, yang merupakan `io.ReadCloser` — setelah dibaca, tidak dapat dibaca lagi. Ini berarti Anda tidak dapat memanggil `c.ShouldBind` berkali-kali pada request yang sama untuk coba membentuk struct yang berbeda.

Untuk mengatasi ini, gunakan `c.ShouldBindBodyWith`. Metode ini membaca body sekali dan menyimpannya di context, memungkinkan binding berikutnya menggunakan kembali body yang sudah dilakukan cache.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/bind", func(c *gin.Context) {
    objA := formA{}
    objB := formB{}
    // Membaca c.Request.Body dan menyimpan hasilnya ke context.
    if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formA", "foo": objA.Foo})
      return
    }
    // Saat ini, ia menggunakan kembali body yang tersimpan di context.
    if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formB", "bar": objB.Bar})
      return
    }

    c.JSON(http.StatusBadRequest, gin.H{"error": "request body did not match any known format"})
  })

  router.Run(":8080")
}
```

## Uji coba

```sh
# Body cocok dengan formA
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"foo":"hello"}'
# Output: {"foo":"hello","message":"matched formA"}

# Body cocok dengan formB
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"bar":"world"}'
# Output: {"bar":"world","message":"matched formB"}
```

:::note
`c.ShouldBindBodyWith` menyimpan body di context sebelum melakukan binding. Ini memiliki sedikit dampak pada performa, jadi gunakan hanya ketika Anda perlu melakukan bind body lebih dari sekali. Untuk format yang tidak membaca body — seperti `Query`, `Form`, `FormPost`, `FormMultipart` — Anda dapat memanggil `c.ShouldBind()` berkali-kali tanpa masalah.
:::

## Lihat juga

- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
- [Bind query string atau post data](/id/docs/binding/bind-query-or-post/)
