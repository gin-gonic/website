---
title: "Multipart/Urlencoded されたデータをバインドする"
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
		// 明示的にバインディングを定義して、multipart form をバインドすることができます。
		// c.ShouldBindWith(&form, binding.Form)
		// あるいは、ShouldBind メソッドを使うことで、シンプルに自動でバインドすることもできます。
		var form LoginForm
		// このケースでは正しいバインディングが自動で選択されます。
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

以下のコードでテストできます。
```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```


