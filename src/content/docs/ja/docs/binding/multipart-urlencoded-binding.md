---
title: "Multipart/URLエンコードバインディング"
sidebar:
  order: 11
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
    // 明示的なバインディング宣言でmultipartフォームをバインドできます：
    // c.ShouldBindWith(&form, binding.Form)
    // または、ShouldBindメソッドで自動バインディングを使用できます：
    var form LoginForm
    // この場合、適切なバインディングが自動的に選択されます
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

テスト方法：
```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```
