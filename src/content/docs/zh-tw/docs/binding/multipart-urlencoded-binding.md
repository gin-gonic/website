---
title: "Multipart/Urlencoded 綁定"
sidebar:
  order: 11
---

`ShouldBind` 會自動偵測 `Content-Type` 並將 `multipart/form-data` 或 `application/x-www-form-urlencoded` 請求主體綁定到結構體。使用 `form` 結構體標籤將表單欄位名稱對應到結構體欄位，並使用 `binding:"required"` 來強制必填欄位。

這常用於登入表單、註冊頁面或任何 HTML 表單提交。

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

## 測試

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

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [綁定 HTML 核取方塊](/zh-tw/docs/binding/bind-html-checkbox/)
