---
title: "Vincular formularios Multipart/Urlencoded"
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
		// se puede vincular un formulario multipart con declaración explícita:
		// c.ShouldBindWith(&form, binding.Form)
		// o simplemente se hace auto vinculación por médio del método ShouldBind:
		var form LoginForm
		// en este caso la vinculación adecuada se seleccionará automáticamente
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

Puede probarse el código por medio del siguiente curl:
```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```
