---
title: "Multipart/URL 인코딩 바인딩"
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
    // 명시적 바인딩 선언으로 multipart 폼을 바인딩할 수 있습니다:
    // c.ShouldBindWith(&form, binding.Form)
    // 또는 ShouldBind 메서드로 자동 바인딩을 간단히 사용할 수 있습니다:
    var form LoginForm
    // 이 경우 적절한 바인딩이 자동으로 선택됩니다
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

다음으로 테스트하세요:
```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```
