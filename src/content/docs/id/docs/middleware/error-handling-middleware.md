---
title: "Middleware penanganan error"
sidebar:
  order: 4
---

Dalam aplikasi RESTful tipikal, Anda mungkin menemui error di rute mana pun — input tidak valid, kegagalan database, akses tidak sah, atau bug internal. Menangani error secara individual di setiap handler menyebabkan kode berulang dan respons yang tidak konsisten.

Middleware penanganan error terpusat mengatasi ini dengan berjalan setelah setiap request dan memeriksa error yang ditambahkan ke context Gin melalui `c.Error(err)`. Jika ditemukan error, middleware mengirim respons JSON terstruktur dengan kode status yang tepat.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## Uji coba

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
Anda dapat memperluas pola ini untuk memetakan tipe error tertentu ke kode status HTTP yang berbeda, atau untuk mencatat error ke layanan eksternal sebelum merespons.
:::

## Lihat juga

- [Middleware kustom](/id/docs/middleware/custom-middleware/)
- [Menggunakan middleware](/id/docs/middleware/using-middleware/)
