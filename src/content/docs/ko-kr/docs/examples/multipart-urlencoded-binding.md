---
title: "Multipart/Urlencoded 바인딩"
draft: false
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
		// 명시적으로 바인딩을 정의하여 multipart form을 바인딩 할 수 있습니다:
		// c.ShouldBindWith(&form, binding.Form)
		// 혹은 ShouldBind 메소드를 사용하여 간단하게 자동으로 바인딩을 할 수 있습니다:
		var form LoginForm
		// 이 경우에는 자동으로 적절한 바인딩이 선택 됩니다
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

다음과 같이 테스트 할 수 있습니다:
```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```
