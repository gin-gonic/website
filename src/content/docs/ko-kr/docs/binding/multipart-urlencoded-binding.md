---
title: "Multipart/URL 인코딩 바인딩"
sidebar:
  order: 11
---

`ShouldBind`는 자동으로 `Content-Type`을 감지하여 `multipart/form-data` 또는 `application/x-www-form-urlencoded` 요청 바디를 구조체에 바인딩합니다. `form` 구조체 태그를 사용하여 폼 필드 이름을 구조체 필드에 매핑하고, `binding:"required"`를 사용하여 필수 필드를 강제합니다.

이는 로그인 폼, 회원가입 페이지 또는 모든 HTML 폼 제출에 일반적으로 사용됩니다.

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

## 테스트

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

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [HTML 체크박스 바인딩](/ko-kr/docs/binding/bind-html-checkbox/)
