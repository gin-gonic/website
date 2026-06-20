---
title: "Formulario Multipart/Urlencoded"
sidebar:
  order: 4
---

Usa `c.PostForm()` y `c.DefaultPostForm()` para leer valores de envíos de formularios. Estos métodos funcionan tanto con los tipos de contenido `application/x-www-form-urlencoded` como `multipart/form-data` — las dos formas estándar en que los navegadores envían datos de formularios.

- `c.PostForm("field")` devuelve el valor o una cadena vacía si el campo no existe.
- `c.DefaultPostForm("field", "fallback")` devuelve el valor o el valor predeterminado especificado si el campo no existe.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/form_post", func(c *gin.Context) {
    message := c.PostForm("message")
    nick := c.DefaultPostForm("nick", "anonymous")

    c.JSON(200, gin.H{
      "status":  "posted",
      "message": message,
      "nick":    nick,
    })
  })
  router.Run(":8080")
}
```

## Pruébalo

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Missing nick -- falls back to default "anonymous"
curl -X POST http://localhost:8080/form_post \
  -d "message=hello"
# Output: {"message":"hello","nick":"anonymous","status":"posted"}
```

## Ver también

- [Subir archivos](/es/docs/routing/upload-file/)
- [Consulta y formulario post](/es/docs/routing/query-and-post-form/)
