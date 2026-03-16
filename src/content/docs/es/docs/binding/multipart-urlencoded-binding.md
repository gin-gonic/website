---
title: "Enlace Multipart/Urlencoded"
sidebar:
  order: 11
---

`ShouldBind` detecta automáticamente el `Content-Type` y enlaza cuerpos de solicitud `multipart/form-data` o `application/x-www-form-urlencoded` en un struct. Usa la etiqueta de struct `form` para mapear nombres de campos de formulario a campos del struct, y `binding:"required"` para hacer obligatorios ciertos campos.

Esto se usa comúnmente para formularios de inicio de sesión, páginas de registro o cualquier envío de formulario HTML.

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

## Pruébalo

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

## Ver también

- [Enlace y validación](/es/docs/binding/binding-and-validation/)
- [Enlazar checkboxes HTML](/es/docs/binding/bind-html-checkbox/)
