---
title: "Multipart/Urlencoded binding"
---

```go
package main

import (
  "github.com/gin-gonic/gin"
)

type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()
  router.POST("/login", func(c *gin.Context) {
    // Anda dapat melakukan bind multipart form dengan deklarasi binding eksplisit:
    // c.ShouldBindWith(&form, binding.Form)
    // atau Anda bisa langsung menggunakan autobinding dengan metode ShouldBind:
    var form LoginForm
    // dalam kasus ini, binding yang sesuai akan dipilih secara otomatis
    if c.ShouldBind(&form) == nil {
      if form.User == "user" && form.Password == "password" {
        c.JSON(200, gin.H{"status": "you are logged in"})
      } else {
        c.JSON(401, gin.H{"status": "unauthorized"})
      }
    }
  })
  router.Run(":8080")
}
```

Uji dengan:
```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```