---
title: "ربط Multipart/Urlencoded"
sidebar:
  order: 11
---

`ShouldBind` يكتشف تلقائياً `Content-Type` ويربط أجسام طلبات `multipart/form-data` أو `application/x-www-form-urlencoded` في هيكل. استخدم علامة الهيكل `form` لربط أسماء حقول النموذج بحقول الهيكل، و`binding:"required"` لفرض الحقول الإلزامية.

يُستخدم هذا بشكل شائع لنماذج تسجيل الدخول وصفحات التسجيل أو أي إرسال نموذج HTML.

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

## اختبره

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

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط مربعات اختيار HTML](/ar/docs/binding/bind-html-checkbox/)
