---
title: "Binding Multipart/Urlencoded"
sidebar:
  order: 11
---

`ShouldBind` secara otomatis mendeteksi `Content-Type` dan melakukan bind body permintaan `multipart/form-data` atau `application/x-www-form-urlencoded` ke struct. Gunakan tag struct `form` untuk memetakan nama field form ke field struct, dan `binding:"required"` untuk mewajibkan field tertentu.

Ini biasa digunakan untuk form login, halaman registrasi, atau pengiriman form HTML apa pun.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind secara otomatis memilih binding yang tepat berdasarkan Content-Type
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if form.User == "user" && form.Password == "password" {
      c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
    }
  })

  router.Run(":8080")
}
```

## Uji coba

```sh
# Form multipart
curl -X POST http://localhost:8080/login \
  -F "user=user" -F "password=password"
# Output: {"status":"you are logged in"}

# Form URL-encoded
curl -X POST http://localhost:8080/login \
  -d "user=user&password=password"
# Output: {"status":"you are logged in"}

# Kredensial salah
curl -X POST http://localhost:8080/login \
  -d "user=wrong&password=wrong"
# Output: {"status":"unauthorized"}

# Nilai field wajib tidak ada
curl -X POST http://localhost:8080/login \
  -d "user=user"
# Output: {"error":"Key: 'LoginForm.Password' Error:Field validation for 'Password' failed on the 'required' tag"}
```

## Lihat juga

- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
- [Bind checkbox HTML](/id/docs/binding/bind-html-checkbox/)
