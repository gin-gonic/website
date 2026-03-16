---
title: "Multipart/URLエンコードバインディング"
sidebar:
  order: 11
---

`ShouldBind` は自動的に `Content-Type` を検出し、`multipart/form-data` または `application/x-www-form-urlencoded` のリクエストボディを構造体にバインドします。`form` 構造体タグを使用してフォームフィールド名を構造体フィールドにマッピングし、`binding:"required"` で必須フィールドを強制します。

これは、ログインフォーム、登録ページ、またはあらゆるHTMLフォーム送信で一般的に使用されます。

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

## テスト

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

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [HTMLチェックボックスのバインド](/ja/docs/binding/bind-html-checkbox/)
