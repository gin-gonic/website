---
title: "Vínculo de Várias Partes / URL Codificada"

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
		// tu podes vincular formulário de várias partes com declaração
		// de vínculo explícita: c.ShouldBindWith(&form, binding.Form)
		// ou podes simplesmente usar auto-vinculação com método ShouldBind
		var form LoginForm
		// neste caso o vínculo apropriado será selecionado automaticamente
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

Teste-o coom:

```sh
$ curl -v --form user=user --form password=password http://localhost:8080/login
```
