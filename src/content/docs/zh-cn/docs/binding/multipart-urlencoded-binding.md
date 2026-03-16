---
title: "Multipart/Urlencoded 绑定"
sidebar:
  order: 11
---

`ShouldBind` 会自动检测 `Content-Type`，并将 `multipart/form-data` 或 `application/x-www-form-urlencoded` 请求体绑定到结构体中。使用 `form` 结构体标签将表单字段名映射到结构体字段，使用 `binding:"required"` 来强制必填字段。

这通常用于登录表单、注册页面或任何 HTML 表单提交。

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
    // ShouldBind automatically selects the right binding based on Content-Type
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

## 测试

```sh
# Multipart form
curl -X POST http://localhost:8080/login \
  -F "user=user" -F "password=password"
# Output: {"status":"you are logged in"}

# URL-encoded form
curl -X POST http://localhost:8080/login \
  -d "user=user&password=password"
# Output: {"status":"you are logged in"}

# Wrong credentials
curl -X POST http://localhost:8080/login \
  -d "user=wrong&password=wrong"
# Output: {"status":"unauthorized"}

# Missing required field
curl -X POST http://localhost:8080/login \
  -d "user=user"
# Output: {"error":"Key: 'LoginForm.Password' Error:Field validation for 'Password' failed on the 'required' tag"}
```

## 另请参阅

- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
- [绑定 HTML 复选框](/zh-cn/docs/binding/bind-html-checkbox/)
