---
title: "Consulta y formulario post"
sidebar:
  order: 5
---

Al manejar una solicitud `POST`, a menudo necesitas leer valores tanto de la cadena de consulta de la URL como del cuerpo de la solicitud. Gin mantiene estas dos fuentes separadas, para que puedas acceder a cada una de forma independiente:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` — lee de la cadena de consulta de la URL.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` — lee del cuerpo de la solicitud `application/x-www-form-urlencoded` o `multipart/form-data`.

Esto es común en APIs REST donde la ruta identifica el recurso (mediante parámetros de consulta como `id`) mientras que el cuerpo lleva la carga útil (como `name` y `message`).

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## Pruébalo

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` solo lee de la cadena de consulta de la URL, y `c.PostForm` solo lee del cuerpo de la solicitud. Nunca se cruzan. Si quieres que Gin verifique ambas fuentes automáticamente, usa `c.ShouldBind` con un struct en su lugar.
:::

## Ver también

- [Parámetros de cadena de consulta](/es/docs/routing/querystring-param/)
- [Map como parámetros de cadena de consulta o postform](/es/docs/routing/map-as-querystring-or-postform/)
- [Formulario Multipart/Urlencoded](/es/docs/routing/multipart-urlencoded-form/)
