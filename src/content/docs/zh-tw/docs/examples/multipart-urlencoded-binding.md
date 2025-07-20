---
title: "Multipart/Urlencoded 綁定"
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
    // 您可以使用明確的綁定宣告來綁定 multipart 表單：
    // c.ShouldBindWith(&form, binding.Form)
    // 或者您可以簡單地使用 ShouldBind 方法進行自動綁定：
    var form LoginForm
    // 在這種情況下，將會自動選擇適當的綁定
    if c.ShouldBind(&form) == nil {
      if form.User == "user" && form.Password == "password" {
        c.JSON(200, gin.H{"status": "您已登入"})
      } else {
        c.JSON(401, gin.H{"status": "未授權"})
      }
    }
  })
  router.Run(":8080")
}
```

使用以下指令進行測試：

```sh
curl -v --form user=user --form password=password http://localhost:8080/login
```
