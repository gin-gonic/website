---
title: "Parameter query string"
sidebar:
  order: 3
---

Parameter query string adalah pasangan kunci-nilai yang muncul setelah `?` dalam URL (misalnya, `/search?q=gin&page=2`). Gin menyediakan dua metode untuk membacanya:

- `c.Query("key")` mengembalikan nilai parameter query, atau **string kosong** jika kunci tidak ada.
- `c.DefaultQuery("key", "default")` mengembalikan nilai, atau **nilai default** yang ditentukan jika kunci tidak ada.

Kedua metode adalah pintasan untuk mengakses `c.Request.URL.Query()` dengan boilerplate yang lebih sedikit.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Parameter query string diurai menggunakan objek permintaan yang mendasarinya.
  // Permintaan tersebut merespons url yang cocok dengan:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // pintasan untuk c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

## Uji coba

```sh
# Kedua parameter disediakan
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Parameter firstname tidak ada -- menggunakan nilai bawaan "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# Tidak ada parameter sama sekali
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## Lihat juga

- [Parameter di path](/id/docs/routing/param-in-path/)
